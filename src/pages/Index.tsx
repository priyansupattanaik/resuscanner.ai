import React, { useState, useRef } from "react";
import Layout from "@/components/Layout";
import Background from "@/components/Background";
import FileUploader from "@/components/FileUploader";
import JobForm from "@/components/JobForm";
import ScoreDisplay from "@/components/ScoreDisplay";
import KeywordSuggestions from "@/components/KeywordSuggestions";
import { scanResume, ScanResult } from "@/lib/atsScanner";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    // Reset results when file changes
    setResult(null);
    setShowResults(false);
  };

  const isFormValid = !!file && !!jobRole && !!jobLevel;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      setIsLoading(true);
      setShowResults(false);

      // Scroll to top if on mobile
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Scan the resume
      const scanResult = await scanResume(file!, jobRole, jobLevel);

      // Set the result and show after a small delay
      setResult(scanResult);

      // Show results with a delay for animation
      setTimeout(() => {
        setShowResults(true);

        // Scroll to results after a small delay to ensure DOM is updated
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: isMobile ? "start" : "center",
          });
        }, 100);
      }, 600);

      toast({
        title: "Analysis complete",
        description: "Your resume has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Error scanning resume:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          (error as Error).message ||
          "Failed to scan your resume. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Background isLoading={isLoading} />
      <Layout>
        <div className="max-w-3xl mx-auto">
          <FileUploader onFileChange={handleFileChange} />

          <JobForm
            jobRole={jobRole}
            setJobRole={setJobRole}
            jobLevel={jobLevel}
            setJobLevel={setJobLevel}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            isFormValid={isFormValid}
          />

          <div ref={resultsRef}>
            {result && (
              <>
                <ScoreDisplay score={result.score} isVisible={showResults} />
                {/* <KeywordSuggestions 
                  keywords={result.missingKeywords} 
                  isVisible={showResults}
                /> */}
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
