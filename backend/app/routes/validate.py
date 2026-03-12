from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse
from ..models.schemas import ValidationRequest
from ..agents.orchestrator import AgentOrchestrator


router = APIRouter(prefix="/api", tags=["validation"])

# Single orchestrator instance (stateless, can be reused)
orchestrator = AgentOrchestrator()


@router.post("/validate")
async def validate_startup_idea(request: ValidationRequest):
    """
    Validate a startup idea using the 4-agent pipeline.
    
    Returns a Server-Sent Events stream with real-time updates from each agent.
    
    Event types:
    - agent_start: Agent beginning processing
    - agent_complete: Agent finished with data
    - pipeline_complete: All agents finished
    - error: Error occurred
    """
    try:
        return EventSourceResponse(
            orchestrator.run_pipeline(request.idea),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "multi-agent-startup-validator"
    }
