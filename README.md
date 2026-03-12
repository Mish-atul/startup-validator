# Multi-Agent Startup Validator

> AI-powered startup validation using 4 sequential agents — built for AgentathonX 2026

![Multi-Agent Startup Validator](https://img.shields.io/badge/Hackathon-AgentathonX%202026-blueviolet)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI%20%2B%20Gemini-blue)

## Overview

Enter your startup idea in plain English and receive a comprehensive VC-style validation report with scores in under 60 seconds. The system uses 4 AI agents that analyze your idea sequentially:

1. **Research Agent** — Gathers real market data using Google Search
2. **Devil's Advocate Agent** — Identifies fatal flaws and weak assumptions
3. **Financial Agent** — Builds conservative financial projections in INR
4. **Report Agent** — Synthesizes everything into an actionable report with scores

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + TypeScript + TailwindCSS + Vite |
| Backend | FastAPI (Python 3.11+) |
| AI Model | Google Gemini 2.0 Flash |
| Streaming | Server-Sent Events (SSE) |
| Deployment | Vercel (frontend) + Render (backend) |

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Google API Key with Gemini access

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY

# Run server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
├── requirements.md          # Functional requirements
├── design.md               # Architecture & API specs
├── README.md               # This file
│
├── backend/
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment template
│   └── app/
│       ├── main.py         # FastAPI entry point
│       ├── config.py       # Configuration
│       ├── models/
│       │   └── schemas.py  # Pydantic models
│       ├── agents/
│       │   ├── base_agent.py
│       │   ├── research_agent.py
│       │   ├── devils_advocate_agent.py
│       │   ├── financial_agent.py
│       │   ├── report_agent.py
│       │   └── orchestrator.py
│       └── routes/
│           └── validate.py
│
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── vercel.json
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── index.css
        ├── types/
        │   └── index.ts
        ├── hooks/
        │   └── useValidation.ts
        ├── components/
        │   ├── IdeaInput.tsx
        │   ├── AgentCard.tsx
        │   ├── AgentProgress.tsx
        │   ├── ScoreCard.tsx
        │   ├── VerdictBadge.tsx
        │   └── ResultsDashboard.tsx
        └── utils/
            └── constants.ts
```

## API Endpoints

### POST /api/validate

Validates a startup idea using the 4-agent pipeline.

**Request:**
```json
{
  "idea": "An AI-powered platform that helps Indian farmers..."
}
```

**Response:** Server-Sent Events stream with events:
- `agent_start` — Agent beginning processing
- `agent_complete` — Agent finished with data
- `pipeline_complete` — All agents finished
- `error` — Error occurred

### GET /api/health

Health check endpoint.

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL` = your backend URL

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `GOOGLE_API_KEY` = your API key
   - `FRONTEND_URL` = your Vercel URL

## Agent Outputs

### Research Agent
- Market overview with TAM/SAM/SOM
- Top competitors with funding and weaknesses
- Key market trends
- India-specific risks
- Sources cited

### Devil's Advocate Agent
- Fatal flaws with severity ratings
- Weak assumptions vs reality
- Hard questions for founders
- Redeeming qualities

### Financial Agent
- Revenue model
- CAC/LTV estimates with assumptions
- Monthly burn and team size
- Funding requirements
- Unit economics verdict (VIABLE/MARGINAL/UNVIABLE)

### Report Agent
- Suggested startup name
- Executive summary
- Scores (0-100) for 5 dimensions
- Top 3 recommendations with timelines
- Final verdict (GO/PIVOT/NO-GO)

## License

MIT

---

Built with ❤️ for AgentathonX 2026
