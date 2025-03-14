from pydantic import BaseModel
from typing import List

class DestinationBase(BaseModel):
    city: str
    country: str
    clues: List[str]
    fun_fact: List[str]
    trivia: List[str]

class DestinationCreate(DestinationBase):
    pass

class DestinationResponse(DestinationBase):
    id: int

    class Config:
        orm_mode = True
