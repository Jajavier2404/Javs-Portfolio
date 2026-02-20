import { useState, useEffect } from "react";

interface TypewriterProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
}

const Typewriter = ({ texts, speed = 80, deleteSpeed = 40, pauseTime = 2000 }: TypewriterProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentChar < text.length) {
            setCurrentChar((c) => c + 1);
          } else {
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          if (currentChar > 0) {
            setCurrentChar((c) => c - 1);
          } else {
            setIsDeleting(false);
            setCurrentTextIndex((i) => (i + 1) % texts.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed
    );

    return () => clearTimeout(timeout);
  }, [currentChar, isDeleting, currentTextIndex, texts, speed, deleteSpeed, pauseTime]);

  const displayText = texts[currentTextIndex].slice(0, currentChar);

  return (
    <span className="text-primary">
      {displayText}
      <span className="animate-pulse-neon text-primary">|</span>
    </span>
  );
};

export default Typewriter;
