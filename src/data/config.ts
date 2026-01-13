/**
 * Application configuration
 */
export const config = {
  app: {
    name: "ResuScanner.AI",
    description:
      "AI-powered resume analyzer that helps you optimize your resume for ATS systems",
    version: "1.0.0",
  },
  api: {
    // API Key is now securely loaded from environment variables
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || "",
    // OpenRouter API Endpoint
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    // The specific model you requested
    model: "allenai/molmo-2-8b:free",
    // Site URL and Name are required for OpenRouter rankings/statistics
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
      // Animation timing in milliseconds
      resultDelay: 1000,
      scoreReveal: 2000,
      keywordInterval: 100,
      // Star animation speeds
      normalStarSpeed: 5,
      loadingStarSpeed: 20,
    },
  },
};

export const sampleKeywords = [
  "react",
  "javascript",
  "typescript",
  "css",
  "html",
  "api",
  "responsive",
  "frontend",
  "web",
  "development",
  "git",
  "ui",
];
