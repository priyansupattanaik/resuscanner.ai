# ResuScanner.AI

A modern ATS (Applicant Tracking System) resume scanner built with Next.js and Tailwind CSS. Upload a PDF resume, specify a job role and level, and get an ATS score with keyword suggestions.

## Features

- Upload PDF resumes for keyword analysis.
- Input job role and level (Internship/Entry Level) to generate relevant keywords.
- Displays ATS score (out of 100) and missing keyword suggestions.
- Cosmic design with starry background, floating animations, and a grid overlay.
- Mobile-responsive and powered by Google Generative AI (Gemini-Pro).

## Demo

https://resuscanner.netlify.app/

## Installation

### Clone the Repo

```bash
git clone https://github.com/priyansupattanaik/resuscanner.ai.git
cd resuscanner.ai
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment

Add your Google API key to `.env.local`:

```text
GOOGLE_API_KEY="your-google-api-key"
```

### Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Usage

1. Upload a PDF resume.
2. Enter a job role (e.g., "Software Engineer") and select a level.
3. Click "Submit" to see your ATS score and keyword suggestions.
