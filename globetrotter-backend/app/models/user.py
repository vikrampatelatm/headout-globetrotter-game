from sqlalchemy import Column, String, Integer, TIMESTAMP, func
from app.database import Base
import uuid

# User model
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, nullable=False)
    score = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, server_default=func.now())
