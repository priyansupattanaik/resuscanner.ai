
import { config } from '@/data/config';

/**
 * Generate keywords for a job role and level using the Gemini API
 */
export async function generateKeywords(
  jobRole: string,
  jobLevel: string
): Promise<Record<string, number>> {
  try {
    const prompt = `Give keywords for the resume for an ${jobLevel} in ${jobRole} role in three sections: 'Work experience', 'Projects', 'Skills'. The response should be in JSON format.`;
    
    const response = await fetch(config.api.geminiApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.api.geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });
    
    if (!response.ok) {
      console.error('API error details:', await response.text());
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    // Beta API response structure
    const generatedText = data.candidates[0].content.parts[0].text;
    
    return parseKeywordResponse(generatedText);
  } catch (error) {
    console.error('Error generating keywords:', error);
    throw new Error('Failed to generate keywords. Please try again later.');
  }
}

/**
 * Parse the response from the Gemini API to extract keywords
 */
function parseKeywordResponse(text: string): Record<string, number> {
  try {
    // Extract JSON object from the response
    const jsonMatch = text.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in the response');
    }
    
    const keyData = JSON.parse(jsonMatch[0]);
    
    // Extract all values (arrays of keywords)
    const allArrays = Object.values(keyData) as string[][];
    
    // Flatten the arrays and process keywords
    const flatArray = allArrays.flat();
    const processedWords: string[] = [];
    
    for (const item of flatArray) {
      if (item && item.length > 0) {
        // Split multi-word phrases into individual keywords
        const words = item.split(' ');
        for (const word of words) {
          if (word && word.length > 0 && !/\d/.test(word)) {
            const cleanedWord = word.toLowerCase().replace(/[().,]/g, '');
            // Only add if not already in the array
            if (!processedWords.includes(cleanedWord)) {
              processedWords.push(cleanedWord);
            }
          }
        }
      }
    }
    
    // Filter out common words and create a frequency dictionary
    const noCount = [
      "about", "above", "across", "after", "against",
      "along", "amid", "among", "around", "at",
      "before", "behind", "below", "beneath", "beside",
      "between", "beyond", "by", "down", "during",
      "for", "from", "in", "inside", "into",
      "near", "of", "off", "on", "out",
      "outside", "over", "past", "through", "to",
      "toward", "under", "underneath", "until", "up",
      "upon", "with", "within", "the", "an", "a", "and", "but", "or", "nor", "yet", "so",
      "although", "because", "since",
      "unless", "until", "while"
    ];
    
    const compareDict: Record<string, number> = {};
    
    for (const keyword of processedWords) {
      if (!noCount.includes(keyword)) {
        compareDict[keyword] = 1;
      }
    }
    
    return compareDict;
  } catch (error) {
    console.error('Error parsing keyword response:', error);
    throw new Error('Failed to parse keyword response');
  }
}
