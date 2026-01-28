import { config } from "@/data/config";
import { ScanResult } from "./atsScanner"; // Import ScanResult type

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Updated signature to take the full analysis result
export async function sendChatMessage(
  history: ChatMessage[],
  analysisResult: ScanResult,
): Promise<string> {
  try {
    const systemPrompt = `You are TAS (Talent Acquisition Specialist).
    
    YOUR KNOWLEDGE BASE:
    - User's Target Role: "${analysisResult.jobRole}"
    - Resume Content: "${analysisResult.resumeText.slice(0, 3000)}..."
    - YOUR PREVIOUS ANALYSIS:
      - Score Given: ${analysisResult.score}/100
      - Missing Keywords Identified: ${analysisResult.missingKeywords.join(", ")}
      - Your Feedback Summary: "${analysisResult.summary}"
    
    YOUR RULES:
    1. OWN YOUR SCORE: If the user asks "Why did I get this score?", explain it using the missing keywords and feedback above. Do not say "I didn't give you a score." YOU gave the score.
    2. STRICT PERSONA: You are a strict, professional recruiter.
    3. RELEVANCE CHECK: If the score is low (<40), bluntly tell them their resume is irrelevant for this role.
    4. DOMAIN ONLY: Answer only Resume/Job questions. Refuse others.
    
    Keep responses under 150 words.`;

    // Clean history to remove old system prompts
    const cleanHistory = history.filter((h) => h.role !== "system");

    const payload = {
      model: config.api.model,
      messages: [{ role: "system", content: systemPrompt }, ...cleanHistory],
      temperature: 0.3,
      max_tokens: 400,
    };

    const response = await fetch(config.api.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.api.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`Chat API Error (${response.status})`, err);
      throw new Error(`Chat failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("Empty response");

    return content;
  } catch (error) {
    console.error("Chat Failed", error);
    return "TAS System Alert: Connection interruption. Please try again.";
  }
}
