import { useState, useEffect } from "react";
import { fetchGameQuestion } from "../services/gameService";

export interface Question {
  question_id: number;
  clue: string;
  options: string[];
}

export const useGame = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loadNewQuestion = async () => {
    setLoading(true);
    setError(""); // Reset error before fetching new data

    try {
      const data = await fetchGameQuestion();
      setQuestion(data);
    } catch (err) {
      setError("Failed to load question. " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewQuestion();
  }, []);

  return { question, loading, error, loadNewQuestion };
};
