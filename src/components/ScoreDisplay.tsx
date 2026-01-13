import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Apple Health-style rings: Thinner stroke, larger radius
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-500";
    if (s >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const colorClass = getColor(score);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Primary Score Card */}
      <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-10">
        {/* Minimal Radial Progress */}
        <div className="relative w-40 h-40 flex-shrink-0">
          {/* Track */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-100"
            />
            {/* Indicator */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={cn(
                "transition-all duration-1000 ease-out",
                colorClass
              )}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-light tracking-tighter text-slate-900">
              {Math.round(score)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
              Score
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex items-center justify-center md:justify-start gap-2">
            {score >= 80 ? (
              <div className="p-1.5 rounded-full bg-emerald-100/50 text-emerald-600">
                <Sparkles className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-1.5 rounded-full bg-amber-100/50 text-amber-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
            <h3 className="text-xl font-semibold text-slate-900">
              {score >= 80
                ? "Excellent Match"
                : score >= 60
                ? "Good Potential"
                : "Needs Improvement"}
            </h3>
          </div>

          <p className="text-slate-500 leading-relaxed text-sm">
            {summary ||
              (score >= 80
                ? "Your resume is highly optimized for this role. The terminology aligns well with industry standards."
                : "We found some gaps in your resume compared to standard requirements. Addressing the missing keywords below could boost your visibility.")}
          </p>
        </div>
      </div>

      {/* Missing Keywords Section */}
      {missingKeywords.length > 0 && (
        <div className="glass-panel rounded-[24px] p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400" />
              Recommended Keywords
            </h4>
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-600 rounded-full px-2.5 font-normal"
            >
              {missingKeywords.length} found
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {missingKeywords.map((keyword, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm text-sm text-slate-600 transition-all hover:border-rose-200 hover:text-rose-600 hover:shadow-md cursor-default"
              >
                <span>{keyword}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
