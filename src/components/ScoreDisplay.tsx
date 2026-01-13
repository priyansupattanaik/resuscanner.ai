import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Sparkles } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  isVisible: boolean;
  missingKeywords?: string[];
  summary?: string;
}

const ScoreDisplay = ({
  score,
  isVisible,
  missingKeywords = [],
  summary,
}: ScoreDisplayProps) => {
  if (!isVisible) return null;

  // Calculate circle dash array
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "text-green-500";
    if (s >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const colorClass = getColor(score);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Score Card */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24" />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          {/* Radial Progress */}
          <div className="relative w-40 h-40 flex-shrink-0">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100"
              />
              {/* Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`${colorClass} transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold tracking-tighter text-slate-800">
                {Math.round(score)}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Score
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {score >= 80
                  ? "Excellent Match"
                  : score >= 60
                  ? "Good Potential"
                  : "Needs Improvement"}
              </h3>
              <p className="text-slate-500 mt-2 leading-relaxed">
                {summary ||
                  (score >= 80
                    ? "Your resume is highly optimized for this role. Great job!"
                    : "We found some gaps in your resume compared to standard requirements.")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Keywords */}
      {missingKeywords.length > 0 && (
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Missing Keywords
            </h4>
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-600 rounded-full px-3"
            >
              {missingKeywords.length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((keyword, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium hover:bg-red-100 transition-colors cursor-default"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
