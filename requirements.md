# Multi-Agent Startup Validator — Requirements

## Project Overview

**Project Name:** Multi-Agent Startup Validator  
**Hackathon:** AgentathonX 2026 (India's First Online Agentathon)  
**Deadline:** March 13, 2026  
**Version:** 1.0.0

### Vision Statement
Build an AI-powered startup validation platform where users input a startup idea in plain English and receive a comprehensive VC-style analysis report with scores in under 60 seconds, powered by 4 sequential AI agents.

---

## Functional Requirements

### FR-1: Startup Idea Input
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | System SHALL accept startup ideas as free-form text input | P0 |
| FR-1.2 | System SHALL validate minimum input length (50 characters) | P1 |
| FR-1.3 | System SHALL provide example prompts for first-time users | P2 |
| FR-1.4 | System SHALL allow users to reset and enter new ideas | P1 |

### FR-2: Research Agent
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Agent SHALL search the web for real market data using Gemini's grounding | P0 |
| FR-2.2 | Agent SHALL return structured JSON with: market_overview, tam, sam, som, competitors, key_trends, india_specific_risks, sources | P0 |
| FR-2.3 | Agent SHALL focus on Indian market context where applicable | P1 |
| FR-2.4 | Agent SHALL cite sources for all data points | P1 |

### FR-3: Devil's Advocate Agent
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Agent SHALL receive startup idea + Research JSON as input | P0 |
| FR-3.2 | Agent SHALL identify fatal flaws with severity ratings | P0 |
| FR-3.3 | Agent SHALL return structured JSON with: fatal_flaws, weak_assumptions, hard_questions, redeeming_qualities | P0 |
| FR-3.4 | Agent SHALL ground all critiques in research data | P1 |

### FR-4: Financial Agent
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Agent SHALL receive idea + Research JSON + Critique JSON | P0 |
| FR-4.2 | Agent SHALL build financial model using Indian market benchmarks | P0 |
| FR-4.3 | Agent SHALL return structured JSON with: revenue_model, cac_estimate, ltv_estimate, ltv_cac_ratio, monthly_burn, runway_needed_months, seed_funding_needed, break_even_timeline, unit_economics_verdict, financial_risks | P0 |
| FR-4.4 | Agent SHALL use INR for all monetary values | P1 |
| FR-4.5 | Agent SHALL state all assumptions explicitly | P1 |

### FR-5: Report Agent
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Agent SHALL synthesize all three agent outputs | P0 |
| FR-5.2 | Agent SHALL score 5 dimensions (0-100): market_opportunity, competitive_risk, financial_viability, innovation, overall_viability | P0 |
| FR-5.3 | Agent SHALL provide explicit reasoning for each score | P0 |
| FR-5.4 | Agent SHALL return verdict: GO, PIVOT, or NO-GO | P0 |
| FR-5.5 | Agent SHALL provide top 3 actionable recommendations with timelines | P0 |
| FR-5.6 | Agent SHALL suggest a startup name | P2 |

### FR-6: Real-time Streaming
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | System SHALL stream agent progress via Server-Sent Events (SSE) | P0 |
| FR-6.2 | System SHALL emit events: agent_start, agent_progress, agent_complete, pipeline_complete, error | P0 |
| FR-6.3 | Frontend SHALL display real-time progress for each agent | P0 |
| FR-6.4 | Frontend SHALL show which agent is currently processing | P1 |

### FR-7: Results Dashboard
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | Dashboard SHALL display executive summary | P0 |
| FR-7.2 | Dashboard SHALL visualize scores with progress indicators | P0 |
| FR-7.3 | Dashboard SHALL display verdict with color coding (GO=green, PIVOT=yellow, NO-GO=red) | P0 |
| FR-7.4 | Dashboard SHALL list recommendations with priorities | P0 |
| FR-7.5 | Dashboard SHALL allow expanding detailed agent outputs | P1 |

---

## Non-Functional Requirements

### NFR-1: Performance
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1.1 | End-to-end validation completion time | < 60 seconds |
| NFR-1.2 | Frontend initial load time | < 3 seconds |
| NFR-1.3 | SSE event latency | < 500ms |

### NFR-2: Reliability
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-2.1 | System availability | 99% uptime |
| NFR-2.2 | Graceful error handling for API failures | Required |
| NFR-2.3 | Retry logic for transient failures | 3 retries |

### NFR-3: Scalability
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-3.1 | Concurrent validations supported | 10 simultaneous |
| NFR-3.2 | Stateless backend design | Required |

### NFR-4: Security
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-4.1 | API key storage | Environment variables only |
| NFR-4.2 | CORS policy | Whitelist frontend origin |
| NFR-4.3 | Input sanitization | Required |

### NFR-5: Usability
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-5.1 | Mobile-responsive design | Required |
| NFR-5.2 | Accessibility (WCAG 2.1 AA) | Best effort |
| NFR-5.3 | Loading state indicators | Required |

---

## Technical Constraints

### Stack Requirements
| Component | Technology | Version |
|-----------|------------|---------|
| Frontend Framework | React | 18.x |
| Frontend Language | TypeScript | 5.x |
| Frontend Styling | TailwindCSS | 3.x |
| Frontend Build | Vite | 5.x |
| Backend Framework | FastAPI | 0.109+ |
| Backend Language | Python | 3.11+ |
| AI Provider | Google Gemini | gemini-2.0-flash |
| AI SDK | google-generativeai | Latest |
| Streaming | Server-Sent Events | Native |
| Frontend Hosting | Vercel | — |
| Backend Hosting | Render | — |

### External Dependencies
- Google Gemini API with grounding (Google Search) capability
- Valid GOOGLE_API_KEY with Gemini access

---

## Data Models

### Input
```typescript
interface ValidationRequest {
  idea: string; // min 50 characters
}
```

### Agent Outputs (see design.md for full schemas)
- `ResearchAgentResponse`
- `DevilsAdvocateResponse`
- `FinancialAgentResponse`
- `ReportAgentResponse`

### SSE Events
```typescript
type SSEEventType = 
  | 'agent_start' 
  | 'agent_progress' 
  | 'agent_complete' 
  | 'pipeline_complete' 
  | 'error';
```

---

## Success Criteria

1. **Functional**: All 4 agents execute sequentially and produce valid JSON
2. **Performance**: Complete validation in < 60 seconds
3. **UX**: Real-time progress visible to user
4. **Accuracy**: Scores are justified with explicit reasoning
5. **Deployable**: Working on Vercel (frontend) + Render (backend)

---

## Out of Scope (v1.0)

- User authentication/accounts
- Saving validation history
- PDF export of reports
- Rate limiting
- Multiple language support
- Comparison between multiple ideas
