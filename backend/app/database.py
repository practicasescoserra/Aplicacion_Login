from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

engine = create_async_engine(settings.database_url, echo=True) # echo true para mostrar en la terminal el codigo SQL que se ejecuta

# Creador de sesiones asíncronas para interactuar con la base de datos
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Clase que todos los modelos heredan para que SQLAlchemy sepa que son tablas reales
class Base(DeclarativeBase):
    pass

# Abre y cierra la sesión de la base de datos para cada solicitud HTTP que llega a un endpoint
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session