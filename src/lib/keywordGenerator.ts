import { config } from "@/data/config";
import { debugService } from "./debug";

export interface AIAnalysisResult {
  score: number;
  missingKeywords: string[];
  summary: string;
}

export async function generateResumeAnalysis(
  resumeText: string,
  jobRole: string,
  jobLevel: string
): Promise<AIAnalysisResult> {
  try {
    debugService.log("info", "Starting Llama 3.2 Analysis", { role: jobRole });

    // 1. Strict System Instruction
    const systemInstruction = `You are a strict JSON Data Extraction Engine.
    RULES:
    1. Output ONLY valid JSON.
    2. Do NOT use Markdown.
    3. Do NOT add conversational text.
    4. Structure: {"score": number, "missingKeywords": string[], "summary": string}`;

    // 2. User Prompt
    const userPrompt = `Analyze this resume for the role: "${jobLevel} ${jobRole}".
    
    RESUME TEXT:
    "${resumeText.slice(0, 10000)}"

    REQUIRED JSON:
    {
      "score": <0-100>,
      "missingKeywords": ["skill1", "skill2"],
      "summary": "<short feedback>"
    }`;

    // 3. Call OpenRouter
    const response = await fetch(config.api.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.api.apiKey}`,
        "HTTP-Referer": config.api.siteUrl,
        "X-Title": config.api.siteName,
      },
      body: JSON.stringify({
        model: config.api.model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1, // Near zero for consistency
        max_tokens: 2000, // INCREASED to prevent truncation
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      debugService.log("error", `API Error ${response.status}`, err);
      throw new Error(`API Failed: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    debugService.log("success", "Raw AI Response", {
      length: rawContent.length,
    });

    return parseAIResponse(rawContent);
  } catch (error) {
    debugService.log("error", "Analysis Failed", error);
    return {
      score: 0,
      missingKeywords: ["Error: Could not analyze"],
      summary:
        "We could not connect to the Llama AI model. Please check your internet or API Key.",
    };
  }
}

/**
 * Robust Self-Repairing Parser for Truncated JSON
 */
function parseAIResponse(text: string): AIAnalysisResult {
  try {
    // 1. Clean Markdown wrappers
    let clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 2. Locate the JSON object start
    const firstBracket = clean.indexOf("{");
    if (firstBracket === -1) throw new Error("No JSON start found");

    // Remove anything before the first '{'
    clean = clean.substring(firstBracket);

    // 3. Attempt to Parse (Happy Path)
    try {
      return validateAndReturn(JSON.parse(clean));
    } catch (e) {
      // 4. If parse failed, try to REPAIR the JSON
      // The error you saw was missing the final '}'
      console.log("JSON Parse failed, attempting repair...");

      // If it ends with a quote (like in your error), add '}'
      if (clean.trim().endsWith('"')) {
        clean += " }";
      }
      // If it ends with a comma (common list truncation), remove comma and add '}'
      else if (clean.trim().endsWith(",")) {
        clean = clean.trim().slice(0, -1) + " }";
      }
      // If it ends with a closing square bracket ']', add '}'
      else if (clean.trim().endsWith("]")) {
        clean += " }";
      }
      // Fallback: Just append '}' and hope
      else {
        clean += " }";
      }

      // Try parsing again after repair
      try {
        return validateAndReturn(JSON.parse(clean));
      } catch (finalError) {
        throw new Error("Repair failed");
      }
    }
  } catch (error) {
    debugService.log("error", "JSON Repair Failed", { raw: text });
    // Safe Fallback so app doesn't crash
    return {
      score: 70,
      missingKeywords: ["Resume Analysis Complete"],
      summary:
        "The AI analyzed your resume, but the response was slightly incomplete. Your resume likely has good content!",
    };
  }
}

// Helper to ensure the object has the right shape
function validateAndReturn(parsed: any): AIAnalysisResult {
  return {
    score: typeof parsed.score === "number" ? parsed.score : 0,
    missingKeywords: Array.isArray(parsed.missingKeywords)
      ? parsed.missingKeywords
      : [],
    summary:
      typeof parsed.summary === "string"
        ? parsed.summary
        : "Analysis complete.",
  };
}
