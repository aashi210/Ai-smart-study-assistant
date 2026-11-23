# AI Smart Study Assistant 🎓

An interactive, AI-powered web platform designed to streamline student learning workflows by breaking down complex concepts, auto-generating concise study notes and flashcards, creating adaptive practice quizzes, and providing 24/7 Socratic academic doubt resolution.

---

## 📌 Project Overview & Problem Definition

### 1. Problem Statement
Students frequently spend hours sifting through dense, lengthy study materials, extracting manual notes, and finding relevant practice questions. This high friction in preliminary study tasks leads to cognitive overload, passive reading habits, and inefficient exam preparation. Students require an intuitive, all-in-one assistant to accelerate comprehension and active recall.

### 2. Proposed Solution
The **AI Smart Study Assistant** is a web-based application that leverages Artificial Intelligence and Natural Language Processing to:
1. **Understand Topics**: Deconstruct complex academic subjects across 3 tailored depths (ELI5, High School, and College/Deep Dive) with intuitive analogies and formula breakdowns.
2. **Generate Short Notes**: Summarize articles and lectures into structured formats (Executive Bullets, Cornell Notes, Cheatsheets, and 3D Interactive Flashcards).
3. **Create Practice Quizzes**: Automatically formulate Multiple Choice Questions (MCQs) and True/False assessments with real-time scoring and rationale feedback.
4. **Answer Academic Doubts**: Act as a 24/7 personal Socratic tutor, delivering step-by-step derivations and comprehension check prompts.

---

## 🚀 Key Features

| Module | Description | Educational Value |
| :--- | :--- | :--- |
| **💡 AI Topic Explainer** | Multi-level depth explanations, real-world analogies, LaTeX mathematical equations, and common exam pitfall warnings. Includes Text-to-Speech (TTS). | Converts abstract theory into intuitive understanding; prevents rote memorization. |
| **📝 Smart Notes & Flashcards** | Algorithmic TF-IDF summarization and keyword extraction. Supports Cornell note-taking, cheatsheet generation, and 3D flip flashcards. | Saves up to 70% of reading time; enhances spaced repetition active recall. |
| **🎯 Interactive Practice Quiz** | Dynamic MCQ generation with adaptive difficulty (Easy, Medium, Hard), instant grading, answer explanations, and score tracking. | Measures topic mastery and identifies knowledge gaps prior to exams. |
| **🤖 Socratic Doubt Solver** | Conversational tutor with subject filters (Math, Physics, CS, Biology, Chemistry), voice input, and step-by-step reasoning logic. | Encourages first-principles problem solving rather than direct answer spoon-feeding. |
| **⏱️ Pomodoro Study Station** | Integrated 25-minute study / 5-minute break cycle timer with progress ring and Web Audio sound alerts. | Prevents burnout and promotes sustained focus during revision sessions. |
| **🌓 Modern Glassmorphism UI** | Dark/Light theme toggle, responsive layout for desktop/tablets/mobile, and offline-first persistence via `localStorage`. | Frictionless user experience across all devices. |

---

## 🧠 Dual AI Engine Architecture

To ensure the project works **instantly out-of-the-box without requiring mandatory API keys or paid credits**, the application features a **Dual-Engine Design**:

1. **Built-in Offline Intelligence Engine (Default)**:
   - Uses algorithmic NLP heuristics (TF-IDF sentence scoring, lexical frequency analysis, cloze test generation).
   - Includes an extensive academic knowledge base covering over 30 fundamental curriculum topics across Computer Science, Mathematics, Physics, Biology, and Chemistry.
   - Requires zero external dependencies or internet access.
2. **Google Gemini Live AI Integration (Optional)**:
   - Students or evaluators can optionally input a Google Gemini API key in the **Settings** modal (`⚙️`).
   - Dynamically calls Gemini 1.5 Flash via REST endpoints for real-time generative responses on any arbitrary query.
   - API keys are securely stored solely in the client's local browser storage.

---

## 📁 Project Structure

```
FAI/
├── index.html            # Main single-page web application interface
├── styles.css            # Responsive Glassmorphism styles, dark/light theme, 3D cards
├── app.js                # Application state, UI event handling, timer, audio & speech
├── ai-engine.js          # Hybrid AI logic: Offline NLP heuristics + Gemini API client
├── knowledge-base.js     # Curated multi-disciplinary academic database & quiz banks
├── server.py             # Optional Python HTTP server for local hosting
└── README.md             # Project documentation and submission details
```

---

## 💻 How to Run the Website

### Option 1: Direct Browser Launch (Simplest)
Simply double-click `index.html` or open it in any modern browser:
```bash
open index.html
```

### Option 2: Python Local Server
If you prefer running via a local web server:
```bash
python3 server.py
```
This automatically starts a local server at `http://localhost:8000` and opens your default browser.

---

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3 (Modern Glassmorphism, CSS Custom Properties, 3D transforms), Modern Vanilla JavaScript (ES6+).
- **Mathematical Typography**: MathJax 3 (KaTeX/LaTeX equation rendering).
- **Audio & Accessibility**: Web Speech API (`SpeechSynthesis` for narration, `webkitSpeechRecognition` for voice input), Web Audio API for chime alerts.
- **Backend / Server**: Python 3 `http.server` & `socketserver` (zero third-party pip dependencies required).
- **Persistence**: Browser `localStorage` for dark mode preference, study streak statistics, and optional API key storage.

---

## 🧪 Quick Test Scenarios to Demo

1. **Test Topic Explainer**:
   - Navigate to **Topic Explainer**.
   - Select **Neural Networks** or **Calculus Derivatives**.
   - Switch depth to **Beginner / ELI5** or **College / Deep Dive**, then click **Explain Topic**.
   - Click **Listen (Audio)** to hear the synthesized lecture.
2. **Test Smart Notes**:
   - Navigate to **Smart Notes**.
   - Click **Load Sample: AI Foundations** or **Load Sample: Cellular Biology**.
   - Choose **Interactive 3D Flashcards** or **Cornell Note-Taking System**, then click **Generate Smart Notes**.
   - Click any flashcard to flip and test your knowledge.
3. **Test Practice Quiz**:
   - Navigate to **Practice Quiz**.
   - Choose 3 questions on **Newton's Laws** or **Photosynthesis**, and click **Create Practice Quiz**.
   - Select options to see instant green/red feedback and rationale explanations.
4. **Test Academic Doubt Solver**:
   - Navigate to **Academic Q&A**.
   - Click **"Solve Quadratic Equation"** or type your own question.
   - Observe the 4-step Socratic breakdown and practice prompt.
