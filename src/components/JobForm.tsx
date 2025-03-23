
import React from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { config } from '@/data/config';

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
  isFormValid
}) => {
  const isMobile = useIsMobile();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`glass-card rounded-xl ${isMobile ? 'p-4' : 'p-6'} mt-6 md:mt-8 animate-fade-in`}>
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2 md:space-y-3">
          <label className="block text-xs md:text-sm font-medium">
            Job Role
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full rounded-md bg-muted/50 border border-border pl-9 md:pl-10 h-10 md:h-12 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm md:text-base"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="space-y-2 md:space-y-3">
          <label className="block text-xs md:text-sm font-medium">
            Job Level
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            <select
              value={jobLevel}
              onChange={(e) => setJobLevel(e.target.value)}
              className="w-full rounded-md bg-muted/50 border border-border pl-9 md:pl-10 h-10 md:h-12 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none text-sm md:text-base"
              disabled={isLoading}
            >
              <option value="" disabled>Select a job level</option>
              {config.ui.jobLevels.map(level => (
                <option key={level.id} value={level.label}>{level.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-6 flex justify-center">
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`
            relative px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium flex items-center text-sm md:text-base
            ${isFormValid && !isLoading 
              ? 'bg-blue-purple-gradient hover:opacity-90 animated-border' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
            transition-all duration-300 group overflow-hidden
          `}
        >
          <span className="relative z-10">
            {isLoading ? 'Scanning...' : 'Analyze Resume'}
          </span>
          {isFormValid && !isLoading && (
            <span className="absolute inset-0 translate-y-[105%] group-hover:translate-y-0 bg-purple-pink-gradient transition-transform duration-300"></span>
          )}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
