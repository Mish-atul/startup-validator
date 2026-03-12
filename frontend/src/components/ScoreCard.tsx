import { getScoreRingColor } from '../utils/constants';

interface ScoreCardProps {
  label: string;
  score: number;
  reasoning: string;
}

export function ScoreCard({ label, score, reasoning }: ScoreCardProps) {
  const color = getScoreRingColor(score);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
      <div className="flex items-center gap-4">
        {/* Score Ring */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r="45"
              fill="none"
              stroke="#334155"
              strokeWidth="6"
              className="transform translate-x-[-5px] translate-y-[-5px]"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r="45"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transform translate-x-[-5px] translate-y-[-5px] score-ring"
            />
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{score}</span>
          </div>
        </div>

        {/* Label and reasoning */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-200 mb-1">{label}</h4>
          <p className="text-sm text-slate-400 line-clamp-3">{reasoning}</p>
        </div>
      </div>
    </div>
  );
}
