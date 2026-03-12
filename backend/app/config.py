import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend directory
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Gemini Model Configuration
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    # Validation
    MIN_IDEA_LENGTH: int = 50
    MAX_IDEA_LENGTH: int = 5000

settings = Settings()
