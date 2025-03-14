from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.destination import Destination
from app.schemas.destination import DestinationCreate, DestinationResponse
import random

router = APIRouter(prefix="/destinations", tags=["Destinations"])

# Get random destination
@router.get("/random", response_model=DestinationResponse)
def get_random_destination(db: Session = Depends(get_db)):
    destinations = db.query(Destination).all()
    if not destinations:
        raise HTTPException(status_code=404, detail="No destinations found")
    return random.choice(destinations)

# Get destination by city
@router.get("/{city}", response_model=DestinationResponse)
def get_destination(city: str, db: Session = Depends(get_db)):
    destination = db.query(Destination).filter(Destination.city == city).first()
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    return destination

# Add new destination
@router.post("/", response_model=DestinationResponse)
def add_destination(destination: DestinationCreate, db: Session = Depends(get_db)):
    new_destination = Destination(**destination.dict())
    db.add(new_destination)
    db.commit()
    db.refresh(new_destination)
    return new_destination
