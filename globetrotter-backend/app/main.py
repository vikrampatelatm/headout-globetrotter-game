from fastapi import FastAPI
from app.routes import destination, user

app = FastAPI()

app.include_router(destination.router)
app.include_router(user.router)
