from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.database import get_db
from app.models.destination import Destination
from app.schemas.destination import AnswerRequest
from app.schemas.destination import DestinationCreate
import random


router = APIRouter(prefix="/destinations", tags=["Destinations"])


# Start a new game round with a random destination and multiple-choice options
@router.get("/game-question")
def generate_game_question(db: Session = Depends(get_db)):
    destinations = db.query(Destination).all()
    if not destinations:
        raise HTTPException(status_code=404, detail="No destinations available")

    question = random.choice(destinations)
    options = random.sample([d.city for d in destinations if d.city != question.city], min(3, len(destinations) - 1))
    options.append(question.city)
    random.shuffle(options)

    return {
        "status": "success",
        "data": {
            "clue": random.choice(question.clues),
            "options": options,
            "question_id": question.id
        }
    }

# Bulk insert destinations into the database
@router.post("/bulk-insert")
def bulk_insert_destinations(data: list[DestinationCreate], db: Session = Depends(get_db)):
    new_destinations = [Destination(**item.dict()) for item in data]
    db.bulk_save_objects(new_destinations)
    db.commit()
    return {
        "status": "success",
        "message": "Destinations added successfully",
        "count": len(new_destinations)
    }

# Verify user answer for a game question
@router.post("/verify-answer")
def verify_answer(request: AnswerRequest, db: Session = Depends(get_db)):
    question = db.query(Destination).filter(Destination.id == request.question_id).first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = question.city.strip().lower() == request.user_answer.strip().lower()
    
    # Pick a random fun fact or a default message if incorrect
    fun_fact = random.choice(question.fun_fact) 

    return {
        "is_correct": is_correct,
        "fun_fact": fun_fact
    }