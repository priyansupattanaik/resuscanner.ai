import React from "react";
import {
  ArrowRight,
  Sparkles,
  Briefcase,
  FileText,
  ChevronDown,
} from "lucide-react";
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-black uppercase tracking-widest flex items-center gap-2">
            Target Role{" "}
            <span className="text-primary text-lg leading-none">*</span>
          </label>
          <div className="relative group">
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="E.G. SENIOR DESIGNER"
              className="w-full h-12 border-2 border-slate-300 bg-white px-4 text-sm font-medium text-black placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-0 transition-all rounded-none group-hover:border-slate-400"
              disabled={isLoading}
            />
            <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Level Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-black uppercase tracking-widest flex items-center gap-2">
            Experience Level{" "}
            <span className="text-primary text-lg leading-none">*</span>
          </label>
          <div className="relative">
            <select
              value={jobLevel}
              onChange={(e) => setJobLevel(e.target.value)}
              className="w-full h-12 appearance-none border-2 border-slate-300 bg-white px-4 text-sm font-medium text-black focus:border-black focus:outline-none focus:ring-0 transition-all cursor-pointer rounded-none hover:border-slate-400"
              disabled={isLoading}
            >
              <option value="" disabled>
                SELECT LEVEL
              </option>
              {config.ui.jobLevels.map((level) => (
                <option key={level.id} value={level.label}>
                  {level.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Job Description Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-black uppercase tracking-widest flex items-center gap-2">
          Job Description
          <span className="text-xs font-normal text-slate-500 normal-case bg-slate-100 px-2 py-0.5">
            Recommended
          </span>
        </label>
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          className="min-h-[120px] rounded-none border-2 border-slate-300 bg-white text-sm font-medium focus:border-black focus:ring-0 resize-none hover:border-slate-400"
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className={cn(
          "w-full h-14 rounded-none text-base font-bold uppercase tracking-wide border-2 border-black transition-all duration-150 mt-4",
          "bg-black text-white hover:bg-white hover:text-black neo-shadow",
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-slate-300 disabled:border-slate-300",
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
            <span>PROCESSING DATA...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span>START ANALYSIS</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        )}
      </Button>
    </form>
  );
};

export default JobForm;
