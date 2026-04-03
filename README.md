# Nebula Chat

[![Next.js](https://img.shields.io/badge/Next.js_15-000?logo=nextdotjs&logoColor=fff)](#)
[![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?logo=typescript&logoColor=fff)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?logo=tailwindcss&logoColor=fff)](#)
[![Ollama](https://img.shields.io/badge/Ollama-local_LLM-fff?logo=ollama&logoColor=000)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)

A dark-themed conversational chatbot powered by a local [Ollama](https://ollama.ai/) instance. Tokens stream in real time, the model remembers previous turns, and the whole UI stays fully accessible.

---

## Screenshots

**Chat interface — dark & light**

<div align="center">
  <table>
    <tr>
      <td><img src="public/1.png" alt="Chat — dark mode" /></td>
      <td><img src="public/2.png" alt="Chat — light mode" /></td>
    </tr>
  </table>
</div>

**Landing page & features**

<div align="center">
  <table>
    <tr>
      <td><img src="public/3.png" alt="Landing page — dark" /></td>
      <td><img src="public/4.png" alt="Landing page — light" /></td>
    </tr>
    <tr>
      <td><img src="public/5.png" alt="Features section — dark" /></td>
      <td></td>
    </tr>
  </table>
</div>

---

## Features

| Area                     | Details                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| **Streaming**            | Tokens appear as they are generated — animated cursor during generation                        |
| **Conversation context** | Last 10 turns sent to the model on every request                                               |
| **Cancel mid-stream**    | Stop button aborts the in-flight request via `AbortController`                                 |
| **Model picker**         | Switch between any model installed in Ollama at runtime                                        |
| **Session history**      | Past conversations saved to `localStorage` (up to 50 sessions)                                 |
| **Dark "Nebula" theme**  | Violet/indigo accent on `slate-950` base; light mode toggle                                    |
| **Security**             | SSRF prevention, in-memory rate limiting (20 req/min per IP), Zod validation, security headers |
| **Error boundary**       | Full-screen fallback UI on unexpected crashes                                                  |
| **CI**                   | GitHub Actions — `tsc`, ESLint, Vitest on every push/PR                                        |

---

## Tech Stack

| Layer      | Technology                             |
| ---------- | -------------------------------------- |
| Framework  | Next.js 15 (`pages/` router)           |
| Language   | TypeScript 5 (strict)                  |
| Styling    | TailwindCSS v4 + Flowbite React        |
| State      | Zustand 5 with `persist` middleware    |
| AI backend | Ollama local — default model `mistral` |
| Testing    | Vitest + React Testing Library + MSW   |

---

## Prerequisites

- **Node.js 20+**
- **[Ollama](https://ollama.ai/)** running locally on port `11434`
- At least one model pulled, e.g.:

```bash
ollama pull mistral
```

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/chatbot_AI.git
cd chatbot_AI

# 2. Install dependencies
npm install

# 3. (Optional) set a custom Ollama URL
echo "OLLAMA_URL=http://localhost:11434" > .env.local

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

```bash
npm run dev          # Development server with hot reload
npm run build        # Production build
npm run lint         # ESLint
npm test             # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
npm run test:coverage  # Coverage report (v8)
```

---

## Project Structure

```
src/
├── components/        # UI components (ChatMessage, ChatInput, ChatHeader…)
├── lib/               # env.ts · rateLimit.ts · validateUrl.ts
├── pages/
│   ├── api/
│   │   ├── chat.ts    # Streaming NDJSON proxy → Ollama /api/chat
│   │   └── models.ts  # Lists available models
│   └── index.tsx      # Entry point
├── store/
│   ├── chatStore.ts   # Messages, streaming, settings
│   └── historyStore.ts
└── tests/             # Vitest + RTL + MSW mocks
```

---

## Environment Variables

| Variable     | Default                  | Description                   |
| ------------ | ------------------------ | ----------------------------- |
| `OLLAMA_URL` | `http://localhost:11434` | Base URL of the Ollama server |

---

## License

MIT
