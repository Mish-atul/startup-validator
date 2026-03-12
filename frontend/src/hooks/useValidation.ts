import { useState, useCallback, useRef } from 'react';
import { API_URL } from '../utils/constants';
import {
  ValidationState,
  AgentsState,
  AgentStartEvent,
  AgentCompleteEvent,
  PipelineCompleteEvent,
  ErrorEvent,
  ResearchAgentResponse,
  DevilsAdvocateResponse,
  FinancialAgentResponse,
  ReportAgentResponse,
} from '../types';

const initialAgentState = {
  status: 'waiting' as const,
  message: '',
  data: null,
  error: null,
};

const initialAgentsState: AgentsState = {
  research: initialAgentState,
  devils_advocate: initialAgentState,
  financial: initialAgentState,
  report: initialAgentState,
};

const initialState: ValidationState = {
  status: 'idle',
  idea: '',
  agents: initialAgentsState,
  error: null,
  totalTime: null,
};

export function useValidation() {
  const [state, setState] = useState<ValidationState>(initialState);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startValidation = useCallback(async (idea: string) => {
    // Reset state and start validation
    setState({
      status: 'validating',
      idea,
      agents: initialAgentsState,
      error: null,
      totalTime: null,
    });

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      // Create POST request for SSE
      const response = await fetch(`${API_URL}/api/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let currentEvent = '';
      let currentData = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete events in buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine === '') {
            // Empty line = end of SSE event, process if we have data
            if (currentEvent && currentData) {
              try {
                const data = JSON.parse(currentData);
                handleSSEEvent(currentEvent, data);
              } catch {
                console.error('Failed to parse SSE data:', currentData);
              }
            }
            currentEvent = '';
            currentData = '';
          } else if (trimmedLine.startsWith('event:')) {
            currentEvent = trimmedLine.slice(6).trim();
          } else if (trimmedLine.startsWith('data:')) {
            currentData = trimmedLine.slice(5).trim();
          }
          // Skip id:, retry:, or comment lines (starting with :)
        }
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  }, []);

  const handleSSEEvent = useCallback((eventType: string, data: unknown) => {
    switch (eventType) {
      case 'agent_start': {
        const event = data as AgentStartEvent;
        setState((prev) => ({
          ...prev,
          agents: {
            ...prev.agents,
            [event.agent]: {
              ...prev.agents[event.agent as keyof AgentsState],
              status: 'processing',
              message: event.message,
            },
          },
        }));
        break;
      }

      case 'agent_complete': {
        const event = data as AgentCompleteEvent;
        setState((prev) => ({
          ...prev,
          agents: {
            ...prev.agents,
            [event.agent]: {
              status: 'complete',
              message: 'Complete',
              data: event.data as 
                | ResearchAgentResponse 
                | DevilsAdvocateResponse 
                | FinancialAgentResponse 
                | ReportAgentResponse,
              error: null,
            },
          },
        }));
        break;
      }

      case 'pipeline_complete': {
        const event = data as PipelineCompleteEvent;
        setState((prev) => ({
          ...prev,
          status: 'complete',
          totalTime: event.total_time_seconds,
        }));
        break;
      }

      case 'error': {
        const event = data as ErrorEvent;
        if (event.agent) {
          const agentId = event.agent as keyof AgentsState;
          setState((prev) => ({
            ...prev,
            agents: {
              ...prev.agents,
              [agentId]: {
                ...prev.agents[agentId],
                status: 'error',
                error: event.error,
              },
            },
            status: 'error',
            error: event.error,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: event.error,
          }));
        }
        break;
      }
    }
  }, []);

  const reset = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setState(initialState);
  }, []);

  return {
    state,
    startValidation,
    reset,
    isValidating: state.status === 'validating',
    isComplete: state.status === 'complete',
    hasError: state.status === 'error',
  };
}
