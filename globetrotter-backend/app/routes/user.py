from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register")
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    username_cleaned = user_data.username.strip()

    existing_user = db.query(User).filter(User.username.ilike(username_cleaned)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    new_user = User(username=username_cleaned, referrer_id=user_data.referrer_id,score=user_data.score)
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error. Please try again.")

    return {"message": "User registered successfully", "user_id": new_user.id, "username": new_user.username}


@router.get("/invite/{username}")
def invite_friend(username: str, db: Session = Depends(get_db)):
    inviter = db.query(User).filter(User.username.ilike(username)).first()
    if not inviter:
        raise HTTPException(status_code=404, detail="User not found")

    invite_link = f"https://yourgame.com/invite/{inviter.username}"

    return {
        "message": f"{inviter.username} is inviting you to play!",
        "score": inviter.score,
        "invite_link": invite_link
    }


@router.get("/score")
def get_user_score(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"score": user.score}