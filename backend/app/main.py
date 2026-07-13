from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

from app.routers import auth, users

app = FastAPI(title="Mi App Login")

app.add_middleware(
    CORSMiddleware,
    allow_origins = [settings.frontend_url],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(auth.router)
app.include_router(users.router)


@app.get("/")
async def root():
    return {"message": "API funcionando"}