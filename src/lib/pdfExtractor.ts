import { pdfjs } from "react-pdf";

// Use standard Vite URL constructor for the worker to ensure it bundles correctly
// rather than relying on an external CDN.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

/**
 * Extract text from a PDF file
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");

      fullText += pageText + "\n";
    }

    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error(
      "Failed to extract text from PDF. Please ensure the file is not password protected."
    );
  }
}

export function parseResumeText(text: string): string[] {
  if (!text) return [];
  const textSplit = text.split("\n");
  let userWords: string[] = [];
  for (const line of textSplit) {
    const words = line.split(" ");
    for (const word of words) {
      if (word.trim()) {
        userWords.push(word.toLowerCase());
      }
    }
  }
  return [...new Set(userWords)];
}
