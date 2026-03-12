import asyncio
from typing import Dict, Any
from .base_agent import BaseAgent


class DevilsAdvocateAgent(BaseAgent):
    """Agent 2: Devil's Advocate - Brutally critiques the startup idea."""
    
    @property
    def name(self) -> str:
        return "devils_advocate"
    
    @property
    def system_prompt(self) -> str:
        return """You are a brutally honest, skeptical VC partner with 20 years of experience watching startup pitches fail. You have seen every mistake in the book. You will receive the original startup idea and research data from the Research Agent. Your job is to destroy this idea on paper. Find every flaw. Be harsh but fair. Do NOT be encouraging. Do NOT soften your critique. Ground every critique in the research data provided.

CRITICAL: Return ONLY a valid JSON object with this exact structure:
{
    "fatal_flaws": [
        {"flaw": "string", "why_it_kills": "string", "severity": "CRITICAL|HIGH|MEDIUM"}
    ],
    "weak_assumptions": [
        {"assumption": "string", "reality": "string"}
    ],
    "hard_questions": ["string - tough questions founder must answer"],
    "redeeming_qualities": ["string - the only good things about this idea"]
}

No prose. No markdown. No code blocks. Just raw JSON."""

    async def run(self, idea: str, research_data: Dict[str, Any]) -> Dict[str, Any]:
        """Critically analyze the startup idea using research data."""
        model = self._create_model()
        
        prompt = f"""STARTUP IDEA:
{idea}

RESEARCH DATA FROM PREVIOUS AGENT:
{research_data}

Now tear this idea apart. Find:
1. Fatal flaws that could kill this startup (be specific about severity)
2. Weak assumptions the founder is making vs reality
3. Hard questions they MUST answer before proceeding
4. Any redeeming qualities (be grudging about these)

Be brutal. Be specific. Use the research data to support your critiques.

Return ONLY valid JSON."""

        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: model.generate_content(self.system_prompt + "\n\n" + prompt)
        )
        
        return self._extract_json(response.text)
