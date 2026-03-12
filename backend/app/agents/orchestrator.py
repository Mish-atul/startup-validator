import json
import time
import traceback
from typing import AsyncGenerator, Dict, Any
from .research_agent import ResearchAgent
from .devils_advocate_agent import DevilsAdvocateAgent
from .financial_agent import FinancialAgent
from .report_agent import ReportAgent


class AgentOrchestrator:
    """Orchestrates the sequential execution of all 4 agents with SSE streaming."""
    
    def __init__(self):
        self.research_agent = ResearchAgent()
        self.devils_advocate_agent = DevilsAdvocateAgent()
        self.financial_agent = FinancialAgent()
        self.report_agent = ReportAgent()
    
    def _sse_event(self, event_type: str, data: Dict[str, Any]) -> dict:
        """Create an SSE event dict for EventSourceResponse to serialize."""
        return {"event": event_type, "data": json.dumps(data)}
    
    async def run_pipeline(self, idea: str) -> AsyncGenerator[dict, None]:
        """
        Run the full 4-agent pipeline and yield SSE events.
        
        Events emitted:
        - agent_start: When an agent begins processing
        - agent_complete: When an agent finishes with its data
        - pipeline_complete: When all agents have finished
        - error: When an error occurs
        """
        start_time = time.time()
        
        research_data = None
        critique_data = None
        financial_data = None
        report_data = None
        
        try:
            # ============ Agent 1: Research ============
            yield self._sse_event("agent_start", {
                "agent": "research",
                "message": "Starting market research with web search..."
            })
            
            try:
                research_data = await self.research_agent.run(idea)
                yield self._sse_event("agent_complete", {
                    "agent": "research",
                    "data": research_data
                })
            except Exception as e:
                yield self._sse_event("error", {
                    "agent": "research",
                    "error": f"Research agent failed: {str(e)}",
                    "recoverable": False
                })
                traceback.print_exc()
                return
            
            # ============ Agent 2: Devil's Advocate ============
            yield self._sse_event("agent_start", {
                "agent": "devils_advocate",
                "message": "Analyzing weaknesses and risks..."
            })
            
            try:
                critique_data = await self.devils_advocate_agent.run(idea, research_data)
                yield self._sse_event("agent_complete", {
                    "agent": "devils_advocate",
                    "data": critique_data
                })
            except Exception as e:
                yield self._sse_event("error", {
                    "agent": "devils_advocate",
                    "error": f"Devil's advocate agent failed: {str(e)}",
                    "recoverable": False
                })
                traceback.print_exc()
                return
            
            # ============ Agent 3: Financial ============
            yield self._sse_event("agent_start", {
                "agent": "financial",
                "message": "Building financial model..."
            })
            
            try:
                financial_data = await self.financial_agent.run(idea, research_data, critique_data)
                yield self._sse_event("agent_complete", {
                    "agent": "financial",
                    "data": financial_data
                })
            except Exception as e:
                yield self._sse_event("error", {
                    "agent": "financial",
                    "error": f"Financial agent failed: {str(e)}",
                    "recoverable": False
                })
                traceback.print_exc()
                return
            
            # ============ Agent 4: Report ============
            yield self._sse_event("agent_start", {
                "agent": "report",
                "message": "Generating final report..."
            })
            
            try:
                report_data = await self.report_agent.run(
                    idea, research_data, critique_data, financial_data
                )
                yield self._sse_event("agent_complete", {
                    "agent": "report",
                    "data": report_data
                })
            except Exception as e:
                yield self._sse_event("error", {
                    "agent": "report",
                    "error": f"Report agent failed: {str(e)}",
                    "recoverable": False
                })
                traceback.print_exc()
                return
            
            # ============ Pipeline Complete ============
            total_time = time.time() - start_time
            yield self._sse_event("pipeline_complete", {
                "message": "Validation complete",
                "total_time_seconds": round(total_time, 2)
            })
            
        except Exception as e:
            yield self._sse_event("error", {
                "agent": None,
                "error": f"Pipeline failed: {str(e)}",
                "recoverable": False
            })
            traceback.print_exc()
