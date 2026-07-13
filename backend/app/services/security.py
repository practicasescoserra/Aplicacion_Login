from datetime import datetime, timedelta
import secrets
import hashlib

from passlib.context import CryptContext
from jose import jwt, JWTError

from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # Objeto passlib para usar bcrypt

# Hashea contraseña
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Compara una contraseña sin hashear contra una ya hasheada
def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)

# Arma el payload del JWT con sub (user id convertido a string) y exp (fecha de expiracion)
def create_access_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": str(user_id), "exp": expire}

    # Firma todo con el secret key usando el algoritmo HS256
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

# Intenta verificar la firma y la expiracion del token recibido, si algo falla la libreria jose lanza JWTError que se convierte a None
def decode_acces_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None # Se convierte a None para solo tener que verificar si es None para ver si es invalido

# Genera un string aleatorio para el refresh token
def generate_refresh_token() -> str:
    return secrets.token_urlsafe(64)

# Hashea el refresh token usando SHA256 (Mas rapido que bcrypt) porque el token ya es aleatorio y largo
def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()