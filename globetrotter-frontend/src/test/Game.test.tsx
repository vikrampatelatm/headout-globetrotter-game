import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Game from "../pages/Game";
import "@testing-library/jest-dom";
import { fetchGameQuestion, verifyAnswer } from "../services/gameService";
import { beforeEach, describe, expect, vi, it } from "vitest";
import { GameContext } from "../context/GameContext";

// Mock react-confetti to avoid canvas errors
vi.mock("react-confetti", () => {
  return {
    __esModule: true,
    default: () => null, // Returns null to avoid rendering
  };
});

// Mock the API functions
vi.mock("../services/gameService", () => ({
  fetchGameQuestion: vi.fn(),
  verifyAnswer: vi.fn(),
}));

describe("Game Component", () => {
  const mockQuestion = {
    question_id: 1,
    clue: "Which city is known as the City of Love?",
    options: ["Paris", "New York", "Tokyo", "London"],
  };

  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test
  });

  it("renders the game component and fetches a question", async () => {
    vi.mocked(fetchGameQuestion).mockResolvedValue({ data: mockQuestion });

    render(
      <GameContext.Provider value={{ score: 0, incrementScore: vi.fn(), resetGame: vi.fn() }}>
        <Game />
      </GameContext.Provider>
    );

    expect(screen.getByText("The Globetrotter Challenge")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Which city is known as the City of Love?"))
        .toBeInTheDocument();
    });
  });

  it("selects an answer and submits it", async () => {
    vi.mocked(fetchGameQuestion).mockResolvedValue({ data: mockQuestion });
    vi.mocked(verifyAnswer).mockResolvedValue({ is_correct: true, fun_fact: "Paris is famous for its romance." });

    render(
      <GameContext.Provider value={{ score: 0, incrementScore: vi.fn(), resetGame: vi.fn() }}>
        <Game />
      </GameContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Which city is known as the City of Love?"))
        .toBeInTheDocument();
    });

    const parisButton = screen.getByText("Paris");
    fireEvent.click(parisButton);

    const submitButton = screen.getByText("Submit Answer");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("🎉 Correct!"))
        .toBeInTheDocument();
    });

    expect(screen.getByText("Fun Fact:")).toBeInTheDocument();
  });

  it("handles incorrect answers", async () => {
    vi.mocked(fetchGameQuestion).mockResolvedValue({ data: mockQuestion });
    vi.mocked(verifyAnswer).mockResolvedValue({ is_correct: false });

    render(
      <GameContext.Provider value={{ score: 0, incrementScore: vi.fn(), resetGame: vi.fn() }}>
        <Game />
      </GameContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Which city is known as the City of Love?"))
        .toBeInTheDocument();
    });

    const tokyoButton = screen.getByText("Tokyo");
    fireEvent.click(tokyoButton);

    const submitButton = screen.getByText("Submit Answer");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("😢 Wrong! Try again."))
        .toBeInTheDocument();
    });
  });
});
