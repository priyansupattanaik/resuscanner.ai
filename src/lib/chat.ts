import { config } from "@/data/config";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendChatMessage(
  history: ChatMessage[],
  resumeContext: string,
  jobRole: string
): Promise<string> {
  try {
    const systemPrompt = `You are an expert ATS Resume Consultant. 
    Context:
    - User is applying for: ${jobRole}
    - Resume Content: "${resumeContext.slice(
      0,
      3000
    )}..." (truncated for brevity)
    
    Goal: Answer the user's specific questions about improving their resume. Be concise, actionable, and encouraging.
    Format: Use simple text with bullet points if needed. Do not use complex markdown.`;

    const messages = [{ role: "system", content: systemPrompt }, ...history];

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
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error("Chat API failed");

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content || "I couldn't generate a response."
    );
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
}
