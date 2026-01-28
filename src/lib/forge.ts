import { config } from "@/data/config";

export async function forgeBulletPoint(
  originalText: string,
  jobRole: string,
): Promise<string> {
  try {
    const systemPrompt = `You are TAS (Talent Acquisition Specialist).
    
    TASK: Rewrite the candidate's weak resume bullet point to be HIGH IMPACT.
    
    RULES:
    1. Use the Google "XYZ Formula": "Accomplished [X] as measured by [Y], by doing [Z]".
    2. Add plausible placeholders for metrics if missing (e.g., "[X]%").
    3. Remove fluff words ("Responsible for", "Helped with"). Start with strong action verbs (Engineered, Spearheaded, Optimized).
    4. Keep it under 25 words.
    5. OUTPUT: Return ONLY the rewritten bullet point. No quotes, no preamble.`;

    const userPrompt = `
    TARGET ROLE: ${jobRole}
    WEAK BULLET: "${originalText}"
    
    REWRITE AS TAS:`;

    const response = await fetch(config.api.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.api.apiKey}`,
      },
      body: JSON.stringify({
        model: config.api.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4, // Creative enough to rewrite, strict enough to follow rules
        max_tokens: 100,
      }),
    });

    if (!response.ok) throw new Error("Forge API Failed");

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content || "Could not generate improvement."
    );
  } catch (error) {
    console.error("Forge Error", error);
    return "TAS System Alert: Connection failed during rewrite.";
  }
}
