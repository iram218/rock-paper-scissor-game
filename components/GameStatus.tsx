
import React from 'react';
import { Result } from '../types';

interface GameStatusProps {
  result: Result;
  onPlayAgain: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({ result, onPlayAgain }) => {
  const getResultMessage = () => {
    switch (result) {
      case 'win':
        return { message: 'You Win!', color: 'text-green-400' };
      case 'lose':
        return { message: 'You Lose!', color: 'text-red-400' };
      case 'tie':
        return { message: "It's a Tie!", color: 'text-yellow-400' };
      default:
        return { message: '', color: '' };
    }
  };

  const { message, color } = getResultMessage();

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <h2 className={`text-6xl font-bold font-funky tracking-wider ${color}`}>{message}</h2>
      <button
        onClick={onPlayAgain}
        className="w-full py-4 px-8 text-xl font-bold bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameStatus;
