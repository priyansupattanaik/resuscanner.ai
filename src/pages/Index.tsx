import React, { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import FileUploader from "@/components/FileUploader";
import JobForm from "@/components/JobForm";
import ScoreDisplay from "@/components/ScoreDisplay";
import ChatAssistant from "@/components/ChatAssistant";
import HistorySheet from "@/components/HistorySheet";
import { scanResume, ScanResult } from "@/lib/atsScanner";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Loader2,
  History,
  Sparkles,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "resuscanner_history";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis");

  const resultsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) setResult(null);
  };

  const isFormValid = !!file && !!jobRole && !!jobLevel;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      setIsLoading(true);
      if (isMobile) window.scrollTo({ top: 0, behavior: "smooth" });

      const scanResult = await scanResume(file!, jobRole, jobLevel);

      setResult(scanResult);
      setActiveTab("analysis");

      const newHistory = [scanResult, ...history].slice(0, 50);
      setHistory(newHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);

      toast({
        title: "Analysis complete",
        description: "Your personalized score is ready.",
      });
    } catch (error) {
      console.error("Error scanning resume:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (oldResult: ScanResult) => {
    setResult(oldResult);
    setJobRole(oldResult.jobRole);
    setJobLevel(oldResult.jobLevel);
    setActiveTab("analysis");
    toast({
      title: "History Loaded",
      description: `Viewing scan for ${oldResult.jobRole}`,
    });
  };

  return (
    <Layout>
      <HistorySheet
        open={showHistory}
        onOpenChange={setShowHistory}
        history={history}
        onSelectScan={handleHistorySelect}
      />

      <div className="space-y-12 pb-20">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Resume Intelligence
            </h2>
            <p className="text-slate-500 max-w-md leading-relaxed">
              Upload your resume and the job description to get AI-powered
              feedback instantly.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowHistory(true)}
            className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full px-4"
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Input Section */}
          <div
            className={cn(
              "lg:col-span-5 space-y-8 transition-all duration-700 ease-in-out",
              result ? "opacity-100" : "lg:col-start-4 lg:col-span-6" // Centered when no result
            )}
          >
            <div className="glass-panel p-1 rounded-[28px] bg-white/50">
              <div className="bg-white/80 rounded-[24px] p-6 space-y-8 shadow-sm border border-white/50">
                {/* Step 1 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      1. Upload PDF
                    </label>
                  </div>
                  <FileUploader onFileChange={handleFileChange} />
                </div>

                {/* Step 2 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      2. Role Details
                    </label>
                  </div>
                  <JobForm
                    jobRole={jobRole}
                    setJobRole={setJobRole}
                    jobLevel={jobLevel}
                    setJobLevel={setJobLevel}
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                    isFormValid={isFormValid}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results Section */}
          {(isLoading || result) && (
            <div ref={resultsRef} className="lg:col-span-7 animate-slide-up">
              {isLoading ? (
                <div className="h-[500px] flex flex-col items-center justify-center rounded-[32px] border border-slate-100 bg-white/40 backdrop-blur-md">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full" />
                    <Loader2 className="relative w-12 h-12 animate-spin text-blue-600" />
                  </div>
                  <p className="mt-6 text-sm font-medium text-slate-900">
                    analyzing your profile...
                  </p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* iOS Style Segmented Control */}
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <div className="flex justify-center mb-6">
                      <TabsList className="bg-slate-100/80 p-1 rounded-full border border-slate-200/50 h-auto">
                        <TabsTrigger
                          value="analysis"
                          className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-300"
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Analysis
                          </span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="chat"
                          className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-300"
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-500" /> AI
                            Coach
                          </span>
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent
                      value="analysis"
                      className="mt-0 focus-visible:outline-none"
                    >
                      <ScoreDisplay
                        score={result.score}
                        isVisible={true}
                        missingKeywords={result.missingKeywords}
                        summary={result.summary}
                      />
                    </TabsContent>

                    <TabsContent
                      value="chat"
                      className="mt-0 focus-visible:outline-none"
                    >
                      <ChatAssistant
                        resumeText={result.resumeText}
                        jobRole={result.jobRole}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
