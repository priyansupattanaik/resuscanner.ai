// src/data/config.ts
// Config loaded


export const config = {
  app: {
    name: "ResuScanner.AI",
    description: "AI-powered resume analyzer",
    version: "1.0.0",
  },
  api: {
    apiKey: "", // Key is now secured backend-side
    // Updated: Proxy through Netlify Function
    endpoint: "/.netlify/functions/analyze",

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
