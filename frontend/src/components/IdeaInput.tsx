import React, { useState } from 'react';
import { Send, Lightbulb } from 'lucide-react';
import { EXAMPLE_IDEAS } from '../utils/constants';

interface IdeaInputProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

export function IdeaInput({ onSubmit, isLoading }: IdeaInputProps) {
  const [idea, setIdea] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (idea.trim().length < 50) {
      setError('Please provide more detail about your startup idea (minimum 50 characters)');
      return;
    }
    
    setError('');
    onSubmit(idea.trim());
  };

  const handleExampleClick = (example: string) => {
    setIdea(example);
    setError('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 card-glow border border-slate-700/50">
        <form onSubmit={handleSubmit}>
          <label htmlFor="idea" className="block text-lg font-semibold mb-3 text-slate-200">
            Describe your startup idea
          </label>
          
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
              if (error) setError('');
            }}
            placeholder="E.g., An AI-powered platform that helps Indian farmers predict crop diseases using smartphone photos..."
            className="w-full h-40 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                       text-slate-100 placeholder-slate-500 resize-none
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       transition-all duration-200"
            disabled={isLoading}
          />
          
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className={`${idea.length < 50 ? 'text-slate-500' : 'text-slate-400'}`}>
              {idea.length} / 50 minimum characters
            </span>
            {error && <span className="text-red-400">{error}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading || idea.trim().length < 50}
            className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 
                       hover:from-indigo-500 hover:to-purple-500
                       disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed
                       text-white font-semibold rounded-xl
                       flex items-center justify-center gap-3
                       transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Send size={20} />
                Validate My Startup Idea
              </>
            )}
          </button>
        </form>

        {/* Example Ideas */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
            <Lightbulb size={16} />
            <span>Try an example idea:</span>
          </div>
          <div className="space-y-2">
            {EXAMPLE_IDEAS.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
                className="w-full text-left px-4 py-3 text-sm text-slate-400 hover:text-slate-200
                           bg-slate-900/30 hover:bg-slate-900/50 rounded-lg
                           border border-slate-700/30 hover:border-slate-600/50
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {example.length > 120 ? example.slice(0, 120) + '...' : example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
