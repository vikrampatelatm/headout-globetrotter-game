from sqlalchemy import Column, Integer, String, JSON
from app.database import Base

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, unique=True, index=True)
    country = Column(String)
    clues = Column(JSON)
    fun_fact = Column(JSON)
    trivia = Column(JSON)
