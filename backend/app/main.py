from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import get_settings
from .database import connect_to_mongo, close_mongo_connection
from .routers import health, profile, query
from .logging_config import LoggingMiddleware, logger
from .rate_limit import RateLimitMiddleware

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting Candidate Profile API...")
    await connect_to_mongo()
    logger.info("✅ Connected to MongoDB")
    yield
    # Shutdown
    logger.info("👋 Shutting down API...")
    await close_mongo_connection()
    logger.info("✅ MongoDB connection closed")


app = FastAPI(
    title=settings.app_name,
    description="API for managing and querying candidate profile data",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS - Allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware
app.add_middleware(RateLimitMiddleware)

# Add logging middleware (logs all requests)
app.add_middleware(LoggingMiddleware)

# Include routers
app.include_router(health.router)
app.include_router(profile.router)
app.include_router(query.router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Candidate Profile API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "features": {
            "auth": "Basic Auth required for POST/PUT/DELETE on /profile",
            "rate_limit": f"{settings.rate_limit_per_minute} requests/minute",
            "pagination": "Supported on /projects and /search"
        }
    }
