
import React, { useState, useEffect } from 'react';
import { CircleCheck } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

interface ScoreDisplayProps {
  score: number;
  isVisible: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, isVisible }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const roundedScore = Math.round(score * 100) / 100;
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!isVisible) {
      setDisplayScore(0);
      return;
    }
    
    const duration = 2000; // 2 seconds animation
    const steps = 50;
    const stepValue = roundedScore / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep += 1;
      if (currentStep <= steps) {
        setDisplayScore(Math.min(stepValue * currentStep, roundedScore));
      } else {
        clearInterval(timer);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [isVisible, roundedScore]);
  
  if (!isVisible) return null;
  
  const getScoreColor = () => {
    if (roundedScore >= 80) return 'text-green-400';
    if (roundedScore >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const circleSize = isMobile ? 'w-32 h-32' : 'w-44 h-44';
  
  return (
    <div className={`glass-card rounded-xl ${isMobile ? 'p-5' : 'p-8'} mt-6 md:mt-8 text-center animate-scale-up`}>
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-6 md:mb-8`}>ATS Score (based on keyword analysis)</h2>
      
      <div className="relative inline-block">
        <div className={`${circleSize} rounded-full border-8 border-muted flex items-center justify-center relative animate-pulse-glow`}>
          <span className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold ${getScoreColor()}`}>
            {displayScore.toFixed(1)}
          </span>
          <span className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium absolute -right-2 top-1/3`}>/ 100</span>
          
          <div className={`absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-muted rounded-full p-1 md:p-1.5`}>
            <CircleCheck className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-primary`} />
          </div>
        </div>
        
        <svg className="absolute inset-0" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="440"
            strokeDashoffset={440 - (440 * displayScore) / 100}
            strokeLinecap="round"
            className={`transform -rotate-90 origin-center transition-all duration-1000 ease-out ${getScoreColor()}`}
          />
        </svg>
      </div>
      
      <div className="mt-4 md:mt-6 text-muted-foreground text-xs md:text-sm">
        {roundedScore >= 80 ? (
          <p>Excellent! Your resume is well-optimized for ATS systems.</p>
        ) : roundedScore >= 60 ? (
          <p>Good job! Consider adding a few more keywords for better results.</p>
        ) : (
          <p>Your resume needs optimization. Check the suggestions below.</p>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
