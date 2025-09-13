import { useState, useEffect } from 'react';

interface LoadingAnimationProps {
  onComplete: () => void;
}

export const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start fade-in animation
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    // Start fade-out animation
    const fadeOutTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Complete animation and hide component
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="text-center">
        <h1 
          className={`text-5xl md:text-7xl font-bold mb-4 transition-all duration-1000 ${
            isVisible && !isExiting 
              ? 'opacity-100 translate-y-0 loading-fade-in' 
              : isExiting 
                ? 'opacity-0 -translate-y-5 loading-fade-out'
                : 'opacity-0 translate-y-5'
          }`}
        >
          <span className="text-gradient">Javier Gomez</span>
        </h1>
        <p 
          className={`text-xl md:text-2xl text-muted-foreground transition-all duration-1000 delay-300 ${
            isVisible && !isExiting 
              ? 'opacity-100 translate-y-0 loading-fade-in' 
              : isExiting 
                ? 'opacity-0 -translate-y-5 loading-fade-out'
                : 'opacity-0 translate-y-5'
          }`}
        >
          Portfolio
        </p>
      </div>
    </div>
  );
};