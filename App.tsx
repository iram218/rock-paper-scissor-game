
import React, { useState, useRef, useCallback } from 'react';
import { recognizeGesture } from './services/geminiService';
import { Gesture, Result } from './types';
import WebcamFeed from './components/WebcamFeed';
import MoveDisplay from './components/MoveDisplay';
import GameStatus from './components/GameStatus';

const App: React.FC = () => {
  const [playerGesture, setPlayerGesture] = useState<Gesture | null>(null);
  const [computerGesture, setComputerGesture] = useState<Gesture | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const GESTURES: Gesture[] = ['Rock', 'Paper', 'Scissors'];

  const determineWinner = (player: Gesture, computer: Gesture): Result => {
    if (player === computer) return 'tie';
    if (
      (player === 'Rock' && computer === 'Scissors') ||
      (player === 'Scissors' && computer === 'Paper') ||
      (player === 'Paper' && computer === 'Rock')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const handlePlay = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsLoading(true);
    setError(null);
    setPlayerGesture(null);
    setComputerGesture(null);
    setResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
        setError('Could not get canvas context.');
        setIsLoading(false);
        return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    const base64Image = imageDataUrl.split(',')[1];

    try {
      const gesture = await recognizeGesture(base64Image);
      
      if (gesture === 'Unknown') {
        setError("Could not recognize your gesture. Please try again with a clearer hand sign.");
        setIsLoading(false);
        return;
      }

      setPlayerGesture(gesture);

      const computerMove = GESTURES[Math.floor(Math.random() * GESTURES.length)];
      setComputerGesture(computerMove);

      const gameResult = determineWinner(gesture, computerMove);
      setResult(gameResult);
    } catch (err) {
      console.error(err);
      setError('An error occurred while recognizing your gesture. Please check the console and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetGame = () => {
    setPlayerGesture(null);
    setComputerGesture(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };
  
  const handleCameraReady = (isReady: boolean) => {
    setIsCameraReady(isReady);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <header className="mb-4">
        <h1 className="text-5xl md:text-6xl font-bold text-pink-500 font-funky tracking-wider">
          Rock Paper Scissors AI
        </h1>
        <p className="text-gray-400 mt-2">Show your hand to the camera and let the AI guess your move!</p>
      </header>

      <main className="w-full max-w-5xl mx-auto p-4 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-pink-500/50 shadow-lg">
            <WebcamFeed videoRef={videoRef} onCameraReady={handleCameraReady} />
            <canvas ref={canvasRef} className="hidden"></canvas>
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
                <p className="mt-4 text-lg font-semibold">Recognizing Gesture...</p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
             {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg w-full">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4 w-full h-48">
                <MoveDisplay title="Your Move" gesture={playerGesture} isLoading={isLoading} />
                <MoveDisplay title="Computer's Move" gesture={computerGesture} isLoading={isLoading} />
            </div>

            {result ? (
                <GameStatus result={result} onPlayAgain={resetGame} />
            ) : (
                <button
                    onClick={handlePlay}
                    disabled={isLoading || !isCameraReady}
                    className="w-full py-4 px-8 text-xl font-bold bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                >
                    {isLoading ? 'Processing...' : 'Make Your Move!'}
                </button>
            )}
             {!isCameraReady && !isLoading && <p className="text-yellow-400">Waiting for camera access...</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
