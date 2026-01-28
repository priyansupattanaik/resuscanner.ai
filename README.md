# ResuScanner.AI (TAS Edition)

**ResuScanner** is not just another resume checker. It is powered by **TAS (Talent Acquisition Specialist)**—a strict, no-nonsense AI recruiter persona designed to ruthlessly optimize resumes for ATS systems and human hiring managers.

Built with a **Neo-Brutalist / Swiss Grid** aesthetic, this Progressive Web App (PWA) offers deep forensic analysis, impact scoring, and bullet-point rewriting tools.

![Project Status](https://img.shields.io/badge/Status-Production_Ready-black?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Vite_|_Tailwind-black?style=flat-square)
![AI Model](https://img.shields.io/badge/AI-Llama_3_via_Groq-blue?style=flat-square)

## 🚀 Features

### 1. 🧠 TAS Intelligence Engine

Unlike standard keyword counters, TAS uses a **"Dual-Lens"** analysis:

- **MNC Lens:** Checks for strict compliance, education, and ATS formatting (Workday/Taleo standards).
- **Startup Lens:** Checks for "Impact Metrics" ($ revenue, % growth), versatility, and culture fit.
- **Zero-Tolerance Logic:** If a resume is irrelevant to the job role, TAS rejects it immediately (Score < 15).

### 2. 🔨 Resume Forge

- **Weakness Detection:** Identifies generic bullet points (e.g., "Responsible for sales").
- **AI Rewriting:** Instantly transforms them into high-impact metrics using the Google XYZ formula (e.g., "Generated $50k revenue by optimizing...").

### 3. 💬 TAS Chat Assistant

- **Context-Aware:** The chat knows your exact score and missing keywords.
- **Strict Persona:** TAS refuses to answer non-career questions (e.g., "How's the weather?").
- **ATS Knowledge:** Provides specific formatting advice for systems like Greenhouse and Lever.

### 4. 📱 Native PWA Support

- Installable on **iOS, Android, and Desktop**.
- Offline-ready caching.
- Native app-like feel with splash screens and strict viewport scaling.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Swiss Grid / Neo-Brutalist Theme)
- **AI Inference:** Groq API (Llama-3-70b)
- **State Management:** React Context API
- **PDF Processing:** PDF.js
- **Icons:** Lucide React

## 📦 Installation

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/yourusername/resuscanner.ai.git](https://github.com/yourusername/resuscanner.ai.git)
    cd resuscanner.ai
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # Ensure PWA plugin is installed
    npm install vite-plugin-pwa
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:

    ```env
    VITE_GROQ_API_KEY=your_groq_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🎨 Design System

- **Font Stack:** `Space Grotesk` (Headers), `Inter` (Body), `Space Mono` (Data).
- **Visual Style:** High contrast, hard borders (2px black), "Neo-Shadows", and strict left alignment.

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

_Powered by TAS (Talent Acquisition Specialist) AI._
