from fastapi import FastAPI
from app.routes import destination, user
from contextlib import asynccontextmanager
from app.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)



app.include_router(destination.router)
app.include_router(user.router)