"use client";

import { useState, useEffect } from "react";

const EMPTY = "";
const HUMAN = "X";
const AI = "O";

type Mode = "pvp" | "pvc";
type Difficulty = "easy" | "medium" | "hard";

export default function TicTacToe() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(EMPTY));
  const [turn, setTurn] = useState<string>(HUMAN);
  const [mode, setMode] = useState<Mode>("pvc");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [winner, setWinner] = useState<string | null>(null);
  const [draw, setDraw] = useState<boolean>(false);

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (b: string[]): string | null => {
    for (const combo of winningCombos) {
      const [a, bIdx, c] = combo;
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
        return b[a];
      }
    }
    return null;
  };

  const isDraw = (b: string[]): boolean => b.every((cell) => cell !== EMPTY);

  const makeMove = (index: number) => {
    if (board[index] !== EMPTY || winner) return;
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      return;
    }
    if (isDraw(newBoard)) {
      setDraw(true);
      return;
    }
    setTurn(turn === HUMAN ? AI : HUMAN);
  };

  // AI logic
  const aiMove = () => {
    if (mode !== "pvc" || turn !== AI || winner) return;
    let move: number;
    if (difficulty === "easy") {
      const emptyIndices = board
        .map((cell, idx) => (cell === EMPTY ? idx : null))
        .filter((v): v is number => v !== null);
      move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    } else if (difficulty === "medium") {
      // Basic strategy: win if possible, block opponent, else random
      move = findWinningMove(board, AI) ?? findWinningMove(board, HUMAN) ?? randomMove();
    } else {
      // Hard: minimax
      move = minimax(board, AI).index;
    }
    makeMove(move);
  };

  const randomMove = (): number => {
    const emptyIndices = board
      .map((cell, idx) => (cell === EMPTY ? idx : null))
      .filter((v): v is number => v !== null);
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  };

  const findWinningMove = (b: string[], player: string): number | null => {
    for (let i = 0; i < 9; i++) {
      if (b[i] === EMPTY) {
        const testBoard = [...b];
        testBoard[i] = player;
        if (checkWinner(testBoard) === player) return i;
      }
    }
    return null;
  };

  const minimax = (b: string[], player: string): { index: number; score: number } => {
    const avail = b
      .map((cell, idx) => (cell === EMPTY ? idx : null))
      .filter((v): v is number => v !== null);

    if (checkWinner(b) === HUMAN) return { index: -1, score: -10 };
    if (checkWinner(b) === AI) return { index: -1, score: 10 };
    if (avail.length === 0) return { index: -1, score: 0 };

    const moves = avail.map((index) => {
      const newBoard = [...b];
      newBoard[index] = player;
      const result = minimax(newBoard, player === AI ? HUMAN : AI);
      return { index, score: result.score };
    });

    const best = player === AI
      ? moves.reduce((prev, curr) => (curr.score > prev.score ? curr : prev))
      : moves.reduce((prev, curr) => (curr.score < prev.score ? curr : prev));

    return best;
  };

  useEffect(() => {
    aiMove();
  }, [turn, board, mode, difficulty]);

  const resetGame = () => {
    setBoard(Array(9).fill(EMPTY));
    setTurn(HUMAN);
    setWinner(null);
    setDraw(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex flex-col items-center mb-4">
        <div className="flex space-x-2 mb-2">
          <button
            className={`px-3 py-1 rounded ${mode === "pvc" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setMode("pvc")}
          >
            Player vs Computer
          </button>
          <button
            className={`px-3 py-1 rounded ${mode === "pvp" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setMode("pvp")}
          >
            Player vs Player
          </button>
        </div>
        {mode === "pvc" && (
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded ${difficulty === "easy" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              onClick={() => setDifficulty("easy")}
            >
              Easy
            </button>
            <button
              className={`px-3 py-1 rounded ${difficulty === "medium" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              onClick={() => setDifficulty("medium")}
            >
              Medium
            </button>
            <button
              className={`px-3 py-1 rounded ${difficulty === "hard" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              onClick={() => setDifficulty("hard")}
            >
              Hard
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className="w-16 h-16 border border-gray-300 rounded text-2xl font-bold flex items-center justify-center"
            onClick={() => makeMove(idx)}
          >
            {cell}
          </button>
        ))}
      </div>

      {(winner || draw) && (
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">
            {winner ? `${winner} wins!` : "It's a draw!"}
          </h2>
          <button
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded"
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
