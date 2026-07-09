from pydantic import BaseModel, EmailStr, ConfigDict

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str | None = None

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: str
    full_name: str | None = None
    
