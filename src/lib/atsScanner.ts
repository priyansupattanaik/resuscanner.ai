
import { generateKeywords } from './keywordGenerator';
import { extractTextFromPdf, parseResumeText } from './pdfExtractor';
import { sampleKeywords } from '@/data/config';

export interface ScanResult {
  score: number;
  missingKeywords: string[];
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
      throw new Error('No text could be extracted from the PDF');
    }
    
    // Initialize aggregation variables
    let totalScore = 0;
    let allMissingKeywords: string[] = [];
    
    // Run the analysis multiple times to get a more accurate result
    const iterations = 3;
    let successfulIterations = 0;
    
    for (let i = 0; i < iterations; i++) {
      try {
        // Generate keywords for the job role and level
        const keywordDict = await generateKeywords(jobRole, jobLevel);
        
        if (Object.keys(keywordDict).length === 0) {
          // If no keywords were returned, use a fallback
          console.warn('No keywords generated, using fallback sample keywords');
          throw new Error('No keywords generated');
        }
        
        // Check which keywords are present in the resume
        let matchedKeywords = 0;
        const missingKeywordsInIteration: string[] = [];
        
        for (const keyword in keywordDict) {
          // Check if the keyword exists in the resume
          const keywordExists = resumeWords.some(word => word.includes(keyword));
          
          if (keywordExists) {
            matchedKeywords++;
          } else {
            missingKeywordsInIteration.push(keyword);
          }
        }
        
        // Calculate score for this iteration
        const totalKeywords = Object.keys(keywordDict).length;
        const iterationScore = (matchedKeywords / totalKeywords) * 100;
        
        // Add to aggregated values
        totalScore += iterationScore;
        allMissingKeywords = [...allMissingKeywords, ...missingKeywordsInIteration];
        successfulIterations++;
      } catch (error) {
        console.error(`Error in iteration ${i+1}:`, error);
        // Continue with next iteration
      }
    }
    
    // If all iterations failed, use fallback logic with sample keywords
    if (successfulIterations === 0) {
      console.warn('All API iterations failed, using fallback sample keywords');
      
      // Create a simple dictionary from sample keywords
      const fallbackDict: Record<string, number> = {};
      sampleKeywords.forEach(keyword => {
        fallbackDict[keyword] = 1;
      });
      
      let matchedKeywords = 0;
      const missingKeywordsInFallback: string[] = [];
      
      for (const keyword in fallbackDict) {
        const keywordExists = resumeWords.some(word => word.includes(keyword));
        
        if (keywordExists) {
          matchedKeywords++;
        } else {
          missingKeywordsInFallback.push(keyword);
        }
      }
      
      const totalKeywords = Object.keys(fallbackDict).length;
      totalScore = (matchedKeywords / totalKeywords) * 100;
      allMissingKeywords = missingKeywordsInFallback;
      successfulIterations = 1;
    }
    
    // Calculate final score and deduplicate missing keywords
    const finalScore = totalScore / (successfulIterations || 1);
    const uniqueMissingKeywords = [...new Set(allMissingKeywords)];
    
    return {
      score: finalScore,
      missingKeywords: uniqueMissingKeywords
    };
  } catch (error) {
    console.error('Error scanning resume:', error);
    throw new Error('Failed to scan resume: ' + (error as Error).message);
  }
}
