import { generateKeywords } from "./keywordGenerator";
import { extractTextFromPdf, parseResumeText } from "./pdfExtractor";
import { sampleKeywords } from "@/data/config";

export interface ScanResult {
  score: number;
  missingKeywords: string[];
  resumeText: string; // New: Needed for Chat Context
  jobRole: string; // New: Needed for History
  jobLevel: string; // New: Needed for History
  date: string; // New: Needed for History
}

/**
 * Scan a resume against ATS criteria for a specific job role and level
 */
export async function scanResume(
  resumeFile: File,
  jobRole: string,
  jobLevel: string
): Promise<ScanResult> {
  try {
    // Extract text from PDF
    const resumeText = await extractTextFromPdf(resumeFile);

    // Parse resume into words
    const resumeWords = parseResumeText(resumeText);

    if (resumeWords.length === 0) {
      throw new Error("No text could be extracted from the PDF");
    }

    // Initialize aggregation variables
    let totalScore = 0;
    let allMissingKeywords: string[] = [];

    // Run the analysis (Reduced iterations to 2 for speed in Phase 4)
    const iterations = 2;
    let successfulIterations = 0;

    for (let i = 0; i < iterations; i++) {
      try {
        const keywordDict = await generateKeywords(jobRole, jobLevel);

        if (Object.keys(keywordDict).length === 0) {
          throw new Error("No keywords generated");
        }

        let matchedKeywords = 0;
        const missingKeywordsInIteration: string[] = [];

        for (const keyword in keywordDict) {
          const keywordExists = resumeWords.some((word) =>
            word.includes(keyword)
          );
          if (keywordExists) {
            matchedKeywords++;
          } else {
            missingKeywordsInIteration.push(keyword);
          }
        }

        const totalKeywords = Object.keys(keywordDict).length;
        const iterationScore = (matchedKeywords / totalKeywords) * 100;

        totalScore += iterationScore;
        allMissingKeywords = [
          ...allMissingKeywords,
          ...missingKeywordsInIteration,
        ];
        successfulIterations++;
      } catch (error) {
        console.error(`Error in iteration ${i + 1}:`, error);
      }
    }

    // Fallback logic
    if (successfulIterations === 0) {
      console.warn("Using fallback sample keywords");
      const fallbackDict: Record<string, number> = {};
      sampleKeywords.forEach((k) => (fallbackDict[k] = 1));

      let matchedKeywords = 0;
      const missingKeywordsInFallback: string[] = [];

      for (const keyword in fallbackDict) {
        const keywordExists = resumeWords.some((word) =>
          word.includes(keyword)
        );
        if (keywordExists) matchedKeywords++;
        else missingKeywordsInFallback.push(keyword);
      }

      totalScore = (matchedKeywords / Object.keys(fallbackDict).length) * 100;
      allMissingKeywords = missingKeywordsInFallback;
      successfulIterations = 1;
    }

    const finalScore = totalScore / (successfulIterations || 1);
    const uniqueMissingKeywords = [...new Set(allMissingKeywords)];

    return {
      score: Math.round(finalScore),
      missingKeywords: uniqueMissingKeywords,
      resumeText: resumeText,
      jobRole: jobRole,
      jobLevel: jobLevel,
      date: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error scanning resume:", error);
    throw new Error("Failed to scan resume: " + (error as Error).message);
  }
}
