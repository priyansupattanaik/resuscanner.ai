// src/data/config.ts
// DEBUG: Check if key is loaded (Prints to Console)
const rawKey = import.meta.env.VITE_GROQ_API_KEY;
console.log(
  "System Status:",
  rawKey ? "Key Loaded" : "Key Missing (Check .env for VITE_GROQ_API_KEY)",
);

export const config = {
  app: {
    name: "ResuScanner.AI",
    description: "AI-powered resume analyzer",
    version: "1.0.0",
  },
  api: {
    apiKey: rawKey || "",
    // Updated: Groq API Endpoint
    endpoint: "https://api.groq.com/openai/v1/chat/completions",

    // Updated: Using Llama 3.3 70B Versatile (Supported by Groq)
    model: "llama-3.3-70b-versatile",

    // Kept for compatibility, though Groq doesn't strictly enforce these like OpenRouter
    siteUrl: import.meta.env.VITE_SITE_URL || "http://localhost:5173",
    siteName: import.meta.env.VITE_SITE_NAME || "ResuScanner.AI",
  },
  ui: {
    jobLevels: [
      { id: "internship", label: "Internship" },
      { id: "entry", label: "Entry Level" },
      { id: "mid", label: "Mid Level" },
      { id: "senior", label: "Senior Level" },
    ],
    animations: {
      resultDelay: 1000,
      scoreReveal: 2000,
      keywordInterval: 100,
      normalStarSpeed: 5,
      loadingStarSpeed: 20,
    },
  },
};
