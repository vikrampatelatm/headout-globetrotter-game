import { useState, useEffect, useContext } from "react";
import { fetchGameQuestion, verifyAnswer } from "../services/gameService";
import { GameContext } from "../context/GameContext";

export interface Question {
  question_id: number;
  clue: string;
  options: string[];
}

const Game = () => {
  const { incrementScore } = useContext(GameContext)!;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [funFact, setFunFact] = useState<string | null>(null);

  // Fetch new question on component mount
  useEffect(() => {
    loadNewQuestion();
  }, []);

  // Function to fetch a new game question
  const loadNewQuestion = async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setSelectedAnswer(null);
    try {
      const data = await fetchGameQuestion();
      setQuestion(data.data); // Extracting `data` from API response
    } catch (err) {
      console.error("Error fetching question:", err);
      setError("Failed to load question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle answer submission
  const handleSubmit = async () => {
    if (!question || !selectedAnswer) return;

    try {
      const result = await verifyAnswer(question.question_id, selectedAnswer);
      setFunFact(result.fun_fact)
      if (result.is_correct) {
        setFeedback(`🎉 Correct!`);
        incrementScore();
      } else {
        setFeedback(`😢 Wrong! Try again.`);
      }
    } catch (error) {
      console.error("Error verifying answer:", error);
      setFeedback("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {question && (
        <div className="p-4 border rounded shadow-lg">
          <p className="text-lg font-bold">{question.clue}</p> {/* Displaying clue */}
          <div className="mt-4">
            {question.options.map((option) => (
              <button
                key={option}
                className={`px-4 py-2 m-2 border rounded ${
                  selectedAnswer === option ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setSelectedAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </button>
          {feedback && <p className="mt-2">{feedback}</p>}
          <h3>{funFact}</h3>
        </div>
      )}

      <button
        onClick={loadNewQuestion}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next Question
      </button>
    </div>
  );
};

export default Game;