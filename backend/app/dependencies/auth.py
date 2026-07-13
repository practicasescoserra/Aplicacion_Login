# Dependencia de FastAPI: valida el JWT y verifica que el usuario exista y esté activo.
# Se "inyecta" con Depends() en cualquier endpoint que requiera autenticación;
# si falla, corta la petición con 401 antes de llegar al código del endpoint.


from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.user import User
from app.services.security import decode_acces_token   

# Instancia de HTTPBearer para manejar la autenticación con tokens Bearer
bearer_scheme = HTTPBearer()


#Consulta si el usuario sigue existiendo
async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), # FastAPI revisa la peticion y busca el header
        db: AsyncSession = Depends(get_db), # FastAPI inicia automáticamente la sesión de base de datos
) -> User:
    payload = decode_acces_token(credentials.credentials) # Obtiene y decodifica el token de acceso
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,    # Si el token es invalido devuelve un error 401
            detail="No autenticado",
        )
    
    user_id = int (payload["sub"])   # Obtiene el ID del usuario del payload del token
    result = await db.execute(select(User).where(User.id == user_id)) # Ejecuta la consulta en la BD
    user = result.scalar_one_or_none() # Devuelve el usuario si existe, de lo contrario devuelve None

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, # Si el usuario no existe o no está activo devuelve error 401
            detail="Usuario no encontrado",
        )
    
    return user  # Devuelve el usuario autenticado