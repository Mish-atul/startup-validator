import { Layers, Github } from 'lucide-react';
import { useValidation } from './hooks/useValidation';
import { IdeaInput } from './components/IdeaInput';
import { AgentProgress } from './components/AgentProgress';
import { ResultsDashboard } from './components/ResultsDashboard';

function App() {
  const { state, startValidation, reset, isValidating, isComplete, hasError } = useValidation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Layers size={24} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-100">Startup Validator</h1>
              <p className="text-xs text-slate-400">Multi-Agent AI Analysis</p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section - Only show when idle */}
        {state.status === 'idle' && (
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Validate Your Startup Idea</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Get a comprehensive VC-style analysis from 4 AI agents in under 60 seconds.
              Market research, risk analysis, financial projections, and actionable recommendations.
            </p>
          </div>
        )}

        {/* Conditional Content */}
        {state.status === 'idle' && (
          <IdeaInput onSubmit={startValidation} isLoading={false} />
        )}

        {isValidating && (
          <AgentProgress agents={state.agents} idea={state.idea} />
        )}

        {isComplete && (
          <ResultsDashboard 
            agents={state.agents} 
            totalTime={state.totalTime}
            onReset={reset}
          />
        )}

        {hasError && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold text-red-400 mb-2">Validation Failed</h3>
              <p className="text-slate-400 mb-4">{state.error || 'An unexpected error occurred'}</p>
              <button
                onClick={reset}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
          <p>Powered by Google Gemini</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
