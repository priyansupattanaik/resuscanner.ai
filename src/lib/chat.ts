import { config } from "@/data/config";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendChatMessage(
  history: ChatMessage[],
  resumeContext: string,
  jobRole: string,
): Promise<string> {
  try {
    // Removed debugService, using standard console for errors only
    const systemPrompt = `You are an expert Career Coach and ATS Specialist.
    User Context: Applying for "${jobRole}".
    Resume Context: "${resumeContext.slice(0, 4000)}..."
    
    Directives:
    1. Be concise, encouraging, and actionable.
    2. Do NOT hallucinate skills the user does not have.
    3. Keep answers under 150 words.`;

    const payload = {
      model: config.api.model,
      messages: [{ role: "system", content: systemPrompt }, ...history],
      temperature: 0.7,
      max_tokens: 500,
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

    if (!content) {
      throw new Error("Empty response");
    }

    return content;
  } catch (error) {
    console.error("Chat Failed", error);
    return "I'm having trouble connecting to the AI right now. Please try again.";
  }
}
