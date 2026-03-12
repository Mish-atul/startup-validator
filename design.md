# Multi-Agent Startup Validator — Design Document

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
│                    React + TypeScript + TailwindCSS                         │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Idea Input  │───▶│ Agent Progress  │───▶│    Results Dashboard        │ │
│  │  Component  │    │    Cards (x4)   │    │ (Scores, Verdict, Actions)  │ │
│  └─────────────┘    └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ SSE Stream
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FASTAPI BACKEND                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         ORCHESTRATOR                                  │  │
│  │   Sequential Pipeline: Research → Devil's Advocate → Financial → Report │
│  │   SSE Event Emitter                                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│         │              │                │               │                   │
│         ▼              ▼                ▼               ▼                   │
│  ┌───────────┐  ┌─────────────┐  ┌───────────┐  ┌───────────┐             │
│  │ Research  │  │  Devil's    │  │ Financial │  │  Report   │             │
│  │   Agent   │  │  Advocate   │  │   Agent   │  │   Agent   │             │
│  │(+Search)  │  │   Agent     │  │           │  │           │             │
│  └───────────┘  └─────────────┘  └───────────┘  └───────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOOGLE GEMINI API                                    │
│                    Model: gemini-2.0-flash                                   │
│                    + Google Search Grounding (Research Agent)                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
MULTI-AGENT STARTUP VALIDATOR/
├── requirements.md
├── design.md
├── README.md
│
├── backend/
│   ├── .env.example
│   ├── requirements.txt
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app entry point
│   │   ├── config.py               # Configuration & env vars
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py          # Pydantic models
│   │   ├── agents/
│   │   │   ├── __init__.py
│   │   │   ├── base_agent.py       # Base agent class
│   │   │   ├── research_agent.py   # Agent 1: Market research
│   │   │   ├── devils_advocate_agent.py  # Agent 2: Critique
│   │   │   ├── financial_agent.py  # Agent 3: Financial model
│   │   │   ├── report_agent.py     # Agent 4: Final synthesis
│   │   │   └── orchestrator.py     # Pipeline coordinator
│   │   └── routes/
│   │       ├── __init__.py
│   │       └── validate.py         # API endpoints
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json
│   ├── public/
│   │   └── favicon.ico
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── vite-env.d.ts
│       ├── types/
│       │   └── index.ts            # TypeScript interfaces
│       ├── hooks/
│       │   └── useValidation.ts    # SSE hook
│       ├── components/
│       │   ├── IdeaInput.tsx       # Input form
│       │   ├── AgentCard.tsx       # Agent status card
│       │   ├── AgentProgress.tsx   # Progress container
│       │   ├── ResultsDashboard.tsx # Results display
│       │   ├── ScoreCard.tsx       # Individual score display
│       │   └── VerdictBadge.tsx    # GO/PIVOT/NO-GO badge
│       └── utils/
│           └── constants.ts        # App constants
```

---

## API Specification

### Endpoint: POST /api/validate

Initiates the 4-agent validation pipeline and streams results via SSE.

**Request:**
```http
POST /api/validate
Content-Type: application/json

{
  "idea": "An AI-powered platform that helps Indian farmers predict crop diseases using smartphone photos..."
}
```

**Response:** Server-Sent Events stream

**SSE Event Types:**

```typescript
// Agent starting
event: agent_start
data: {"agent": "research", "message": "Starting market research with web search..."}

// Progress update (optional during long operations)
event: agent_progress
data: {"agent": "research", "message": "Analyzing competitor landscape..."}

// Agent completed successfully
event: agent_complete
data: {"agent": "research", "data": {/* ResearchAgentResponse */}}

// All agents completed
event: pipeline_complete
data: {"message": "Validation complete", "total_time_seconds": 45.2}

// Error occurred
event: error
data: {"agent": "financial", "error": "Rate limit exceeded", "recoverable": true}
```

### Endpoint: GET /health

Health check endpoint for deployment monitoring.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

---

## Data Schemas

### ValidationRequest
```python
class ValidationRequest(BaseModel):
    idea: str = Field(..., min_length=50, description="Startup idea description")
```

### ResearchAgentResponse
```python
class Competitor(BaseModel):
    name: str
    funding: str
    weakness: str

class ResearchAgentResponse(BaseModel):
    market_overview: str
    tam: str  # Total Addressable Market
    sam: str  # Serviceable Addressable Market
    som: str  # Serviceable Obtainable Market
    competitors: List[Competitor]
    key_trends: List[str]
    india_specific_risks: List[str]
    sources: List[str]
```

### DevilsAdvocateResponse
```python
class FatalFlaw(BaseModel):
    flaw: str
    why_it_kills: str
    severity: str  # "CRITICAL" | "HIGH" | "MEDIUM"

class WeakAssumption(BaseModel):
    assumption: str
    reality: str

class DevilsAdvocateResponse(BaseModel):
    fatal_flaws: List[FatalFlaw]
    weak_assumptions: List[WeakAssumption]
    hard_questions: List[str]
    redeeming_qualities: List[str]
```

### FinancialAgentResponse
```python
class Estimate(BaseModel):
    value: str
    assumption: str

class BurnEstimate(BaseModel):
    value: str
    team_size_assumed: int

class FinancialAgentResponse(BaseModel):
    revenue_model: str
    cac_estimate: Estimate
    ltv_estimate: Estimate
    ltv_cac_ratio: str
    monthly_burn: BurnEstimate
    runway_needed_months: int
    seed_funding_needed: str
    break_even_timeline: str
    unit_economics_verdict: str  # "VIABLE" | "MARGINAL" | "UNVIABLE"
    financial_risks: List[str]
```

### ReportAgentResponse
```python
class ScoreDetail(BaseModel):
    score: int  # 0-100
    reasoning: str

class Recommendation(BaseModel):
    action: str
    timeline: str
    priority: str  # "HIGH" | "MEDIUM" | "LOW"

class ReportAgentResponse(BaseModel):
    startup_name_suggestion: str
    executive_summary: str
    scores: Dict[str, ScoreDetail]  # market_opportunity, competitive_risk, etc.
    top_3_recommendations: List[Recommendation]
    verdict: str  # "GO" | "PIVOT" | "NO-GO"
    verdict_reasoning: str
```

---

## Agent Specifications

### Agent 1: Research Agent

**Purpose:** Gather real market data using web search

**Model:** `gemini-2.0-flash` with Google Search grounding

**System Prompt:**
```
You are the Research Agent in a multi-agent startup validation system. Your ONLY job is to research the market for the startup idea provided. Use Google Search to find real, current market data. Search for: market size, top competitors, funding rounds, trends. Focus on the Indian market context wherever applicable. Be specific with numbers. Cite your sources. Do NOT provide opinions or recommendations — facts only. CRITICAL: Return ONLY a valid JSON object. No prose. No markdown. No code blocks. Just raw JSON.
```

**Input:** Startup idea (string)  
**Output:** ResearchAgentResponse (JSON)

### Agent 2: Devil's Advocate Agent

**Purpose:** Critically analyze and find flaws

**Model:** `gemini-2.0-flash` (no tools)

**System Prompt:**
```
You are a brutally honest, skeptical VC partner with 20 years of experience watching startup pitches fail. You have seen every mistake in the book. You will receive the original startup idea and research data from the Research Agent. Your job is to destroy this idea on paper. Find every flaw. Be harsh but fair. Do NOT be encouraging. Do NOT soften your critique. Ground every critique in the research data provided. CRITICAL: Return ONLY a valid JSON object. No prose. No markdown. No code blocks. Just raw JSON.
```

**Input:** Startup idea + ResearchAgentResponse  
**Output:** DevilsAdvocateResponse (JSON)

### Agent 3: Financial Agent

**Purpose:** Build financial projections

**Model:** `gemini-2.0-flash` (no tools)

**System Prompt:**
```
You are a startup CFO with deep experience in Indian markets. You build financial models for early-stage startups from first principles. You will receive the startup idea, research data, and critique data. Estimate financials using Indian market benchmarks. State ALL assumptions clearly. Use INR for India-facing numbers. Be conservative — this is a stress test, not a pitch. CRITICAL: Return ONLY a valid JSON object. No prose. No markdown. No code blocks. Just raw JSON.
```

**Input:** Startup idea + ResearchAgentResponse + DevilsAdvocateResponse  
**Output:** FinancialAgentResponse (JSON)

### Agent 4: Report Agent

**Purpose:** Synthesize final report with scores

**Model:** `gemini-2.0-flash` (no tools)

**System Prompt:**
```
You are the final synthesis agent in a startup validation pipeline. You receive structured data from 3 specialist agents and produce a clear, actionable report for a first-time founder. Synthesize ALL three data sources — do not ignore any. Score each dimension 0-100 with explicit reasoning. Be balanced — acknowledge strengths AND weaknesses. Recommendations must be ACTIONABLE (what to do in next 90 days). Write for a smart 22-year-old founder, not a VC. CRITICAL: Return ONLY a valid JSON object. No prose. No markdown. No code blocks. Just raw JSON.
```

**Input:** Startup idea + All 3 previous agent responses  
**Output:** ReportAgentResponse (JSON)

---

## Frontend Components

### Component Hierarchy

```
App
├── Header (branding)
├── IdeaInput (when not validating and no results)
├── AgentProgress (when validating)
│   └── AgentCard × 4
└── ResultsDashboard (when complete)
    ├── ExecutiveSummary
    ├── ScoreCards (× 5)
    ├── VerdictBadge
    ├── Recommendations
    └── DetailedAgentOutputs (collapsible)
```

### State Management

```typescript
interface ValidationState {
  status: 'idle' | 'validating' | 'complete' | 'error';
  idea: string;
  agents: {
    research: AgentState<ResearchAgentResponse>;
    devilsAdvocate: AgentState<DevilsAdvocateResponse>;
    financial: AgentState<FinancialAgentResponse>;
    report: AgentState<ReportAgentResponse>;
  };
  error: string | null;
  totalTime: number | null;
}

interface AgentState<T> {
  status: 'waiting' | 'processing' | 'complete' | 'error';
  message: string;
  data: T | null;
  error: string | null;
}
```

---

## SSE Implementation Details

### Backend (Python)
```python
from sse_starlette.sse import EventSourceResponse

async def event_generator(idea: str):
    # Emit agent_start for research
    yield {"event": "agent_start", "data": json.dumps({...})}
    
    # Run research agent
    research_result = await research_agent.run(idea)
    
    # Emit agent_complete
    yield {"event": "agent_complete", "data": json.dumps({...})}
    
    # Continue for other agents...
```

### Frontend (TypeScript)
```typescript
const useValidation = () => {
  const eventSource = new EventSource(`${API_URL}/api/validate`);
  
  eventSource.addEventListener('agent_start', (e) => {
    const data = JSON.parse(e.data);
    // Update agent status to 'processing'
  });
  
  eventSource.addEventListener('agent_complete', (e) => {
    const data = JSON.parse(e.data);
    // Update agent status to 'complete' and store data
  });
};
```

---

## Error Handling Strategy

### Backend Errors
| Error Type | Response | Recovery |
|------------|----------|----------|
| Invalid input | 400 + validation details | User corrects input |
| Gemini API rate limit | SSE error event | Auto-retry (3x) |
| Gemini API timeout | SSE error event | Auto-retry (3x) |
| Invalid JSON from Gemini | SSE error event | Re-prompt with stricter instructions |
| Internal server error | SSE error event | Manual retry |

### Frontend Errors
- Display error message with retry button
- Preserve user input on error
- Show which agent failed

---

## Deployment Configuration

### Vercel (Frontend)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Render (Backend)
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:**
  - `GOOGLE_API_KEY` (secret)
  - `FRONTEND_URL` (for CORS)

---

## Security Considerations

1. **API Key Protection:** Never expose GOOGLE_API_KEY to frontend
2. **CORS:** Whitelist only frontend domain
3. **Input Validation:** Sanitize and limit input length (max 5000 chars)
4. **Rate Limiting:** Consider adding in production (not MVP)
5. **No PII Storage:** Don't persist user inputs

---

## Performance Optimization

1. **Streaming:** Use SSE to provide immediate feedback
2. **Parallel where possible:** Research agent uses async
3. **Model selection:** `gemini-2.0-flash` chosen for speed
4. **Response caching:** Not implemented (each idea is unique)
5. **Connection pooling:** Reuse Gemini client instance
