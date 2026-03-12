import { Search, AlertTriangle, TrendingUp, FileText, Check, Loader2, Clock, AlertCircle, LucideIcon } from 'lucide-react';
import { AgentStatus } from '../types';

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  message: string;
  isActive: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  research: Search,
  devils_advocate: AlertTriangle,
  financial: TrendingUp,
  report: FileText,
};

const statusConfig = {
  waiting: {
    icon: Clock,
    color: 'text-slate-500',
    bgColor: 'bg-slate-800/30',
    borderColor: 'border-slate-700/30',
    label: 'Waiting',
  },
  processing: {
    icon: Loader2,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-900/20',
    borderColor: 'border-indigo-500/30',
    label: 'Processing',
  },
  complete: {
    icon: Check,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/20',
    borderColor: 'border-emerald-500/30',
    label: 'Complete',
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-500/30',
    label: 'Error',
  },
};

export function AgentCard({ id, name, description, status, message, isActive }: AgentCardProps) {
  const Icon = iconMap[id] || FileText;
  const StatusIcon = statusConfig[status].icon;
  const config = statusConfig[status];

  return (
    <div
      className={`
        relative p-5 rounded-xl border transition-all duration-300
        ${config.bgColor} ${config.borderColor}
        ${isActive ? 'ring-2 ring-indigo-500/50 scale-[1.02]' : ''}
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Agent Icon */}
        <div className={`p-3 rounded-lg ${status === 'processing' ? 'bg-indigo-500/20' : 'bg-slate-700/50'}`}>
          <Icon size={24} className={config.color} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-slate-200">{name}</h3>
            <div className={`flex items-center gap-1.5 text-sm ${config.color}`}>
              <StatusIcon size={14} className={status === 'processing' ? 'animate-spin' : ''} />
              <span>{config.label}</span>
            </div>
          </div>
          
          <p className="text-sm text-slate-400 mb-2">{description}</p>
          
          {/* Status message */}
          {message && status === 'processing' && (
            <p className="text-sm text-indigo-300 animate-pulse-slow">{message}</p>
          )}
          
          {status === 'complete' && (
            <p className="text-sm text-emerald-400">Analysis complete</p>
          )}
          
          {status === 'error' && (
            <p className="text-sm text-red-400">{message || 'An error occurred'}</p>
          )}
        </div>
      </div>

      {/* Progress bar for processing state */}
      {status === 'processing' && (
        <div className="mt-4 h-1 bg-slate-700/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse w-2/3" />
        </div>
      )}
    </div>
  );
}
