from pydantic import BaseModel

# Schema for user registration request
class UserCreate(BaseModel):
    username: str
