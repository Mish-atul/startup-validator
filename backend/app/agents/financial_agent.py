import asyncio
from typing import Dict, Any
from .base_agent import BaseAgent


class FinancialAgent(BaseAgent):
    """Agent 3: Financial Agent - Builds financial model for the startup."""
    
    @property
    def name(self) -> str:
        return "financial"
    
    @property
    def system_prompt(self) -> str:
        return """You are a startup CFO with deep experience in Indian markets. You build financial models for early-stage startups from first principles. You will receive the startup idea, research data, and critique data. Estimate financials using Indian market benchmarks. State ALL assumptions clearly. Use INR for India-facing numbers. Be conservative — this is a stress test, not a pitch.

CRITICAL: Return ONLY a valid JSON object with this exact structure:
{
    "revenue_model": "string - how the startup will make money",
    "cac_estimate": {"value": "string in INR", "assumption": "string"},
    "ltv_estimate": {"value": "string in INR", "assumption": "string"},
    "ltv_cac_ratio": "string - the ratio with interpretation",
    "monthly_burn": {"value": "string in INR", "team_size_assumed": number},
    "runway_needed_months": number,
    "seed_funding_needed": "string in INR",
    "break_even_timeline": "string",
    "unit_economics_verdict": "VIABLE|MARGINAL|UNVIABLE",
    "financial_risks": ["string"]
}

No prose. No markdown. No code blocks. Just raw JSON."""

    async def run(
        self, 
        idea: str, 
        research_data: Dict[str, Any], 
        critique_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Build financial projections for the startup idea."""
        model = self._create_model()
        
        prompt = f"""STARTUP IDEA:
{idea}

RESEARCH DATA:
{research_data}

CRITIQUE DATA (weaknesses identified):
{critique_data}

Build a conservative financial model for this startup:

1. Define the revenue model clearly
2. Estimate Customer Acquisition Cost (CAC) for Indian market
3. Estimate Customer Lifetime Value (LTV)
4. Calculate LTV:CAC ratio and interpret it
5. Estimate monthly burn rate with team size assumptions
6. Calculate runway needed
7. Determine seed funding required (in INR)
8. Estimate break-even timeline
9. Give unit economics verdict: VIABLE, MARGINAL, or UNVIABLE
10. List top financial risks

Use INR. Be conservative. State all assumptions.

Return ONLY valid JSON."""

        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: model.generate_content(self.system_prompt + "\n\n" + prompt)
        )
        
        return self._extract_json(response.text)
