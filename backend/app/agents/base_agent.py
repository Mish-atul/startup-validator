from abc import ABC, abstractmethod
import json
import re
from typing import Any, Dict
import google.generativeai as genai
from ..config import settings


class BaseAgent(ABC):
    """Base class for all AI agents in the pipeline."""
    
    def __init__(self):
        self.model_name = settings.GEMINI_MODEL
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Agent identifier name."""
        pass
    
    @property
    @abstractmethod
    def system_prompt(self) -> str:
        """System prompt for the agent."""
        pass
    
    def _extract_json(self, text: str) -> Dict[str, Any]:
        """Extract JSON from model response, handling markdown code blocks."""
        # Try to find JSON in code blocks first
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)```', text)
        if json_match:
            text = json_match.group(1).strip()
        
        # Clean up the text
        text = text.strip()
        
        # Try to parse as JSON
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Try to find JSON object in the text
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end > start:
                try:
                    return json.loads(text[start:end])
                except json.JSONDecodeError:
                    pass
            raise ValueError(f"Could not extract valid JSON from response: {text[:500]}")
    
    def _create_model(self, enable_search: bool = False):
        """Create a Gemini model instance."""
        # Configure API key each time to ensure it's set
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
        }
        
        # Create model (search grounding handled via prompt)
        model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config=generation_config
        )
        
        return model
    
    @abstractmethod
    async def run(self, *args, **kwargs) -> Dict[str, Any]:
        """Execute the agent's task. Must be implemented by subclasses."""
        pass
