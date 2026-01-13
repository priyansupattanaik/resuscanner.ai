import React, { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import FileUploader from "@/components/FileUploader";
import JobForm from "@/components/JobForm";
import ScoreDisplay from "@/components/ScoreDisplay";
import ChatAssistant from "@/components/ChatAssistant"; // New
import HistorySheet from "@/components/HistorySheet"; // New
import { scanResume, ScanResult } from "@/lib/atsScanner";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2, ArrowRight, History, Sparkles, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    // Note: We don't reset result immediately to allow user to see old result while picking new file
    // But logically, if file changes, old result is stale.
    if (selectedFile) {
      setResult(null);
    }
  };

  const isFormValid = !!file && !!jobRole && !!jobLevel;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      setIsLoading(true);
      if (isMobile) window.scrollTo({ top: 0, behavior: "smooth" });

      const scanResult = await scanResume(file!, jobRole, jobLevel);

      setResult(scanResult);
      setActiveTab("analysis"); // Switch to analysis view on new scan

      // Update History
      const newHistory = [scanResult, ...history].slice(0, 50); // Keep last 50
      setHistory(newHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));

      setTimeout(() => {
        if (isMobile) {
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }, 500);

      toast({
        title: "Analysis complete",
        description: "Your resume score is ready.",
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
    // Note: We cannot restore the File object itself for security reasons,
    // but we have the text content in `oldResult.resumeText` for the AI.
    // We can show a placeholder or just the result.
    setActiveTab("analysis");
    toast({
      title: "History Loaded",
      description: `Loaded scan for ${oldResult.jobRole}`,
    });
  };

  return (
    <Layout>
      {/* History Drawer */}
      <HistorySheet
        open={showHistory}
        onOpenChange={setShowHistory}
        history={history}
        onSelectScan={handleHistorySelect}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Section */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Configure Scan
              </h2>
              <p className="text-sm text-slate-500">
                Upload resume & define target role.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="hidden lg:flex gap-2"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-900">
                1. Upload Resume
              </label>
              <FileUploader onFileChange={handleFileChange} />
            </div>
            <Separator />
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-900">
                2. Target Role Details
              </label>
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

          {/* Mobile History Button */}
          <Button
            variant="outline"
            className="w-full lg:hidden flex gap-2"
            onClick={() => setShowHistory(true)}
          >
            <History className="w-4 h-4" />
            View Past Scans
          </Button>
        </div>

        {/* RIGHT COLUMN: Results & Chat */}
        <div className="lg:col-span-7" ref={resultsRef}>
          {isLoading ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
              <p className="text-sm font-medium text-slate-600">
                Analyzing Resume...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Comparing against {jobLevel} {jobRole} keywords
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger
                    value="analysis"
                    className="flex gap-2 items-center"
                  >
                    <FileText className="w-4 h-4" /> Analysis
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="flex gap-2 items-center">
                    <Sparkles className="w-4 h-4" /> AI Assistant
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="mt-0">
                  <ScoreDisplay
                    score={result.score}
                    isVisible={true}
                    missingKeywords={result.missingKeywords}
                  />
                </TabsContent>

                <TabsContent value="chat" className="mt-0">
                  <ChatAssistant
                    resumeText={result.resumeText}
                    jobRole={result.jobRole}
                  />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Empty State
            <div className="hidden lg:flex h-[500px] flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <ArrowRight className="w-6 h-6 text-slate-300" />
              </div>
              <p className="font-medium text-slate-500">Ready to Analyze</p>
              <p className="text-sm text-slate-400 mt-1">
                Fill out the form on the left to start.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
