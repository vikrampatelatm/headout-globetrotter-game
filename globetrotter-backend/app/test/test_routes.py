import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app
from app.models.destination import Destination
from app.schemas.destination import DestinationCreate, AnswerRequest

# Create a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override for database session
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create a test client
client = TestClient(app)

# Setup and teardown fixtures
@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

# Sample test data
test_destinations = [
    {
        "city": "Paris",
        "country": "France",
        "clues": ["This city is home to a famous tower that sparkles every night."],
        "fun_fact": ["The Eiffel Tower was supposed to be dismantled after 20 years but was saved because of radio transmissions!"],
        "trivia": ["Paris was originally a Roman city called Lutetia."]
    },
    {
        "city": "Tokyo",
        "country": "Japan",
        "clues": ["This city has the busiest pedestrian crossing in the world."],
        "fun_fact": ["Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!"],
        "trivia": ["Tokyo’s subway system is so efficient that train delays of just a few minutes come with formal apologies."]
    }
]

# Test bulk insert
def test_bulk_insert():
    response = client.post("/destinations/bulk-insert", json=test_destinations)
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["count"] == len(test_destinations)

# Test game question generation
def test_generate_game_question():
    response = client.get("/destinations/game-question")
    assert response.status_code == 200
    data = response.json()["data"]
    assert "clue" in data
    assert "options" in data
    assert "question_id" in data

# Test answer verification
def test_verify_answer():
    question_response = client.get("/destinations/game-question")
    question_data = question_response.json()["data"]
    question_id = question_data["question_id"]
    correct_answer = question_data["options"][0]  # Assuming first option is correct for testing
    
    answer_request = {"question_id": question_id, "user_answer": correct_answer}
    response = client.post("/destinations/verify-answer", json=answer_request)
    assert response.status_code == 200
    assert "is_correct" in response.json()
    assert "fun_fact" in response.json()

    # Test incorrect answer
    answer_request["user_answer"] = "Wrong City"
    response = client.post("/destinations/verify-answer", json=answer_request)
    assert response.status_code == 200
    assert response.json()["is_correct"] is False
