import { VERDICT_CONFIG } from '../utils/constants';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: 'GO' | 'PIVOT' | 'NO-GO';
  reasoning: string;
}

const verdictIcons = {
  GO: CheckCircle2,
  PIVOT: AlertTriangle,
  'NO-GO': XCircle,
};

export function VerdictBadge({ verdict, reasoning }: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];
  const Icon = verdictIcons[verdict];

  return (
    <div className={`rounded-2xl p-6 border-2 ${config.borderColor} bg-slate-800/50`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-full ${config.bgColor}`}>
          <Icon size={32} className={config.color} />
        </div>
        <div>
          <p className="text-sm text-slate-400 uppercase tracking-wide">Final Verdict</p>
          <h2 className={`text-3xl font-bold ${config.color}`}>{config.label}</h2>
        </div>
      </div>
      <p className="text-slate-300">{config.description}</p>
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-sm text-slate-400">{reasoning}</p>
      </div>
    </div>
  );
}
