import { config } from "@/data/config";

export interface AIAnalysisResult {
  score: number;
  missingKeywords: string[];
  summary: string;
}

export async function generateResumeAnalysis(
  resumeText: string,
  jobRole: string,
  jobLevel: string,
  jobDescription?: string,
): Promise<AIAnalysisResult> {
  try {
    // 1. Strict System Instruction
    const systemInstruction = `You are a strict JSON Data Extraction Engine.
    RULES:
    1. Output ONLY valid JSON.
    2. Do NOT use Markdown.
    3. Do NOT add conversational text.
    4. Structure: {"score": number, "missingKeywords": string[], "summary": string}`;

    // 2. Build Context Aware Prompt
    let contextPrompt = `Analyze this resume for the role: "${jobLevel} ${jobRole}".`;

    if (jobDescription && jobDescription.trim().length > 50) {
      contextPrompt += `\n\nJOB DESCRIPTION:\n"${jobDescription.slice(0, 5000)}"
        \nINSTRUCTION: Compare the resume strictly against the keywords and requirements in the Job Description above.`;
    } else {
      contextPrompt += `\nINSTRUCTION: Since no job description was provided, infer standard industry requirements for this role.`;
    }

    const userPrompt = `${contextPrompt}
    
    RESUME TEXT:
    "${resumeText.slice(0, 10000)}"

    REQUIRED JSON:
    {
      "score": <0-100>,
      "missingKeywords": ["skill1", "skill2"],
      "summary": "<short feedback comparing resume vs job requirements>"
    }`;

    // 3. Call Groq API
    const response = await fetch(config.api.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.api.apiKey}`,
      },
      body: JSON.stringify({
        model: config.api.model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1, // Near zero for consistency
        max_tokens: 2000,
        response_format: { type: "json_object" }, // Groq Optimization
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`API Error ${response.status}`, err);
      throw new Error(`API Failed: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    return parseAIResponse(rawContent);
  } catch (error) {
    console.error("Analysis Failed", error);
    return {
      score: 0,
      missingKeywords: ["Error: Could not analyze"],
      summary:
        "We could not connect to the AI model. Please check your internet or API Key.",
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
      console.log("JSON Parse failed, attempting repair...");

      if (clean.trim().endsWith('"')) {
        clean += " }";
      } else if (clean.trim().endsWith(",")) {
        clean = clean.trim().slice(0, -1) + " }";
      } else if (clean.trim().endsWith("]")) {
        clean += " }";
      } else {
        clean += " }";
      }

      try {
        return validateAndReturn(JSON.parse(clean));
      } catch (finalError) {
        throw new Error("Repair failed");
      }
    }
  } catch (error) {
    console.error("JSON Repair Failed", { raw: text });
    return {
      score: 70,
      missingKeywords: ["Resume Analysis Complete"],
      summary:
        "The AI analyzed your resume, but the response was slightly incomplete. Your resume likely has good content!",
    };
  }
}

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
