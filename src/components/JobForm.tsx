import React from "react";
import { Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { config } from "@/data/config";
import { Button } from "@/components/ui/button";

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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-fade-in delay-100"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            Target Role
          </label>
          <div className="relative group">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g. Product Manager"
              className="w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-white/80"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            Experience Level
          </label>
          <div className="relative group">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <select
              value={jobLevel}
              onChange={(e) => setJobLevel(e.target.value)}
              className="w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-white/80 appearance-none cursor-pointer"
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
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">Analyzing...</span>
        ) : (
          <span className="flex items-center gap-2">
            Start Analysis <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </Button>
    </form>
  );
};

export default JobForm;
