# App_Login

Aplicación web de autenticación (login) construida como proyecto de aprendizaje, implementando JWT con access tokens y refresh tokens rotativos, sobre un stack containerizado con Docker.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Base de datos | PostgreSQL 17 |
| Backend | Python 3.13 + FastAPI + SQLAlchemy (async) + Alembic |
| Autenticación | JWT (python-jose) + bcrypt (passlib) |
| Frontend | React 19 + Vite + React Router + Tailwind CSS v4 |
| Contenedores | Docker + Docker Compose (multi-stage build en frontend) |
| Servidor de archivos estáticos | Nginx (sirviendo el build de producción del frontend) |

## Arquitectura general

```
┌─────────────┐      HTTP/JSON       ┌─────────────┐      SQL (async)     ┌─────────────┐
│   Frontend   │ ───────────────────▶ │   Backend    │ ───────────────────▶ │  PostgreSQL  │
│ React + Vite │ ◀─────────────────── │   FastAPI    │ ◀─────────────────── │              │
│ (Nginx :80)  │   cookies httpOnly    │   (:8000)    │                       │   (:5432)    │
└─────────────┘                       └─────────────┘                       └─────────────┘
```

Los tres servicios corren en contenedores separados, orquestados por `docker-compose.yml`, comunicándose entre sí por nombre de servicio dentro de la red interna que crea Docker Compose (no por `localhost`).

## Flujo de autenticación

1. **Registro** (`POST /auth/register`): la contraseña se hashea con bcrypt antes de guardarse. Nunca se almacena en texto plano.
2. **Login** (`POST /auth/login`): valida credenciales (usuario o email) y devuelve:
   - Un **access token** (JWT, expira en 60 min) en el body de la respuesta.
   - Un **refresh token** (string aleatorio, expira en 7 días) en una cookie `httpOnly`, `SameSite=Strict`.
   - El refresh token se guarda en la base de datos **hasheado** (SHA-256), nunca en texto plano.
3. **Peticiones protegidas**: el access token viaja en el header `Authorization: Bearer <token>` y se valida sin consultar la base de datos (stateless), salvo una verificación de que el usuario siga existiendo y activo.
4. **Refresh** (`POST /auth/refresh`): cuando el access token expira, se usa la cookie del refresh token para pedir uno nuevo. Cada uso de un refresh token lo **revoca y genera uno nuevo** (rotación), enlazando el token viejo con el nuevo (`replaced_by_token_id`) para trazabilidad y detección de reuso indebido.
5. **Logout** (`POST /auth/logout`): revoca el refresh token actual en la base de datos y borra la cookie.
6. **En el frontend**: el access token vive únicamente en memoria (estado de React), nunca en `localStorage`, para reducir superficie de ataque ante XSS. Al recargar la página, se intenta recuperar la sesión automáticamente vía `/auth/refresh` (aprovechando la cookie). Si una petición protegida falla con `401` durante el uso activo, se reintenta automáticamente tras un refresh silencioso.

## Estructura del proyecto

```
App_Login/
├── backend/
│   ├── app/
│   │   ├── main.py              # punto de entrada, CORS, routers
│   │   ├── config.py            # variables de entorno (Pydantic Settings)
│   │   ├── database.py          # conexión async a Postgres (SQLAlchemy)
│   │   ├── models/               # User, RefreshToken (SQLAlchemy ORM)
│   │   ├── schemas/               # esquemas Pydantic (request/response)
│   │   ├── routers/                # endpoints (auth, users)
│   │   ├── services/               # lógica de hashing y JWT
│   │   └── dependencies/           # dependencias de FastAPI (auth guard)
│   ├── alembic/                    # migraciones de base de datos
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.js           # cliente fetch centralizado
│   │   ├── context/AuthContext.jsx # estado global de sesión (Context API)
│   │   ├── components/ProtectedRoute.jsx
│   │   └── pages/                  # LoginPage, RegisterPage, ProfilePage
│   ├── Dockerfile                  # multi-stage: build (Node) + serve (Nginx)
│   └── nginx.conf
├── docker-compose.yml
└── .env                            # JWT_SECRET_KEY (no se sube a Git)
```

## Cómo levantar el proyecto

### Requisitos previos
- Docker y Docker Compose instalados.

### Pasos

1. Clonar el repositorio.
2. Crear el archivo `.env` en la raíz del proyecto con:
   ```
   JWT_SECRET_KEY=<generar con el comando de abajo>
   ```
   Generar un secreto seguro:
   ```bash
   python3 -c "import secrets; print(secrets.token_hex(32))"
   ```
3. Levantar todo el stack:
   ```bash
   docker compose up -d --build
   ```
4. Verificar:
   - Backend: http://localhost:8000/docs
   - Frontend: http://localhost:5173

Las tablas de la base de datos se crean automáticamente al arrancar el backend, mediante `alembic upgrade head` (definido en el `CMD` del `Dockerfile` del backend).

## Desarrollo local (sin Docker, para backend/frontend)

Postgres corre siempre en Docker. Backend y frontend pueden correrse localmente para desarrollo con recarga en caliente:

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# crear backend/.env con DATABASE_URL, JWT_SECRET_KEY, etc. (ver .env.example)
alembic upgrade head
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Modelo de base de datos

**users**: `id`, `username` (único), `email` (único), `password_hash`, `full_name`, `is_active`, `created_at`, `updated_at`.

**refresh_tokens**: `id`, `user_id` (FK → users, ON DELETE CASCADE), `token_hash` (único), `expires_at`, `revoked`, `replaced_by_token_id` (auto-referencia, ON DELETE SET NULL), `created_at`.

## Notas de seguridad implementadas

- Contraseñas hasheadas con bcrypt (nunca texto plano ni cifrado reversible).
- Refresh tokens hasheados en base de datos (SHA-256).
- Access tokens de corta duración (60 min) + refresh tokens rotativos.
- Cookies del refresh token: `httpOnly` (inaccesible desde JavaScript), `SameSite=Strict` (mitiga CSRF).
- Mensajes de error genéricos en login para evitar enumeración de usuarios.
- CORS restringido a un origen específico (no `*`), con credenciales habilitadas.
- Secretos (JWT key, credenciales de base de datos) fuera del código fuente, vía variables de entorno.

### Pendiente antes de un despliegue en producción real
- Cambiar `secure=False` a `True` en las cookies (requiere HTTPS).
- Servir la aplicación completa bajo HTTPS.
- Ajustar `FRONTEND_URL`/CORS al dominio real de producción.

## Aprendizajes clave del proyecto

- Diseño de base de datos relacional con integridad referencial (FKs, cascadas).
- Migraciones de base de datos versionadas con Alembic.
- Autenticación stateless con JWT y el patrón de refresh token rotativo.
- Manejo de estado global en React con Context API y hooks (`useState`, `useEffect`, `useRef`, `useContext`).
- CORS, cookies `httpOnly` y comunicación cross-origin entre frontend y backend.
- Containerización con Docker, incluyendo builds multi-etapa para optimizar imágenes de producción.
