from pydantic import BaseModel, Field, field_validator
from typing import Optional

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    score: int = 0  # Default score is 0
    referrer_id: Optional[str] = None  # Optional referrer field

    @field_validator("username")
    @classmethod
    def username_format(cls, v: str) -> str:
        return v.strip()  # Trim spaces
