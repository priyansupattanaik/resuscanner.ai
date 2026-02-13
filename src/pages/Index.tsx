import React, { useState } from "react";
import Layout from "@/components/Layout";
import FileUploader from "@/components/FileUploader";
import JobForm from "@/components/JobForm";
import ScoreDisplay from "@/components/ScoreDisplay";
import ChatAssistant from "@/components/ChatAssistant";
import ResumeForge from "@/components/ResumeForge"; // Import Forge
import { useScan } from "@/context/ScanContext";
import { Loader2, Hammer } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { cn } from "@/lib/utils";

const Index = () => {
  const {
    result,
    isLoading,
    setFile,
    jobRole,
    setJobRole,
    jobLevel,
    setJobLevel,
    jobDescription,
    setJobDescription,
    performScan,
    file,
  } = useScan();

  // Updated Tab State to include 'forge'
  const [mobileTab, setMobileTab] = useState<"score" | "chat" | "forge">(
    "score",
  );
  const isFormValid = !!file && !!jobRole && !!jobLevel;

  return (
    <Layout>
      <div className="h-full flex flex-col justify-center">
        {/* INPUT MODE */}
        {!result && !isLoading && (
          <div className="max-w-5xl mx-auto w-full animate-fade-in">
            <div className="mb-8 text-left border-l-4 border-primary pl-6">
              <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight text-black mb-2">
                Resume Scanner
              </h1>
              <p className="font-sans text-lg text-slate-600 max-w-xl">
                Analyze your resume against job descriptions using ATS-grade
                algorithms.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white text-xs font-bold px-2 py-0.5">
                    STEP 1
                  </span>
                  <h3 className="font-heading font-bold text-xl uppercase">
                    Upload PDF
                  </h3>
                </div>
                <FileUploader onFileChange={setFile} />
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white text-xs font-bold px-2 py-0.5">
                    STEP 2
                  </span>
                  <h3 className="font-heading font-bold text-xl uppercase">
                    Job Details
                  </h3>
                </div>

                <div className="bg-white border-2 border-black p-6 neo-shadow hover:neo-shadow-lg transition-all duration-300">
                  <JobForm
                    jobRole={jobRole}
                    setJobRole={setJobRole}
                    jobLevel={jobLevel}
                    setJobLevel={setJobLevel}
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    isLoading={isLoading}
                    onSubmit={performScan}
                    isFormValid={isFormValid}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOADING MODE */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="max-w-md w-full border-2 border-black bg-white p-8 neo-shadow text-center space-y-6 flex flex-col items-center">
              <Loader />
              <div>
                <h2 className="font-heading text-2xl font-bold uppercase mb-2">
                  Analyzing...
                </h2>
                <p className="font-mono text-sm text-slate-500">
                  Processing document structure and keywords.
                </p>
              </div>
              <div className="w-full bg-slate-100 h-2 border border-black overflow-hidden">
                <div
                  className="h-full bg-primary animate-[slide-in_1.5s_infinite]"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* RESULT MODE */}
        {result && (
          <div className="h-full flex flex-col animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div>
                <h2 className="font-heading text-3xl font-bold uppercase text-black leading-none">
                  Analysis Report
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p className="font-mono text-xs font-bold text-slate-500 uppercase">
                    {jobRole}
                  </p>
                </div>
              </div>

              {/* Mobile Toggle */}
              <div className="lg:hidden flex border-2 border-black bg-white">
                <button
                  onClick={() => setMobileTab("score")}
                  className={cn(
                    "px-3 py-2 text-[10px] font-bold uppercase transition-colors",
                    mobileTab === "score"
                      ? "bg-black text-white"
                      : "text-slate-500",
                  )}
                >
                  Report
                </button>
                <button
                  onClick={() => setMobileTab("forge")}
                  className={cn(
                    "px-3 py-2 text-[10px] font-bold uppercase transition-colors border-l border-black",
                    mobileTab === "forge"
                      ? "bg-black text-white"
                      : "text-slate-500",
                  )}
                >
                  Forge
                </button>
                <button
                  onClick={() => setMobileTab("chat")}
                  className={cn(
                    "px-3 py-2 text-[10px] font-bold uppercase transition-colors border-l border-black",
                    mobileTab === "chat"
                      ? "bg-black text-white"
                      : "text-slate-500",
                  )}
                >
                  Chat
                </button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 min-h-0 grid lg:grid-cols-3 gap-6 overflow-y-auto lg:overflow-visible pb-4">
              {/* Col 1: Score (Left) */}
              <div
                className={cn(
                  "h-full overflow-y-auto pr-2 custom-scrollbar lg:col-span-1",
                  mobileTab === "score" ? "block" : "hidden lg:block",
                )}
              >
                <ScoreDisplay result={result} />
              </div>

              {/* Col 2: Forge (Center - New) */}
              <div
                className={cn(
                  "h-full lg:col-span-1",
                  mobileTab === "forge" ? "block" : "hidden lg:block",
                )}
              >
                <ResumeForge jobRole={result.jobRole} />
              </div>

              {/* Col 3: Chat (Right) */}
              <div
                className={cn(
                  "h-full min-h-[500px] lg:col-span-1",
                  mobileTab === "chat" ? "block" : "hidden lg:block",
                )}
              >
                <ChatAssistant scanResult={result} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
