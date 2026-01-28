import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ScanResult, scanResume } from "@/lib/atsScanner";
import { toast } from "sonner";

interface ScanContextType {
  file: File | null;
  jobRole: string;
  jobLevel: string;
  jobDescription: string;
  isLoading: boolean;
  result: ScanResult | null;
  history: ScanResult[];
  setFile: (file: File | null) => void;
  setJobRole: (role: string) => void;
  setJobLevel: (level: string) => void;
  setJobDescription: (desc: string) => void;
  setResult: (result: ScanResult | null) => void;
  performScan: () => Promise<void>;
  loadScanFromHistory: (scan: ScanResult) => void;
  deleteScan: (dateKey: string) => void;
  clearHistory: () => void; // [New]
  resetScan: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("resuscanner_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const performScan = async () => {
    if (!file || !jobRole || !jobLevel) {
      toast.error("Please fill in the required fields (File, Role, Level)");
      return;
    }

    try {
      setIsLoading(true);
      const scanResult = await scanResume(
        file,
        jobRole,
        jobLevel,
        jobDescription,
      );

      setResult(scanResult);

      const newHistory = [scanResult, ...history].slice(0, 50);
      setHistory(newHistory);
      localStorage.setItem("resuscanner_history", JSON.stringify(newHistory));

      toast.success("Analysis complete");
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadScanFromHistory = (scan: ScanResult) => {
    setResult(scan);
    setJobRole(scan.jobRole);
    setJobLevel(scan.jobLevel);
    setJobDescription(""); // Reset optional JD as it's not stored in simplified history yet
  };

  const deleteScan = (dateKey: string) => {
    const newHistory = history.filter((scan) => scan.date !== dateKey);
    setHistory(newHistory);
    localStorage.setItem("resuscanner_history", JSON.stringify(newHistory));

    if (result && result.date === dateKey) {
      resetScan();
    }
    toast.success("Item deleted");
  };

  const clearHistory = () => {
    if (
      confirm(
        "Are you sure you want to clear all history? This cannot be undone.",
      )
    ) {
      setHistory([]);
      localStorage.removeItem("resuscanner_history");
      toast.success("History cleared");
    }
  };

  const resetScan = () => {
    setFile(null);
    setJobRole("");
    setJobLevel("");
    setJobDescription("");
    setResult(null);
  };

  return (
    <ScanContext.Provider
      value={{
        file,
        jobRole,
        jobLevel,
        jobDescription,
        isLoading,
        result,
        history,
        setFile,
        setJobRole,
        setJobLevel,
        setJobDescription,
        setResult,
        performScan,
        loadScanFromHistory,
        deleteScan,
        clearHistory,
        resetScan,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error("useScan must be used within a ScanProvider");
  }
  return context;
};
