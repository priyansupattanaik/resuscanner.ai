import React, { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface KeywordSuggestionsProps {
  keywords: string[];
  isVisible: boolean;
}

const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
  keywords,
  isVisible,
}) => {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  if (!isVisible || keywords.length === 0) return null;

  const uniqueKeywords = [...new Set(keywords)];

  return (
    <div className="glass-card p-6 mt-8 animate-in fade-in slide-in-from-bottom-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            Smart Suggestions
          </h2>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      <div
        ref={containerRef}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "max-h-[500px]" : "max-h-[120px]"
        }`}
      >
        <div className="flex flex-wrap gap-2">
          {uniqueKeywords.map((keyword, index) => (
            <div
              key={`${keyword}-${index}`}
              className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-600 shadow-sm hover:shadow-md hover:text-blue-600 hover:border-blue-100 transition-all cursor-default"
            >
              {keyword}
            </div>
          ))}
        </div>
      </div>

      {!expanded && uniqueKeywords.length > 8 && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/90 to-transparent pointer-events-none rounded-b-3xl" />
      )}
    </div>
  );
};

export default KeywordSuggestions;
