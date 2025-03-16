import { useState, useEffect, useContext } from "react";
import { fetchGameQuestion, verifyAnswer } from "../services/gameService";
import { GameContext } from "../context/GameContext";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import ChallengeFriend from "../components/ChallengeFriend";

export interface Question {
  question_id: number;
  clue: string;
  options: string[];
}

const Game = () => {
  const { width, height } = useWindowSize();
  const { score, incrementScore } = useContext(GameContext)!;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setFunFact(null);
    setSelectedAnswer(null);
    setSubmitted(false);
    setShowConfetti(false);

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
    setSubmitted(true);
  
    try {
      const result = await verifyAnswer(question.question_id, selectedAnswer);
      setFunFact(result.fun_fact);
  
      if (result.is_correct) {
        setFeedback("🎉 Correct!");
        setShowConfetti(true);
        incrementScore();
  
        // Stop confetti after 3 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 10000);
        
      } else {
        setFeedback("😢 Wrong! Try again.");
      }
    } catch (error) {
      console.error("Error verifying answer:", error);
      setFeedback("⚠️ Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-full bg-[#f5f0e8] text-black p-8">
      {showConfetti && <Confetti width={width} height={height} />}

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 text-4xl font-extrabold text-orange-500"
      >
        The Globetrotter Challenge
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-20 bg-white px-6 py-2 text-2xl font-bold rounded-full shadow-lg border border-gray-300"
      >
        Score: <span className="text-green-600">{score}</span>
      </motion.div>

      <div className="flex-grow mb-5 flex justify-center items-center w-full">
        {loading && <p className="text-lg font-medium">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {question && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 max-w-xl bg-white text-black rounded-2xl shadow-lg text-center border border-gray-300"
          >
            <p className="text-3xl font-bold mb-6">{question.clue}</p>

            <div className="grid grid-cols-2 gap-4">
              {question.options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAnswer(option)}
                  className={`p-4 rounded-xl text-lg font-medium shadow-md border-2 border-black transition-all ${
                    selectedAnswer === option
                      ? "bg-green-400 text-white"
                      : "bg-white hover:bg-gray-200"
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 px-8 py-3 bg-orange-500 text-white text-lg font-semibold rounded-xl transition hover:bg-orange-600 disabled:bg-gray-400 shadow-md border-2 border-black"
              disabled={!selectedAnswer || submitted}
            >
              Submit Answer
            </button>

            {feedback && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 text-xl font-bold"
              >
                {feedback}
              </motion.p>
            )}

            {funFact && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-yellow-100 text-gray-800 rounded-lg shadow-md border border-yellow-300"
              >
                <p className="text-lg font-semibold">Fun Fact:</p>
                <p className="italic text-md">{funFact}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-12 flex justify-center items-center space-x-6">
        <button className="p-3 px-6 bg-orange-500 text-white shadow-md border-2 border-black rounded-xl text-lg transition hover:bg-orange-600">
          Play Again
        </button>
        <button
          onClick={loadNewQuestion}
          className="p-3 px-6 bg-orange-500 text-white shadow-md border-2 border-black rounded-xl text-lg transition hover:bg-orange-600"
        >
          Next Question
        </button>
        <ChallengeFriend/>
      </div>
    </div>
  );
};

export default Game;
