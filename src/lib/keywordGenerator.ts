import { config } from "@/data/config";

/**
 * Generate keywords for a job role and level using the OpenRouter API
 */
export async function generateKeywords(
  jobRole: string,
  jobLevel: string
): Promise<Record<string, number>> {
  try {
    // We explicitly ask for a JSON object to ensure the model outputs what we need
    const prompt = `You are an expert ATS (Applicant Tracking System) scanner. 
    Identify the top 30 most critical keywords and skills for a "${jobLevel}" level "${jobRole}" role.
    
    Return the response ONLY as a valid JSON object with this exact structure:
    {
      "technicalSkills": ["skill1", "skill2"],
      "softSkills": ["skill1", "skill2"],
      "tools": ["tool1", "tool2"]
    }
    
    Do not include markdown formatting (like \`\`\`json), just the raw JSON string.`;

    const response = await fetch(config.api.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.api.apiKey}`,
        "HTTP-Referer": config.api.siteUrl, // Required by OpenRouter
        "X-Title": config.api.siteName, // Required by OpenRouter
      },
      body: JSON.stringify({
        model: config.api.model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
        // Temperature 0.2 keeps the model focused and deterministic for data extraction
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error details:", errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Extract the content from the OpenRouter/OpenAI compatible response
    const generatedText = data.choices?.[0]?.message?.content || "";

    if (!generatedText) {
      throw new Error("No content received from AI model");
    }

    return parseKeywordResponse(generatedText);
  } catch (error) {
    console.error("Error generating keywords:", error);
    throw new Error("Failed to generate keywords. Please try again later.");
  }
}

/**
 * Parse the response from the LLM to extract keywords
 */
function parseKeywordResponse(text: string): Record<string, number> {
  try {
    console.log("Raw AI Response:", text); // Helpful for debugging

    // Robust JSON extraction: Find the first '{' and the last '}'
    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("No valid JSON brackets found in response");
    }

    const jsonString = text.substring(startIndex, endIndex + 1);
    const keyData = JSON.parse(jsonString);

    // Extract all values (arrays of keywords)
    // We handle nested objects or direct arrays
    const allArrays = Object.values(keyData).filter((val) =>
      Array.isArray(val)
    ) as string[][];

    // Flatten the arrays and process keywords
    const flatArray = allArrays.flat();
    const processedWords: string[] = [];

    for (const item of flatArray) {
      if (item && typeof item === "string" && item.length > 0) {
        // Split multi-word phrases into individual keywords?
        // NOTE: For ATS, keeping phrases like "Machine Learning" together is often better.
        // But to match your original logic, we will split them but clean them carefully.

        // Let's keep phrases intact if they are short (e.g. "React Native"),
        // but split if they are sentences.
        const words = item.length > 20 ? item.split(" ") : [item];

        for (const word of words) {
          if (word && word.length > 0 && !/\d/.test(word)) {
            // Filter out numbers if desired
            const cleanedWord = word
              .toLowerCase()
              .replace(/[().,]/g, "")
              .trim();
            // Only add if not already in the array and length is sufficient
            if (
              cleanedWord.length > 1 &&
              !processedWords.includes(cleanedWord)
            ) {
              processedWords.push(cleanedWord);
            }
          }
        }
      }
    }

    // Filter out common words
    const noCount = [
      "about",
      "above",
      "across",
      "after",
      "against",
      "along",
      "amid",
      "among",
      "around",
      "at",
      "before",
      "behind",
      "below",
      "beneath",
      "beside",
      "between",
      "beyond",
      "by",
      "down",
      "during",
      "for",
      "from",
      "in",
      "inside",
      "into",
      "near",
      "of",
      "off",
      "on",
      "out",
      "outside",
      "over",
      "past",
      "through",
      "to",
      "toward",
      "under",
      "underneath",
      "until",
      "up",
      "upon",
      "with",
      "within",
      "the",
      "an",
      "a",
      "and",
      "but",
      "or",
      "nor",
      "yet",
      "so",
      "although",
      "because",
      "since",
      "unless",
      "until",
      "while",
      "skills",
      "keywords",
      "experience",
      "proficient",
      "knowledge",
    ];

    const compareDict: Record<string, number> = {};

    for (const keyword of processedWords) {
      if (!noCount.includes(keyword)) {
        compareDict[keyword] = 1;
      }
    }

    return compareDict;
  } catch (error) {
    console.error("Error parsing keyword response:", error);
    // If parsing fails, we shouldn't crash the app, but return empty so fallback triggers
    return {};
  }
}
