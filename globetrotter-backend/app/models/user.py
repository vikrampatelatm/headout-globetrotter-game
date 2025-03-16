from sqlalchemy import Column, String, Integer, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, nullable=False)
    score = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # NEW: Store who invited this user
    referrer_id = Column(String, ForeignKey("users.id"), nullable=True)
    referrer = relationship("User", remote_side=[id])
