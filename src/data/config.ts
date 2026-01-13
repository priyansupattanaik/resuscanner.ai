// DEBUG: Check if key is loaded (Prints to Console)
const rawKey = import.meta.env.VITE_OPENROUTER_API_KEY;
console.log(
  "System Status:",
  rawKey ? "Key Loaded" : "Key Missing (Check .env)"
);

export const config = {
  app: {
    name: "ResuScanner.AI",
    description: "AI-powered resume analyzer",
    version: "1.0.0",
  },
  api: {
    apiKey: rawKey || "",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",

    // ✅ Using Llama 3.2 3B Free
    model: "meta-llama/llama-3.2-3b-instruct:free",

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
