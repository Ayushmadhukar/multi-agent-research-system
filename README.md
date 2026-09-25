# ResearchX — Multi-Agent Research System

> A production-ready autonomous research engine that deploys four specialized AI agents to search, read, synthesize, and peer-review any topic — delivering structured intelligence reports in seconds.

---

## Overview

ResearchX orchestrates a pipeline of four LangGraph ReAct agents, each with a distinct role. Given any research topic, the system autonomously collects information from the web, reads and extracts content from relevant pages, drafts a full structured report, and finally critiques it for quality — all without manual intervention.

The result is a formatted intelligence dossier with an executive summary, key findings, source citations, and a quality scorecard — accessible through a clean web interface.

---

## Architecture

```
User Input (Topic)
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                   FastAPI Backend                        │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Search  │→ │  Reader  │→ │  Writer  │→ │ Critic │  │
│  │  Agent   │  │  Agent   │  │  Chain   │  │ Chain  │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│       │              │            │              │       │
│    Tavily         Scraper      Groq/          Groq/      │
│    Search        (requests     Mistral        Mistral    │
│     API          + BS4)         LLM            LLM       │
└─────────────────────────────────────────────────────────┘
       │
       ▼
React Frontend (Vite) — real-time polling, tabbed report view
```

### Agent Roles

| # | Agent | Tool | Responsibility |
|---|-------|------|----------------|
| 1 | **Search Agent** | `web_search` (Tavily) | Queries the web for relevant, recent sources |
| 2 | **Reader Agent** | `scrape_website` (BeautifulSoup) | Picks the best URL and extracts deep content |
| 3 | **Writer Chain** | LLM (Groq / Mistral) | Synthesizes a structured multi-section report |
| 4 | **Critic Chain** | LLM (Groq / Mistral) | Scores the report and provides a peer review |

---

## Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — REST API + Server-Sent Events
- [LangGraph](https://langchain-ai.github.io/langgraph/) — ReAct agent orchestration
- [LangChain](https://python.langchain.com/) — LLM chains and prompt templates
- [Tavily](https://tavily.com/) — Real-time web search API
- [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/) — Web scraping
- [Groq](https://groq.com/) / [Mistral AI](https://mistral.ai/) — LLM providers

**Frontend**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) — UI framework
- Vanilla CSS design system — no Tailwind, no UI kit
- [Lucide React](https://lucide.dev/) — icon set

---

## Project Structure

```
multi-agent-research-system/
├── agents.py              # LangGraph agent builders + LLM chains
├── tools.py               # web_search and scrape_website tools
├── pipeline.py            # Standalone pipeline runner (CLI)
├── requirements.txt       # Python dependencies
├── .env                   # API keys (not committed)
│
├── backend/
│   ├── main.py            # FastAPI app — all endpoints, task runner
│   └── data/
│       └── history.json   # Persisted report history (runtime, gitignored)
│
└── frontend/
    ├── index.html
    ├── vite.config.js     # Dev server + API proxy to :8000
    ├── package.json
    └── src/
        ├── App.jsx                        # Root app state & routing
        ├── index.css                      # Design system tokens
        ├── main.jsx
        └── components/
            ├── Navbar.jsx                 # Top navigation bar
            ├── ResearchForm.jsx           # Search input + depth selector
            ├── StatusTracker.jsx          # Live pipeline progress view
            ├── ResearchWorkspace.jsx      # Tabbed report viewer
            ├── KeyFindings.jsx            # Findings list
            ├── SourceCard.jsx             # Source citations list
            ├── Scorecard.jsx              # Quality metrics panel
            ├── HistoryDrawer.jsx          # Saved reports slide-panel
            └── MarkdownRenderer.jsx       # Markdown → HTML renderer
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- API keys for **Tavily** and either **Groq** or **Mistral**

### 1. Clone the repository

```bash
git clone https://github.com/Ayushmadhukar/multi-agent-research-system.git
cd multi-agent-research-system
```

### 2. Set up the Python environment

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
TAVILY_API_KEY=your_tavily_api_key
GROQ_API_KEY=your_groq_api_key
MISTRAL_API_KEY=your_mistral_api_key

# Use Groq as the primary LLM (set to false to use Mistral)
USE_GROQ=true
GROQ_MODEL=openai/gpt-oss-120b
```

Get your keys:
- Tavily → [app.tavily.com](https://app.tavily.com)
- Groq → [console.groq.com](https://console.groq.com)
- Mistral → [console.mistral.ai](https://console.mistral.ai)

### 4. Start the backend

```bash
python backend/main.py
```

The API will be available at `http://127.0.0.1:8000`.  
Swagger docs at `http://127.0.0.1:8000/docs`.

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/health` | Server health + API key status |
| `POST` | `/api/research` | Start a research job, returns `task_id` |
| `GET`  | `/api/research/status/{task_id}` | Poll pipeline progress |
| `GET`  | `/api/research/stream/{task_id}` | SSE stream for real-time updates |
| `GET`  | `/api/history` | List all saved reports |
| `GET`  | `/api/research/item/{item_id}` | Fetch a specific report |
| `DELETE` | `/api/history/{item_id}` | Delete a report |

### Example: Start a research job

```bash
curl -X POST http://localhost:8000/api/research \
  -H "Content-Type: application/json" \
  -d '{"topic": "Large Language Model reasoning capabilities", "depth": "standard"}'
```

**Response:**
```json
{ "task_id": "task_a3f9c12d8b4e", "status": "queued" }
```

### Poll for status

```bash
curl http://localhost:8000/api/research/status/task_a3f9c12d8b4e
```

**Response (completed):**
```json
{
  "phase": "COMPLETED",
  "progress": 100,
  "result": {
    "id": "res_...",
    "topic": "...",
    "executive_summary": "...",
    "full_report": "...",
    "key_findings": [...],
    "sources": [...],
    "scorecard": { "overall_score": 8.7, ... }
  }
}
```

---

## Research Depth Options

| Option | Description |
|--------|-------------|
| `quick` | Fast executive summary — single search pass |
| `standard` | Balanced depth — search + scrape + full report |
| `deep` | Exhaustive dossier — maximum context synthesis |

---

## Running the Pipeline via CLI

You can also run the research pipeline directly from the terminal without the web interface:

```bash
python pipeline.py
# Enter a research topic: Quantum computing error correction 2026
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TAVILY_API_KEY` | ✅ | Tavily search API key |
| `GROQ_API_KEY` | ✅ (or Mistral) | Groq LLM API key |
| `MISTRAL_API_KEY` | ✅ (or Groq) | Mistral AI API key |
| `USE_GROQ` | Optional | `true` to use Groq as primary LLM (default: `true`) |
| `GROQ_MODEL` | Optional | Groq model name (default: `openai/gpt-oss-120b`) |
| `MISTRAL_MODEL` | Optional | Mistral model name (default: `mistral-small-latest`) |

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">Built with LangGraph · FastAPI · React</p>
