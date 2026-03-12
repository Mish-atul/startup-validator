import { useState } from 'react';
import { 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Target,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  LucideIcon
} from 'lucide-react';
import { ScoreCard } from './ScoreCard';
import { VerdictBadge } from './VerdictBadge';
import { SCORE_DIMENSIONS } from '../utils/constants';
import { 
  ReportAgentResponse, 
  ResearchAgentResponse, 
  DevilsAdvocateResponse, 
  FinancialAgentResponse,
  AgentsState 
} from '../types';

interface ResultsDashboardProps {
  agents: AgentsState;
  totalTime: number | null;
  onReset: () => void;
}

export function ResultsDashboard({ agents, totalTime, onReset }: ResultsDashboardProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const report = agents.report.data as ReportAgentResponse;
  const research = agents.research.data as ResearchAgentResponse;
  const critique = agents.devils_advocate.data as DevilsAdvocateResponse;
  const financial = agents.financial.data as FinancialAgentResponse;

  if (!report) {
    return <div className="text-center text-slate-400">No report data available</div>;
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionHeader = ({ id, title, icon: Icon }: { id: string; title: string; icon: LucideIcon }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800/70 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-indigo-400" />
        <span className="font-semibold text-slate-200">{title}</span>
      </div>
      {expandedSections[id] ? (
        <ChevronUp size={20} className="text-slate-400" />
      ) : (
        <ChevronDown size={20} className="text-slate-400" />
      )}
    </button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header with startup name and time */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm mb-4">
          <Sparkles size={16} />
          <span>Validation Complete</span>
          {totalTime && (
            <>
              <span className="text-slate-500">•</span>
              <Clock size={14} />
              <span>{totalTime.toFixed(1)}s</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">{report.startup_name_suggestion}</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">{report.executive_summary}</p>
      </div>

      {/* Verdict */}
      <VerdictBadge verdict={report.verdict} reasoning={report.verdict_reasoning} />

      {/* Scores Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
          <Target size={20} className="text-indigo-400" />
          Validation Scores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCORE_DIMENSIONS.map((dimension) => {
            const scoreData = report.scores[dimension.key as keyof typeof report.scores];
            return (
              <ScoreCard
                key={dimension.key}
                label={dimension.label}
                score={scoreData.score}
                reasoning={scoreData.reasoning}
              />
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-emerald-400" />
          Top Recommendations (Next 90 Days)
        </h2>
        <div className="space-y-4">
          {report.top_3_recommendations.map((rec, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/30"
            >
              <div className={`
                px-2 py-1 rounded text-xs font-semibold
                ${rec.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : ''}
                ${rec.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                ${rec.priority === 'LOW' ? 'bg-green-500/20 text-green-400' : ''}
              `}>
                {rec.priority}
              </div>
              <div className="flex-1">
                <p className="text-slate-200 font-medium">{rec.action}</p>
                <p className="text-sm text-slate-400 mt-1">Timeline: {rec.timeline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">Detailed Analysis</h2>

        {/* Market Research */}
        {research && (
          <div className="space-y-3">
            <SectionHeader id="research" title="Market Research" icon={TrendingUp} />
            {expandedSections.research && (
              <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/30 space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">Market Overview</h4>
                  <p className="text-slate-400">{research.market_overview}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">TAM</p>
                    <p className="text-slate-200 font-semibold">{research.tam}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">SAM</p>
                    <p className="text-slate-200 font-semibold">{research.sam}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">SOM</p>
                    <p className="text-slate-200 font-semibold">{research.som}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">Competitors</h4>
                  <div className="space-y-2">
                    {research.competitors.map((comp, i) => (
                      <div key={i} className="bg-slate-800/50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-slate-200">{comp.name}</span>
                          <span className="text-sm text-indigo-400">{comp.funding}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">Weakness: {comp.weakness}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">Key Trends</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {research.key_trends.map((trend, i) => (
                      <li key={i}>{trend}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">India-Specific Risks</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {research.india_specific_risks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
                {research.sources.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-300 mb-2">Sources</h4>
                    <div className="flex flex-wrap gap-2">
                      {research.sources.map((source, i) => (
                        <a
                          key={i}
                          href={source.startsWith('http') ? source : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800/50 rounded-full text-sm text-indigo-400 hover:bg-slate-700/50"
                        >
                          {source.length > 40 ? source.slice(0, 40) + '...' : source}
                          <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Devil's Advocate */}
        {critique && (
          <div className="space-y-3">
            <SectionHeader id="critique" title="Critical Analysis" icon={AlertTriangle} />
            {expandedSections.critique && (
              <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/30 space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">Fatal Flaws</h4>
                  <div className="space-y-3">
                    {critique.fatal_flaws.map((flaw, i) => (
                      <div key={i} className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle size={16} className="text-red-400" />
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            flaw.severity === 'CRITICAL' ? 'bg-red-500/30 text-red-300' :
                            flaw.severity === 'HIGH' ? 'bg-orange-500/30 text-orange-300' :
                            'bg-yellow-500/30 text-yellow-300'
                          }`}>
                            {flaw.severity}
                          </span>
                        </div>
                        <p className="font-medium text-slate-200">{flaw.flaw}</p>
                        <p className="text-sm text-slate-400 mt-1">{flaw.why_it_kills}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">Weak Assumptions</h4>
                  <div className="space-y-2">
                    {critique.weak_assumptions.map((item, i) => (
                      <div key={i} className="bg-slate-800/50 p-3 rounded-lg">
                        <p className="text-slate-200"><strong>Assumption:</strong> {item.assumption}</p>
                        <p className="text-slate-400 mt-1"><strong>Reality:</strong> {item.reality}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">Hard Questions</h4>
                  <ul className="list-decimal list-inside space-y-2 text-slate-400">
                    {critique.hard_questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-2">Redeeming Qualities</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {critique.redeeming_qualities.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Financial Analysis */}
        {financial && (
          <div className="space-y-3">
            <SectionHeader id="financial" title="Financial Analysis" icon={DollarSign} />
            {expandedSections.financial && (
              <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/30 space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">Revenue Model</h4>
                  <p className="text-slate-400">{financial.revenue_model}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">CAC</p>
                    <p className="text-slate-200 font-semibold">{financial.cac_estimate.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{financial.cac_estimate.assumption}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">LTV</p>
                    <p className="text-slate-200 font-semibold">{financial.ltv_estimate.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{financial.ltv_estimate.assumption}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">LTV:CAC Ratio</p>
                    <p className="text-slate-200 font-semibold">{financial.ltv_cac_ratio}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">Monthly Burn</p>
                    <p className="text-slate-200 font-semibold">{financial.monthly_burn.value}</p>
                    <p className="text-xs text-slate-500 mt-1">Team: {financial.monthly_burn.team_size_assumed}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">Runway Needed</p>
                    <p className="text-slate-200 font-semibold">{financial.runway_needed_months} months</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">Seed Funding</p>
                    <p className="text-slate-200 font-semibold">{financial.seed_funding_needed}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase">Break-Even</p>
                    <p className="text-slate-200 font-semibold">{financial.break_even_timeline}</p>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${
                  financial.unit_economics_verdict === 'VIABLE' ? 'bg-emerald-900/20 border border-emerald-500/30' :
                  financial.unit_economics_verdict === 'MARGINAL' ? 'bg-yellow-900/20 border border-yellow-500/30' :
                  'bg-red-900/20 border border-red-500/30'
                }`}>
                  <p className="text-xs text-slate-400 uppercase">Unit Economics Verdict</p>
                  <p className={`text-xl font-bold ${
                    financial.unit_economics_verdict === 'VIABLE' ? 'text-emerald-400' :
                    financial.unit_economics_verdict === 'MARGINAL' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {financial.unit_economics_verdict}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2">Financial Risks</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {financial.financial_risks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-semibold transition-colors"
        >
          Validate Another Idea
        </button>
      </div>
    </div>
  );
}
