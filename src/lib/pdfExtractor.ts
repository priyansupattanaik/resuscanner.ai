
import { pdfjs } from 'react-pdf';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Extract text from a PDF file
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => 'str' in item ? item.str : '')
        .join(' ');
        
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please try a different file.');
  }
}

/**
 * Parse resume text into an array of words
 */
export function parseResumeText(text: string): string[] {
  if (!text) return [];
  
  // Split text into lines, then words
  const textSplit = text.split('\n');
  let userWords: string[] = [];
  
  for (const line of textSplit) {
    const words = line.split(' ');
    for (const word of words) {
      if (word.trim()) {
        userWords.push(word.toLowerCase());
      }
    }
  }
  
  // Remove duplicates
  return [...new Set(userWords)];
}
