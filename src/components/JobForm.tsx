import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { config } from "@/data/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JobFormProps {
  jobRole: string;
  setJobRole: (role: string) => void;
  jobLevel: string;
  setJobLevel: (level: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  isFormValid: boolean;
}

const JobForm: React.FC<JobFormProps> = ({
  jobRole,
  setJobRole,
  jobLevel,
  setJobLevel,
  isLoading,
  onSubmit,
  isFormValid,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      {/* Role Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">
          Target Role
        </label>
        <div className="relative">
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Senior Product Designer"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Level Select */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-1">
          Experience Level
        </label>
        <div className="relative">
          <select
            value={jobLevel}
            onChange={(e) => setJobLevel(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer"
            disabled={isLoading}
          >
            <option value="" disabled>
              Select Level
            </option>
            {config.ui.jobLevels.map((level) => (
              <option key={level.id} value={level.label}>
                {level.label}
              </option>
            ))}
          </select>
          {/* Custom Chevron */}
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 1L5 5L9 1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className={cn(
          "w-full h-12 rounded-xl text-base font-medium shadow-lg transition-all duration-300",
          "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
          !isLoading &&
            isFormValid &&
            "hover:shadow-blue-500/25 hover:-translate-y-0.5"
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>Analyzing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Scan Resume</span>
            <ArrowRight className="w-4 h-4 opacity-60" />
          </div>
        )}
      </Button>
    </form>
  );
};

export default JobForm;
