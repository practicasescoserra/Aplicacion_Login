from fastapi import APIRouter, Depends

from app.models.user import User
from app.schemas.user import UserResponse
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"]) # Prefijo para el router

# Prueba de endpoint para obtener el usuario actual (para probar la autenticación)
@router.get("/me", response_model=UserResponse)
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user