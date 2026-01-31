import { config } from "@/data/config";

export interface HumanizeRequest {
  text: string;
  tone: "formal" | "informal" | "interview" | "explanatory";
}

export async function humanizeText(payload: HumanizeRequest): Promise<string> {
  try {
    // 1. Calculate word count to enforce strict length limits
    const wordCount = payload.text.trim().split(/\s+/).length;
    const maxWords = Math.ceil(wordCount * 1.05); // Max 5% increase allowed
    const minWords = Math.floor(wordCount * 0.85); // Allow becoming shorter (more concise)

    const systemPrompt = `You are a Text Humanizer Engine.
    
    CRITICAL CONSTRAINT: 
    - Input Word Count: ${wordCount} words.
    - OUTPUT LIMIT: Must be between ${minWords} and ${maxWords} words.
    - DO NOT EXCEED ${maxWords} words. If you are wordy, you fail.
    
    OBJECTIVE: 
    Rewrite the text to bypass AI detectors (GPTZero, Turnitin) by removing "robotic perfection." Make it sound like a real person wrote it in one pass without over-editing.

    ANTI-DETECTION RULES:
    1. **Kill the Adjectives**: AI loves adjectives (e.g., "vibrant," "crucial," "meticulous"). Remove them. Use strong verbs instead.
    2. **Break the Rhythm**: 
       - Use a very short sentence. (Like this.)
       - Follow it with a longer, looser sentence that maybe connects two ideas with a simple "and" or "but" because that's how people actually think.
    3. **Banned Words (Immediate Fail)**:
       - "Delve," "realm," "tapestry," "landscape," "leverage," "utilize," "underscore," "testament," "pivotal."
       - "In conclusion," "Moreover," "Furthermore."
    4. **Formatting**:
       - No bullet points (unless input had them).
       - No "Title:" or "Summary:" headers. Just the raw text.

    TONE SETTING ("${payload.tone}"):
    - **formal**: Clear, direct, professional. Avoid "fancy" words. (e.g., use "use" instead of "utilize").
    - **informal**: Casual, like a text or email to a friend. Contractions allowed (I'm, it's).
    - **interview**: Spoken word style. It's okay to sound slightly opinionated.
    - **explanatory**: Simple teaching style. "Here is how it works..."

    STEP-BY-STEP:
    1. Read input.
    2. Strip out all "AI fluff" and complex transitions.
    3. Rewrite in simple, direct English.
    4. Check word count. If > ${maxWords}, DELETE words until it fits.`;

    const response = await fetch(config.api.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.api.apiKey}`,
      },
      body: JSON.stringify({
        model: config.api.model, // Using the Llama 3.3 70B model defined in config
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: payload.text },
        ],
        // Temperature 0.8: High enough for variety, low enough to respect the word count constraint
        temperature: 0.8,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Error: No content generated.";
  } catch (error) {
    console.error("Humanize API Error", error);
    throw new Error("Failed to humanize text. Please try again.");
  }
}