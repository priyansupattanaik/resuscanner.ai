import React from "react";
import { ScanResult } from "@/lib/atsScanner";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ListChecks,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  result: ScanResult;
}

const ScoreDisplay = ({ result }: ScoreDisplayProps) => {
  const { score, missingKeywords, summary } = result;

  const getStatus = (s: number) => {
    if (s < 15)
      return {
        color: "bg-black",
        text: "AUTO-REJECTED",
        textCol: "text-red-600",
      }; // New Reject State
    if (s >= 80)
      return {
        color: "bg-emerald-500",
        text: "Strong Match",
        textCol: "text-emerald-700",
      };
    if (s >= 60)
      return {
        color: "bg-amber-400",
        text: "Good Match",
        textCol: "text-amber-700",
      };
    return {
      color: "bg-rose-500",
      text: "Low Match",
      textCol: "text-rose-700",
    };
  };

  const status = getStatus(score);

  // Special UI for Auto-Rejection (Score < 15)
  if (score < 15) {
    return (
      <div className="space-y-6 h-full overflow-y-auto pr-1">
        <div className="bg-rose-50 border-2 border-rose-500 p-8 neo-shadow text-center">
          <Ban className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="font-heading font-bold text-3xl uppercase text-rose-600 mb-2">
            Application Rejected
          </h2>
          <p className="font-sans text-lg text-rose-800 mb-6">
            TAS System: This resume is a critical mismatch for the target role.
          </p>
          <div className="bg-white border border-rose-200 p-4 text-left">
            <p className="font-mono text-sm text-rose-700 font-bold uppercase mb-2">
              System Feedback:
            </p>
            <p className="font-sans text-sm text-slate-700">{summary}</p>
          </div>
        </div>
      </div>
    );
  }

  // Standard UI for Valid Resumes
  return (
    <div className="space-y-6 h-full overflow-y-auto pr-1">
      {/* Top Row: Score & Summary */}
      <div className="grid grid-cols-1 gap-6">
        {/* Score Block */}
        <div className="bg-white border-2 border-black p-6 neo-shadow relative overflow-hidden group hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-1">
                Match Score
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-heading font-bold tracking-tighter text-black">
                  {score}
                </span>
                <span className="text-lg font-bold text-slate-400">/100</span>
              </div>
            </div>
            <div
              className={cn(
                "px-3 py-1 text-xs font-bold uppercase border-2 border-black",
                status.color,
                "text-white",
              )}
            >
              {status.text}
            </div>
          </div>

          <div className="mt-4 w-full h-3 border-2 border-black p-0.5 bg-slate-50">
            <div
              className={cn(
                "h-full transition-all duration-1000 ease-out",
                status.color,
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Summary Block */}
        <div className="bg-white border-2 border-black p-6 neo-shadow hover:neo-shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-bold text-lg uppercase">
              Executive Summary
            </h3>
          </div>
          <div className="font-sans text-sm leading-relaxed text-slate-700">
            {summary}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold uppercase text-slate-500">
                Format: Standard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase text-slate-500">
                Parsing: Success
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Keywords Section */}
      <div className="bg-white border-2 border-black p-6 neo-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-bold text-lg uppercase">
              Missing Keywords
            </h3>
          </div>
          <span className="text-xs font-bold bg-black text-white px-2 py-0.5 rounded-sm">
            {missingKeywords.length} Found
          </span>
        </div>

        {missingKeywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((keyword, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span className="font-mono text-xs font-bold uppercase">
                  {keyword}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">
              All critical keywords present. Excellent work!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
