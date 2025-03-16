# Headout Globetrotter Game

## 🌍 About the Project
The **Globetrotter Challenge** is a fun travel guessing game where users guess famous destinations based on clues. The game provides multiple-choice options and fun facts after each answer. It leverages AI-expanded datasets and backend data storage for an engaging experience.

---

## 🏗️ Tech Stack
### Frontend:
- React (Vite + TypeScript)
- TailwindCSS
- Axios
- Framer Motion & React Confetti (for animations)
- Jest & React Testing Library (for unit testing)

### Backend:
- FastAPI
- PostgreSQL
- SQLAlchemy & Alembic (for database migrations)
- Uvicorn (for running the server)
- Pytest & HTTPX (for API testing)

---

## 🚀 Setup & Installation
Follow these steps to set up the project on your local machine.

### 1️⃣ Clone the Repository
```sh
 git clone https://github.com/vikrampatelatm/headout-globetrotter-game.git
 cd headout-globetrotter-game
```

---

## 🖥️ Frontend Setup

### 2️⃣ Install Frontend Dependencies
```sh
cd frontend
npm install
```

### 3️⃣ Start the Development Server
```sh
npm run dev
```

### 4️⃣ Additional Packages
If not already installed, add the required dependencies:
```sh
npm install tailwindcss @tailwindcss/postcss postcss axios react-confetti framer-motion react-use
npm install --save-dev jest @testing-library/react @testing-library/jest-dom msw
```

---

## 🛠️ Backend Setup

### 5️⃣ Set Up Python Virtual Environment
```sh
cd backend
python -m venv venv
# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

### 6️⃣ Install Backend Dependencies
```sh
pip install -r requirements.txt
```
If the `requirements.txt` file is missing, install manually:
```sh
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic python-dotenv pytest pytest-asyncio httpx
```

### 7️⃣ Start the FastAPI Server
```sh
uvicorn app.main:app --reload
```

---

## 🛢️ Database Setup

### 8️⃣ Set Up PostgreSQL Database
Ensure PostgreSQL is running, then update your `.env` file:
```sh
DATABASE_URL=postgresql://username:password@localhost:5432/globetrotter_db
```
Run database migrations:
```sh
alembic upgrade head
```

---

## 📜 API Endpoints

### Game Routes
- `GET /destinations/game-question` → Get a new game question
- `POST /destinations/bulk-insert` → Add multiple destinations
- `POST /destinations/verify-answer` → Verify user's answer

### User & Score Routes
- `POST /user/register` → Register a user

---

## 🧪 Running Tests

### Frontend Tests
```sh
cd frontend
npm test
```

### Backend Tests
```sh
cd backend
pytest
```

---

## 🏆 Future Enhancements
- 🌟 AI-based clue generation
- 🏅 Achievements & Badges
- 📊 Leaderboard & Multiplayer Mode
- 🌐 Deploying on AWS/GCP
