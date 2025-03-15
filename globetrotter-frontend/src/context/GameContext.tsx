import { createContext, useState, ReactNode } from "react";

interface GameContextType {
  score: number;
  incrementScore: () => void;
  resetGame: () => void;
}

export const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);

  const incrementScore = () => setScore((prev) => prev + 1);
  const resetGame = () => setScore(0);

  return (
    <GameContext.Provider value={{ score, incrementScore, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};
