import { api } from "./api";

// Register User
export const registerUser = async (username: string,score:number) => {
  const response = await api.post("/users/register", { username ,score});
  return response.data;
};

// Fetch User Score
export const fetchUserScore = async (username: string) => {
  const response = await api.get(`/users/score?username=${username}`);
  return response.data.score;
};
