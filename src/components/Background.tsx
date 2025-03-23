
import React, { useEffect, useRef } from 'react';
import { config } from '@/data/config';

interface BackgroundProps {
  isLoading?: boolean;
}

const Background: React.FC<BackgroundProps> = ({ isLoading = false }) => {
  const starsRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const createStars = () => {
      if (!starsRef.current) return;
      
      // Clear existing stars
      starsRef.current.innerHTML = '';
      
      const starsContainer = starsRef.current;
      const starCount = Math.floor((window.innerWidth * window.innerHeight) / 5000);
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random size (1-3px)
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random opacity
        star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
        
        // Random animation duration and delay
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        star.style.setProperty('--delay', `${Math.random() * 5}s`);
        
        starsContainer.appendChild(star);
      }
    };
    
    // Create stars initially
    createStars();
    
    // Recreate stars on window resize
    window.addEventListener('resize', createStars);
    
    return () => {
      window.removeEventListener('resize', createStars);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Control star movement based on loading state
  useEffect(() => {
    let position = 0;
    const stars = starsRef.current;
    
    if (!stars) return;
    
    const animateStars = () => {
      if (!stars) return;
      
      const speed = isLoading 
        ? config.ui.animations.loadingStarSpeed 
        : config.ui.animations.normalStarSpeed;
      
      position -= speed;
      stars.style.transform = `translateX(${position}px)`;
      
      // Reset position when it's too far
      if (Math.abs(position) > window.innerWidth * 2) {
        position = 0;
      }
      
      animationRef.current = requestAnimationFrame(animateStars);
    };
    
    // Start animation
    animateStars();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoading]);
  
  return (
    <>
      <div className="fixed inset-0 bg-cosmic-dark z-[-2] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cosmic-blue/20 via-transparent to-transparent"></div>
        <div className="stars" ref={starsRef}></div>
      </div>
      <div className="fixed inset-0 bg-cyber-grid bg-[length:40px_40px] z-[-1] opacity-20"></div>
    </>
  );
};

export default Background;
