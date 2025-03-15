import { useState, useEffect, useContext } from "react";
import { fetchGameQuestion, verifyAnswer } from "../services/gameService";
import { GameContext } from "../context/GameContext";
import { motion } from "framer-motion"; // 🎉 Animations
import Confetti from "react-confetti"; // 🎊 Confetti effect
import useWindowSize from "react-use/lib/useWindowSize"; // To adjust confetti size

export interface Question {
  question_id: number;
  clue: string;
  options: string[];
}

const Game = () => {
  const { width, height } = useWindowSize(); // Get screen size for confetti
  const { score, incrementScore, resetGame } = useContext(GameContext)!;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false); // Disable submit after click
  const [showConfetti, setShowConfetti] = useState<boolean>(false); // 🎊 Confetti trigger

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setFunFact(null);
    setSelectedAnswer(null);
    setSubmitted(false); // Re-enable submit button
    setShowConfetti(false); // Reset confetti effect

    try {
      const data = await fetchGameQuestion();
      setQuestion(data.data);
    } catch (err) {
      console.error("Error fetching question:", err);
      setError("Failed to load question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!question || !selectedAnswer || submitted) return;
    setSubmitted(true); // Disable submit button after click

    try {
      const result = await verifyAnswer(question.question_id, selectedAnswer);
      setFunFact(result.fun_fact);
      
      if (result.is_correct) {
        setFeedback("🎉 Correct!");
        setShowConfetti(true); // 🎊 Trigger confetti
        incrementScore();
      } else {
        setFeedback("😢 Wrong! Try again.");
      }
    } catch (error) {
      console.error("Error verifying answer:", error);
      setFeedback("⚠️ Something went wrong. Please try again.");
    }
  };

  const handlePlayAgain = () => {
    resetGame(); // Reset score to 0
    loadNewQuestion(); // Start fresh with a new question
  };

  return (
    <div className="flex flex-col items-center p-6">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* 🎊 Show Confetti when the user is correct */}
      {showConfetti && <Confetti width={width} height={height} />}

      {/* 🏆 Show Score */}
      <p className="text-xl font-bold mb-4">Score: {score}</p>

      {question && (
        <div className="p-6 border rounded shadow-lg bg-white text-center">
          <p className="text-lg font-bold">{question.clue}</p> {/* Display Clue */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {question.options.map((option) => (
              <motion.button
                key={option}
                whileTap={{ scale: 0.95 }} // Button animation
                className={`px-4 py-2 border rounded transition ${
                  selectedAnswer === option ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedAnswer(option)}
              >
                {option}
              </motion.button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded transition disabled:bg-gray-400"
            disabled={!selectedAnswer || submitted} // Disable after clicking
          >
            Submit Answer
          </button>

          {/* 🎭 Feedback Section */}
          {feedback && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 text-lg font-semibold"
            >
              {feedback}
            </motion.p>
          )}

          {/* 🧠 Fun Fact Display */}
          {funFact && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 italic text-gray-700"
            >
              🧠 Fun Fact: {funFact}
            </motion.p>
          )}
        </div>
      )}

      {/* 🎮 Next Question Button (Continue Playing) */}
      <button
        onClick={loadNewQuestion}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded transition"
      >
        Next ➡️
      </button>

      {/* 🔄 Play Again Button (Reset Game) */}
      <button
        onClick={handlePlayAgain}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded transition"
      >
        Play Again 🔄
      </button>
    </div>
  );
};

export default Game;
