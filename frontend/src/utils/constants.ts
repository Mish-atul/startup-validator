// ============ API Configuration ============

export const API_URL = import.meta.env.VITE_API_URL || '';

// ============ Agent Configuration ============

export const AGENTS = [
  {
    id: 'research',
    name: 'Research Agent',
    description: 'Analyzes market data and competitors',
    icon: 'Search',
  },
  {
    id: 'devils_advocate',
    name: "Devil's Advocate",
    description: 'Identifies weaknesses and risks',
    icon: 'AlertTriangle',
  },
  {
    id: 'financial',
    name: 'Financial Agent',
    description: 'Builds financial projections',
    icon: 'TrendingUp',
  },
  {
    id: 'report',
    name: 'Report Agent',
    description: 'Synthesizes final validation report',
    icon: 'FileText',
  },
] as const;

export type AgentId = typeof AGENTS[number]['id'];

// ============ Verdict Configuration ============

export const VERDICT_CONFIG = {
  GO: {
    color: 'text-verdict-go',
    bgColor: 'bg-verdict-go',
    borderColor: 'border-verdict-go',
    label: 'GO',
    description: 'Strong potential - proceed with confidence',
  },
  PIVOT: {
    color: 'text-verdict-pivot',
    bgColor: 'bg-verdict-pivot',
    borderColor: 'border-verdict-pivot',
    label: 'PIVOT',
    description: 'Potential exists but needs significant changes',
  },
  'NO-GO': {
    color: 'text-verdict-nogo',
    bgColor: 'bg-verdict-nogo',
    borderColor: 'border-verdict-nogo',
    label: 'NO-GO',
    description: 'Fundamental issues - reconsider the idea',
  },
} as const;

// ============ Score Configuration ============

export const SCORE_DIMENSIONS = [
  { key: 'market_opportunity', label: 'Market Opportunity' },
  { key: 'competitive_risk', label: 'Competitive Risk' },
  { key: 'financial_viability', label: 'Financial Viability' },
  { key: 'innovation', label: 'Innovation' },
  { key: 'overall_viability', label: 'Overall Viability' },
] as const;

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-verdict-go';
  if (score >= 40) return 'text-verdict-pivot';
  return 'text-verdict-nogo';
}

export function getScoreRingColor(score: number): string {
  if (score >= 70) return '#10B981';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}

// ============ Example Ideas ============

export const EXAMPLE_IDEAS = [
  "An AI-powered platform that helps Indian farmers predict crop diseases using smartphone photos and provides treatment recommendations in regional languages.",
  "A hyperlocal delivery service for fresh groceries in tier-2 Indian cities, connecting local farmers directly with urban consumers within 30 minutes.",
  "A B2B SaaS platform that automates GST compliance and invoice reconciliation for small businesses in India using AI.",
];
