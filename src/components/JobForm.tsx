import React from "react";
import { ArrowRight, Sparkles, Briefcase, FileText } from "lucide-react";
import { config } from "@/data/config";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface JobFormProps {
  jobRole: string;
  setJobRole: (role: string) => void;
  jobLevel: string;
  setJobLevel: (level: string) => void;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  isFormValid: boolean;
}

const JobForm: React.FC<JobFormProps> = ({
  jobRole,
  setJobRole,
  jobLevel,
  setJobLevel,
  jobDescription,
  setJobDescription,
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
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Role Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            Target Role <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Senior Product Designer"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            disabled={isLoading}
          />
        </div>

        {/* Level Select */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Experience Level <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={jobLevel}
              onChange={(e) => setJobLevel(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm cursor-pointer"
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
      </div>

      {/* Job Description Input (New) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Job Description{" "}
          <span className="text-slate-400 font-normal lowercase">
            (optional but recommended)
          </span>
        </label>
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here for a much more accurate analysis..."
          className="min-h-[120px] rounded-xl border-slate-200 bg-white text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none shadow-sm"
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className={cn(
          "w-full h-12 rounded-xl text-base font-medium shadow-lg transition-all duration-300 mt-2",
          "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
          !isLoading &&
            isFormValid &&
            "hover:shadow-indigo-500/25 hover:-translate-y-0.5"
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>Analyzing Profile...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Start Analysis</span>
            <ArrowRight className="w-4 h-4 opacity-60" />
          </div>
        )}
      </Button>
    </form>
  );
};

export default JobForm;
