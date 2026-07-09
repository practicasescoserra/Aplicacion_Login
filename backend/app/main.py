from fastapi import FastAPI

from app.routers import auth, users

app = FastAPI(title="Mi App Login")

app.include_router(auth.router)
app.include_router(users.router)


@app.get("/")
async def root():
    return {"message": "API funcionando"}