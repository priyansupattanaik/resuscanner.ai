import React, { useState } from "react";
import Layout from "@/components/Layout";
import FileUploader from "@/components/FileUploader";
import JobForm from "@/components/JobForm";
import ScoreDisplay from "@/components/ScoreDisplay";
import ChatAssistant from "@/components/ChatAssistant";
import { useScan } from "@/context/ScanContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageSquare } from "lucide-react";

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

  const [activeTab, setActiveTab] = useState("analysis");

  const isFormValid = !!file && !!jobRole && !!jobLevel;

  return (
    <Layout>
      <div className="space-y-8 pb-20">
        {/* Welcome Header */}
        {!result && (
          <div className="text-center space-y-4 py-8 animate-fade-in px-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Resume Intelligence
            </h1>
            <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
              Optimize your resume for Applicant Tracking Systems (ATS) with
              enterprise-grade AI analysis.
            </p>
          </div>
        )}

        {/* INPUT MODE */}
        {!result && !isLoading && (
          <div className="max-w-xl mx-auto space-y-8 animate-slide-up">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="h-2 bg-indigo-600 w-full" />
              <CardContent className="p-6 md:p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs">
                      1
                    </span>
                    Upload Resume (PDF)
                  </label>
                  <FileUploader onFileChange={setFile} />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs">
                      2
                    </span>
                    Target Position
                  </label>
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
              </CardContent>
            </Card>
          </div>
        )}

        {/* LOADING MODE */}
        {isLoading && (
          <div className="max-w-xl mx-auto mt-20 text-center space-y-6 animate-pulse px-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto flex items-center justify-center relative">
              <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-spin border-t-indigo-600" />
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Analyzing Resume
              </h3>
              <p className="text-slate-500 mt-2">
                Extracting keywords, checking ATS compatibility...
              </p>
            </div>
          </div>
        )}

        {/* RESULT MODE */}
        {result && (
          <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 break-words">
                  {jobRole}
                </h2>
                <p className="text-slate-500 text-sm">Analysis Result</p>
              </div>
              {/* Full width tabs on mobile */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full md:w-auto"
              >
                <TabsList className="bg-slate-100 border border-slate-200 w-full md:w-auto grid grid-cols-2 md:flex">
                  <TabsTrigger value="analysis" className="gap-2">
                    <FileText className="w-4 h-4" /> Analysis
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="gap-2">
                    <MessageSquare className="w-4 h-4" /> AI Coach
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsContent
                value="analysis"
                className="mt-0 focus-visible:outline-none"
              >
                <ScoreDisplay result={result} />
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
        )}
      </div>
    </Layout>
  );
};

export default Index;
