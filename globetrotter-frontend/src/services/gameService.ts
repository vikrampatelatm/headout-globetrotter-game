import { api } from "./api";

export const fetchGameQuestion = async () => {
  const response = await api.get("/destinations/game-question");
  return response.data;
};

export const verifyAnswer = async (questionId: number, userAnswer: string) => {
  const response = await api.post("/destinations/verify-answer", {
    question_id: questionId,
    user_answer: userAnswer,
  });
  return response.data;
};
