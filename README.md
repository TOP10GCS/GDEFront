# 🎙 Pitch Analyzer

A modern AI-style pitch simulator built with React and Vite. Practice your pitch, get **real AI-powered feedback** using Azure OpenAI services, and improve instantly.

## 🌐 Live Demo

Deployed live on: **https://gde-front.vercel.app/**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **5-step simulation flow** — Welcome → Settings → Listening → Transcription → Analysis
- **Configurable sessions** — Goal, formality, situation, location, and time constraint
- **Real microphone recording** — Capture audio directly in the browser
- **Azure Speech-to-Text** — Converts your pitch audio into text
- **Azure GPT-4o Analysis** — Provides detailed feedback on confidence, clarity, engagement, and more
- **Score history** — Track results across multiple attempts
- **Light / Dark mode** — Toggle with persistence via localStorage
- **Smooth animations** — Page transitions and micro-interactions via Framer Motion
- **Responsive design** — Works on desktop, tablet, and mobile

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components (Card, Button, Badge, ProgressBar, etc.)
├── pages/            # Route pages (Welcome, Settings, Listening, Transcription, Analysis)
├── styles/           # Global CSS and design tokens
├── App.jsx           # Router setup and app state
└── main.jsx          # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher (includes npm)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/TOP10GCS/GDEFront.git
cd GDEFront/front

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be running at **http://localhost:5173**

### Other Commands

| Command             | Description                      |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start dev server with hot reload |
| `npm run build`     | Build for production             |
| `npm run preview`   | Preview the production build     |
| `npm run lint`      | Run ESLint                       |

---

## 🛠 Tech Stack

| Package            | Purpose                    |
| ------------------ | -------------------------- |
| React 19           | UI framework               |
| Vite 7             | Build tool & dev server    |
| React Router DOM   | Client-side routing        |
| Framer Motion      | Animations & transitions   |
| Lucide React       | Icons                      |
| Azure OpenAI       | Speech-to-text and GPT-4o analysis |

---

## 🎨 Pages Overview

| Page         | Route        | Description                                      |
| ------------ | ------------ | ------------------------------------------------ |
| Welcome      | `/`          | Landing page with app introduction                |
| Settings     | `/settings`  | Configure pitch goal, formality, situation, etc.  |
| Listening    | `/listening` | Record your pitch using the microphone            |
| Transcription| `/transcription` | Converts audio to text using Azure Speech-to-Text |
| Analysis     | `/analysis`  | AI-powered feedback on your pitch                 |

---

## ⚠️ Troubleshooting

**PowerShell blocks `npm` commands:**
Run this once as Administrator:
```powershell
Set-ExecutionPolicy RemoteSigned
```

---

## 📄 License

This project is for educational and demonstration purposes.
