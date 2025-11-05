
import React, { useEffect, useState } from 'react';

interface WebcamFeedProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onCameraReady: (isReady: boolean) => void;
}

const WebcamFeed: React.FC<WebcamFeedProps> = ({ videoRef, onCameraReady }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const getCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          onCameraReady(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please grant permission and refresh the page.");
        onCameraReady(false);
      }
    };
    
    getCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      onCameraReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, onCameraReady]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      {error && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      )}
    </>
  );
};

export default WebcamFeed;
