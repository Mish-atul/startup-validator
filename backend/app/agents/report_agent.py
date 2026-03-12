import asyncio
from typing import Dict, Any
from .base_agent import BaseAgent


class ReportAgent(BaseAgent):
    """Agent 4: Report Agent - Synthesizes all data into final report."""
    
    @property
    def name(self) -> str:
        return "report"
    
    @property
    def system_prompt(self) -> str:
        return """You are the final synthesis agent in a startup validation pipeline. You receive structured data from 3 specialist agents and produce a clear, actionable report for a first-time founder. Synthesize ALL three data sources — do not ignore any. Score each dimension 0-100 with explicit reasoning. Be balanced — acknowledge strengths AND weaknesses. Recommendations must be ACTIONABLE (what to do in next 90 days). Write for a smart 22-year-old founder, not a VC.

CRITICAL: Return ONLY a valid JSON object with this exact structure:
{
    "startup_name_suggestion": "string - creative name for the startup",
    "executive_summary": "string - 3-4 sentences summarizing the validation",
    "scores": {
        "market_opportunity": {"score": number 0-100, "reasoning": "string"},
        "competitive_risk": {"score": number 0-100, "reasoning": "string"},
        "financial_viability": {"score": number 0-100, "reasoning": "string"},
        "innovation": {"score": number 0-100, "reasoning": "string"},
        "overall_viability": {"score": number 0-100, "reasoning": "string"}
    },
    "top_3_recommendations": [
        {"action": "string", "timeline": "string", "priority": "HIGH|MEDIUM|LOW"}
    ],
    "verdict": "GO|PIVOT|NO-GO",
    "verdict_reasoning": "string - why this verdict"
}

No prose. No markdown. No code blocks. Just raw JSON."""

    async def run(
        self,
        idea: str,
        research_data: Dict[str, Any],
        critique_data: Dict[str, Any],
        financial_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Synthesize all agent outputs into a final report."""
        model = self._create_model()
        
        prompt = f"""STARTUP IDEA:
{idea}

RESEARCH AGENT DATA:
{research_data}

DEVIL'S ADVOCATE CRITIQUE:
{critique_data}

FINANCIAL ANALYSIS:
{financial_data}

Synthesize all of this into a final validation report:

1. Suggest a creative startup name
2. Write an executive summary (3-4 sentences)
3. Score each dimension 0-100 with explicit reasoning:
   - Market Opportunity (based on TAM/SAM/SOM and trends)
   - Competitive Risk (inverted - higher score = less risk)
   - Financial Viability (based on unit economics)
   - Innovation (how novel/differentiated is this?)
   - Overall Viability (weighted average + judgment)
4. Provide top 3 actionable recommendations for next 90 days
5. Give final verdict: GO, PIVOT, or NO-GO
6. Explain your verdict reasoning

Be balanced. Be actionable. Write for a founder, not a VC.

Return ONLY valid JSON."""

        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: model.generate_content(self.system_prompt + "\n\n" + prompt)
        )
        
        return self._extract_json(response.text)
