
/**
 * Application configuration
 */
export const config = {
  app: {
    name: 'ResuScanner.AI',
    description: 'AI-powered resume analyzer that helps you optimize your resume for ATS systems',
    version: '1.0.0',
  },
  api: {
    // Your Gemini API key is stored here
    geminiApiKey: 'AIzaSyAzQWyzuPKGQfYPcbMUHDZLJwNla4ZyuA8',
    // Updated API endpoint to use the correct Gemini API version
    geminiApiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  },
  ui: {
    jobLevels: [
      { id: 'internship', label: 'Internship' },
      { id: 'entry', label: 'Entry Level' },
      { id: 'mid', label: 'Mid Level' },
      { id: 'senior', label: 'Senior Level' },
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
  'react', 'javascript', 'typescript', 'css', 'html', 'api', 
  'responsive', 'frontend', 'web', 'development', 'git', 'ui'
];
