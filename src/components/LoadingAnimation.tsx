import { useState, useEffect } from 'react';
import DecryptedText from './ui/DecryptedText';
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
      <div className="text-center md:flex md:items-center md:flex-row md:gap-6">
        
        <DecryptedText
          text="Javier Gomez"
          animateOn="view"
          revealDirection="start"
          speed={50}
          maxIterations={15}
          className={`text-5xl md:text-5xl font-bold  text-gradient from-[#2ABD85] to-[#2AACBD] transition-all duration-1000 ${
            isVisible && !isExiting 
              ? 'opacity-100 translate-y-0 loading-fade-in' 
              : isExiting 
                ? 'opacity-0 -translate-y-5 loading-fade-out'
                : 'opacity-0 translate-y-5'
          }`}
        />
        <div className="mt-3">
          <DecryptedText
          text="Portfolio"
          animateOn="view"
          revealDirection="start"
          speed={60}
          maxIterations={15}
          className={`text-xl md:text-2xl text-muted-foreground transition-all duration-1000 delay-300 ${
            isVisible && !isExiting 
              ? 'opacity-100 translate-y-0 loading-fade-in' 
              : isExiting 
                ? 'opacity-0 -translate-y-5 loading-fade-out'
                : 'opacity-0 translate-y-5'
          }`}
        />
        </div>
        
      </div>
    </div>
  );
};