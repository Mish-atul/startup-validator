import { AgentCard } from './AgentCard';
import { AGENTS } from '../utils/constants';
import { AgentsState } from '../types';

interface AgentProgressProps {
  agents: AgentsState;
  idea: string;
}

export function AgentProgress({ agents, idea }: AgentProgressProps) {
  // Find the currently active (processing) agent
  const activeAgentId = Object.entries(agents).find(
    ([, state]) => state.status === 'processing'
  )?.[0];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Idea being validated */}
      <div className="mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
        <p className="text-sm text-slate-400 mb-1">Validating idea:</p>
        <p className="text-slate-200 line-clamp-2">{idea}</p>
      </div>

      {/* Agent Cards */}
      <div className="space-y-4">
        {AGENTS.map((agent) => {
          const agentState = agents[agent.id as keyof AgentsState];
          return (
            <AgentCard
              key={agent.id}
              id={agent.id}
              name={agent.name}
              description={agent.description}
              status={agentState.status}
              message={agentState.message}
              isActive={agent.id === activeAgentId}
            />
          );
        })}
      </div>

      {/* Time estimate */}
      <div className="mt-6 text-center text-sm text-slate-400">
        <p>Full analysis typically takes 30-60 seconds</p>
      </div>
    </div>
  );
}
