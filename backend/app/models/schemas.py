from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from enum import Enum


# ============ Request Models ============

class ValidationRequest(BaseModel):
    idea: str = Field(
        ..., 
        min_length=50, 
        max_length=5000,
        description="Startup idea description"
    )


# ============ Research Agent Models ============

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


# ============ Devil's Advocate Agent Models ============

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


# ============ Financial Agent Models ============

class Estimate(BaseModel):
    value: str
    assumption: str


class BurnEstimate(BaseModel):
    value: str
    team_size_assumed: int


class UnitEconomicsVerdict(str, Enum):
    VIABLE = "VIABLE"
    MARGINAL = "MARGINAL"
    UNVIABLE = "UNVIABLE"


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


# ============ Report Agent Models ============

class ScoreDetail(BaseModel):
    score: int = Field(..., ge=0, le=100)
    reasoning: str


class Priority(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class Recommendation(BaseModel):
    action: str
    timeline: str
    priority: str  # "HIGH" | "MEDIUM" | "LOW"


class Verdict(str, Enum):
    GO = "GO"
    PIVOT = "PIVOT"
    NO_GO = "NO-GO"


class Scores(BaseModel):
    market_opportunity: ScoreDetail
    competitive_risk: ScoreDetail
    financial_viability: ScoreDetail
    innovation: ScoreDetail
    overall_viability: ScoreDetail


class ReportAgentResponse(BaseModel):
    startup_name_suggestion: str
    executive_summary: str
    scores: Scores
    top_3_recommendations: List[Recommendation]
    verdict: str  # "GO" | "PIVOT" | "NO-GO"
    verdict_reasoning: str


# ============ SSE Event Models ============

class AgentStartEvent(BaseModel):
    agent: str
    message: str


class AgentCompleteEvent(BaseModel):
    agent: str
    data: dict


class AgentProgressEvent(BaseModel):
    agent: str
    message: str


class PipelineCompleteEvent(BaseModel):
    message: str
    total_time_seconds: float


class ErrorEvent(BaseModel):
    agent: Optional[str]
    error: str
    recoverable: bool = False


# ============ Full Pipeline Response ============

class FullValidationResponse(BaseModel):
    research: ResearchAgentResponse
    devils_advocate: DevilsAdvocateResponse
    financial: FinancialAgentResponse
    report: ReportAgentResponse
    total_time_seconds: float
