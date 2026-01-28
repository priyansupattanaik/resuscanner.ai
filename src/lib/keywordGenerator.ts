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
    // 1. The "Ruthless" System Instruction
    const systemInstruction = `You are TAS (Talent Acquisition Specialist), a strict Recruitment AI.

    CRITICAL RULES:
    1. ZERO-BASE SCORING: Start at 0. Points are only earned, never given for free.
    2. RELEVANCE CHECK (THE KILL SWITCH): If the candidate's resume is NOT relevant to the Target Role (e.g., Marketing resume for an Engineering role), the Score MUST be between 0 and 15. NO EXCEPTIONS. Do not give "participation points" for soft skills if the hard skills are wrong.
    3. THE "DUAL-LENS" SCORING (Max 100):
       - Hard Skills Match (Keywords/Tools): Max 40 pts. (0 pts if irrelevant).
       - Impact & Metrics (Numbers/%): Max 30 pts.
       - Experience Relevance: Max 20 pts.
       - Formatting & Soft Skills: Max 10 pts.
    
    OUTPUT FORMAT:
    Return strictly JSON:
    {
      "score": <number>,
      "missingKeywords": ["List critical missing hard skills"],
      "summary": "<TAS Feedback. Be blunt. If irrelevant, say: 'This resume is a mismatch. You applied for [Role] but this is a [Actual Role] resume.'>"
    }`;

    // 2. Build Prompt
    let contextPrompt = `TARGET ROLE: "${jobLevel} ${jobRole}"`;

    if (jobDescription && jobDescription.trim().length > 50) {
      contextPrompt += `\nSPECIFIC JD REQUIREMENTS:\n"${jobDescription.slice(0, 5000)}"`;
    } else {
      contextPrompt += `\nNO JD PROVIDED. Use strict industry standards for ${jobRole}.`;
    }

    const userPrompt = `${contextPrompt}

    CANDIDATE RESUME:
    "${resumeText.slice(0, 15000)}"

    INSTRUCTIONS:
    1. First, determine if this resume matches the domain of "${jobRole}".
    2. If NO match (e.g. Sales resume for Coding job) -> Score < 15.
    3. If YES match -> Calculate score based on Impact (Metrics) and Keyword coverage.
    4. List ALL missing critical keywords.
    
    REQUIRED JSON OUTPUT:
    {
      "score": number,
      "missingKeywords": string[],
      "summary": string
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
        temperature: 0.1,
        max_tokens: 1000,
        response_format: { type: "json_object" },
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
      missingKeywords: ["Connection Failure"],
      summary:
        "TAS System Alert: Critical connection failure. Unable to access the analysis engine.",
    };
  }
}

function parseAIResponse(text: string): AIAnalysisResult {
  try {
    let clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const firstBracket = clean.indexOf("{");
    if (firstBracket === -1) throw new Error("No JSON start found");
    clean = clean.substring(firstBracket);

    try {
      return validateAndReturn(JSON.parse(clean));
    } catch (e) {
      if (!clean.endsWith("}")) clean += "}";
      try {
        return validateAndReturn(JSON.parse(clean));
      } catch (finalError) {
        throw new Error("Repair failed");
      }
    }
  } catch (error) {
    return {
      score: 0,
      missingKeywords: ["Error"],
      summary: "Analysis Error: Could not parse AI response.",
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
