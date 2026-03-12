from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routes.validate import router as validate_router


app = FastAPI(
    title="Multi-Agent Startup Validator",
    description="AI-powered startup validation using 4 sequential agents (Gemini)",
    version="1.0.0"
)

# CORS configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "https://*.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(validate_router)


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Multi-Agent Startup Validator API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
