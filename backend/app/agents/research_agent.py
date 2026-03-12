import asyncio
from typing import Dict, Any
from .base_agent import BaseAgent


class ResearchAgent(BaseAgent):
    """Agent 1: Research Agent - Uses web search to gather market data."""
    
    @property
    def name(self) -> str:
        return "research"
    
    @property
    def system_prompt(self) -> str:
        return """You are the Research Agent in a multi-agent startup validation system. Your ONLY job is to research the market for the startup idea provided. Use Google Search to find real, current market data. Search for: market size, top competitors, funding rounds, trends. Focus on the Indian market context wherever applicable. Be specific with numbers. Cite your sources. Do NOT provide opinions or recommendations — facts only.

CRITICAL: Return ONLY a valid JSON object with this exact structure:
{
    "market_overview": "string - comprehensive market overview",
    "tam": "string - Total Addressable Market with numbers",
    "sam": "string - Serviceable Addressable Market with numbers",
    "som": "string - Serviceable Obtainable Market with numbers",
    "competitors": [
        {"name": "string", "funding": "string", "weakness": "string"}
    ],
    "key_trends": ["string"],
    "india_specific_risks": ["string"],
    "sources": ["string - URLs or source names"]
}

No prose. No markdown. No code blocks. Just raw JSON."""

    async def run(self, idea: str) -> Dict[str, Any]:
        """Execute market research for the given startup idea."""
        model = self._create_model()
        
        prompt = f"""Research the market for this startup idea:

{idea}

Provide thorough market research including:
1. Market size (TAM, SAM, SOM) with realistic numbers
2. Top 3-5 competitors with their funding and weaknesses
3. Key market trends
4. India-specific risks and considerations
5. Cite plausible sources

Return ONLY valid JSON."""

        # Run synchronously in thread pool since genai is not fully async
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: model.generate_content(self.system_prompt + "\n\n" + prompt)
        )
        
        return self._extract_json(response.text)
