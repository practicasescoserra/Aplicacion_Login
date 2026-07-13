from pydantic import BaseModel

# Lo que espera para hacer login 
class LoginRequest(BaseModel):
    identifier: str # identifier porque pude ser el email o usuario
    password: str

# Como manda el token de salida
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"