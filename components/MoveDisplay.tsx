
import React from 'react';
import { Gesture } from '../types';
import { RockIcon, PaperIcon, ScissorsIcon, QuestionMarkIcon } from './Icons';

interface MoveDisplayProps {
  title: string;
  gesture: Gesture | null;
  isLoading: boolean;
}

const MoveDisplay: React.FC<MoveDisplayProps> = ({ title, gesture, isLoading }) => {
  const renderIcon = () => {
    if (isLoading && !gesture) {
        return <div className="animate-pulse w-24 h-24 bg-gray-600 rounded-full"></div>;
    }
    switch (gesture) {
      case 'Rock':
        return <RockIcon className="w-24 h-24 text-gray-300" />;
      case 'Paper':
        return <PaperIcon className="w-24 h-24 text-gray-300" />;
      case 'Scissors':
        return <ScissorsIcon className="w-24 h-24 text-gray-300" />;
      default:
        return <QuestionMarkIcon className="w-24 h-24 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 bg-gray-700/50 rounded-lg h-full">
      <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
      <div className="flex-grow flex items-center justify-center">
        {renderIcon()}
      </div>
      <div className="h-16 flex items-center justify-center">
        {gesture && gesture !== 'Unknown' && (
            <p className="text-5xl text-pink-500 font-funky tracking-wide transform -rotate-6">
                {gesture}
            </p>
        )}
      </div>
    </div>
  );
};

export default MoveDisplay;
