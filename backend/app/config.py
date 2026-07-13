from pydantic_settings import BaseSettings

# Lee la variable de entorno y la convierte en atributos de pyhton
class Settings(BaseSettings):
    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str
    access_token_expire_minutes:int
    refresh_token_expire_days: int
    frontend_url: str

    # Le dice a pydantic donde buscar el .env
    class Config:
        env_file = ".env"

settings = Settings() # Se crea el objeto listo para ser importado 
