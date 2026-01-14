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
  jobDescription: string; // [New]
  isLoading: boolean;
  result: ScanResult | null;
  history: ScanResult[];
  setFile: (file: File | null) => void;
  setJobRole: (role: string) => void;
  setJobLevel: (level: string) => void;
  setJobDescription: (desc: string) => void; // [New]
  setResult: (result: ScanResult | null) => void;
  performScan: () => Promise<void>;
  loadScanFromHistory: (scan: ScanResult) => void;
  deleteScan: (dateKey: string) => void;
  resetScan: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [jobDescription, setJobDescription] = useState(""); // [New]
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
    // We allow JD to be empty, but Role/Level/File are strictly required
    if (!file || !jobRole || !jobLevel) {
      toast.error("Please fill in the required fields (File, Role, Level)");
      return;
    }

    try {
      setIsLoading(true);
      // Pass the new jobDescription to the scanner
      const scanResult = await scanResume(
        file,
        jobRole,
        jobLevel,
        jobDescription
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
    // If the historical scan saved the JD, we could restore it here.
    // For now, we leave it empty or restore if you choose to add it to ScanResult interface.
  };

  const deleteScan = (dateKey: string) => {
    const newHistory = history.filter((scan) => scan.date !== dateKey);
    setHistory(newHistory);
    localStorage.setItem("resuscanner_history", JSON.stringify(newHistory));

    if (result && result.date === dateKey) {
      resetScan();
    }
    toast.success("Scan deleted from history");
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
