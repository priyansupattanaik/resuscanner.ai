// src/lib/atsScanner.ts
import { generateResumeAnalysis } from "./keywordGenerator";
import { extractTextFromPdf } from "./pdfExtractor";

export interface ScanResult {
  score: number;
  missingKeywords: string[];
  resumeText: string;
  jobRole: string;
  jobLevel: string;
  date: string;
  summary: string;
}

export async function scanResume(
  resumeFile: File,
  jobRole: string,
  jobLevel: string
): Promise<ScanResult> {
  try {
    const resumeText = await extractTextFromPdf(resumeFile);

    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error("PDF is empty or unreadable (scanned image?).");
    }

    const analysis = await generateResumeAnalysis(
      resumeText,
      jobRole,
      jobLevel
    );

    return {
      score: analysis.score,
      missingKeywords: analysis.missingKeywords,
      resumeText: resumeText,
      jobRole: jobRole,
      jobLevel: jobLevel,
      date: new Date().toISOString(),
      summary: analysis.summary,
    };
  } catch (error) {
    console.error("Scanner Error:", error);
    throw error;
  }
}
