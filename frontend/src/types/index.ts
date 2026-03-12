// ============ Research Agent Types ============

export interface Competitor {
  name: string;
  funding: string;
  weakness: string;
}

export interface ResearchAgentResponse {
  market_overview: string;
  tam: string;
  sam: string;
  som: string;
  competitors: Competitor[];
  key_trends: string[];
  india_specific_risks: string[];
  sources: string[];
}

// ============ Devil's Advocate Types ============

export interface FatalFlaw {
  flaw: string;
  why_it_kills: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface WeakAssumption {
  assumption: string;
  reality: string;
}

export interface DevilsAdvocateResponse {
  fatal_flaws: FatalFlaw[];
  weak_assumptions: WeakAssumption[];
  hard_questions: string[];
  redeeming_qualities: string[];
}

// ============ Financial Agent Types ============

export interface Estimate {
  value: string;
  assumption: string;
}

export interface BurnEstimate {
  value: string;
  team_size_assumed: number;
}

export interface FinancialAgentResponse {
  revenue_model: string;
  cac_estimate: Estimate;
  ltv_estimate: Estimate;
  ltv_cac_ratio: string;
  monthly_burn: BurnEstimate;
  runway_needed_months: number;
  seed_funding_needed: string;
  break_even_timeline: string;
  unit_economics_verdict: 'VIABLE' | 'MARGINAL' | 'UNVIABLE';
  financial_risks: string[];
}

// ============ Report Agent Types ============

export interface ScoreDetail {
  score: number;
  reasoning: string;
}

export interface Recommendation {
  action: string;
  timeline: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Scores {
  market_opportunity: ScoreDetail;
  competitive_risk: ScoreDetail;
  financial_viability: ScoreDetail;
  innovation: ScoreDetail;
  overall_viability: ScoreDetail;
}

export interface ReportAgentResponse {
  startup_name_suggestion: string;
  executive_summary: string;
  scores: Scores;
  top_3_recommendations: Recommendation[];
  verdict: 'GO' | 'PIVOT' | 'NO-GO';
  verdict_reasoning: string;
}

// ============ Agent State Types ============

export type AgentStatus = 'waiting' | 'processing' | 'complete' | 'error';

export interface AgentState<T> {
  status: AgentStatus;
  message: string;
  data: T | null;
  error: string | null;
}

// ============ SSE Event Types ============

export interface AgentStartEvent {
  agent: string;
  message: string;
}

export interface AgentCompleteEvent {
  agent: string;
  data: unknown;
}

export interface PipelineCompleteEvent {
  message: string;
  total_time_seconds: number;
}

export interface ErrorEvent {
  agent: string | null;
  error: string;
  recoverable: boolean;
}

// ============ Validation State ============

export type ValidationStatus = 'idle' | 'validating' | 'complete' | 'error';

export interface AgentsState {
  research: AgentState<ResearchAgentResponse>;
  devils_advocate: AgentState<DevilsAdvocateResponse>;
  financial: AgentState<FinancialAgentResponse>;
  report: AgentState<ReportAgentResponse>;
}

export interface ValidationState {
  status: ValidationStatus;
  idea: string;
  agents: AgentsState;
  error: string | null;
  totalTime: number | null;
}
