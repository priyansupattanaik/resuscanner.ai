import { pdfjs } from "react-pdf";

// Use unpkg CDN for the worker to avoid Vite dev server issues with local path resolution
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * Extract text from a PDF file
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    // Extract text from each page
    // Extract text from each page with layout preservation
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Cast items to a type with transform/width for easier access
      const items: any[] = textContent.items.filter((item: any) => "str" in item && "transform" in item);

      // Sort items by Y (descending) then X (ascending)
      // PDF coordinates: (0,0) is bottom-left. Higher Y = higher on page.
      items.sort((a, b) => {
        const yDiff = b.transform[5] - a.transform[5];
        // Tolerance for same line
        if (Math.abs(yDiff) > 5) {
          return yDiff; // distinct lines, top to bottom
        }
        return a.transform[4] - b.transform[4]; // same line, left to right
      });

      let pageText = "";
      let lastY = -1;
      let lastX = -1;

      for (const item of items) {
        const x = item.transform[4];
        const y = item.transform[5];
        const text = item.str;

        // Initialize lastY on first item
        if (lastY === -1) {
          lastY = y;
          lastX = x + item.width;
          pageText += text;
          continue;
        }

        // Check for new line (significant Y difference)
        if (Math.abs(y - lastY) > 8) {
          pageText += "\n";
          lastX = -1; // reset X tracking for new line
        } 
        // Check for space on same line (significant X gap)
        else if (x - lastX > 10) {
          pageText += " ";
        }

        pageText += text;
        
        lastY = y;
        lastX = x + (item.width || 0);
      }

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
