
import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { config } from '@/data/config';

interface KeywordSuggestionsProps {
  keywords: string[];
  isVisible: boolean;
}

const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({ keywords, isVisible }) => {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderedKeywords, setRenderedKeywords] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isVisible && keywords.length > 0) {
      // Reset rendered keywords when keywords change
      setRenderedKeywords([]);
      
      // Get unique keywords to prevent duplicates
      const uniqueKeywords = [...new Set(keywords)];
      
      // Animate keywords appearing one by one
      const timer = setInterval(() => {
        if (renderedKeywords.length < uniqueKeywords.length) {
          setRenderedKeywords(prev => [...prev, uniqueKeywords[renderedKeywords.length]]);
        } else {
          clearInterval(timer);
        }
      }, config.ui.animations.keywordInterval);
      
      return () => clearInterval(timer);
    } else {
      setRenderedKeywords([]);
    }
  }, [isVisible, keywords]);
  
  if (!isVisible || keywords.length === 0) return null;
  
  // Ensure keywords are unique
  const uniqueKeywords = [...new Set(keywords)];
  
  return (
    <div className={`glass-card rounded-xl ${isMobile ? 'p-4' : 'p-6'} mt-6 md:mt-8 animate-slide-up`}>
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <div className="flex items-center gap-1 md:gap-2">
          <List className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-primary`} />
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>Suggested Keywords</h2>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 md:p-2 rounded-md hover:bg-muted/50 transition-colors"
        >
          {expanded ? <ChevronUp className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} /> : <ChevronDown className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />}
        </button>
      </div>
      
      <div
        ref={containerRef}
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          expanded ? 'max-h-[300px] md:max-h-[400px]' : 'max-h-[120px] md:max-h-[150px]'
        }`}
      >
        <div className="flex flex-wrap gap-1.5 md:gap-2 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2">
          {renderedKeywords.map((keyword, index) => (
            <div
              key={`${keyword}-${index}`}
              className={`px-2 md:px-3 py-1 md:py-1.5 bg-muted/50 border border-border rounded-lg text-xs md:text-sm animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {keyword}
            </div>
          ))}
        </div>
      </div>
      
      {!expanded && uniqueKeywords.length > 10 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-gradient-to-t from-card to-transparent pointer-events-none"
          aria-hidden="true"
        />
      )}
      
      <div className="text-center mt-3 md:mt-4">
        <p className="text-xs md:text-sm text-muted-foreground">
          {uniqueKeywords.length} {uniqueKeywords.length === 1 ? 'keyword' : 'keywords'} that could improve your resume
        </p>
      </div>
    </div>
  );
};

export default KeywordSuggestions;
