"""
Pytest configuration and fixtures for testing.
"""
import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from motor.motor_asyncio import AsyncIOMotorClient
import os

# Set test environment
os.environ["MONGODB_URL"] = "mongodb://localhost:27017"
os.environ["DATABASE_NAME"] = "candidate_profile_test"
os.environ["ADMIN_USERNAME"] = "admin"
os.environ["ADMIN_PASSWORD"] = "secret123"

from app.main import app
from app.database import connect_to_mongo, close_mongo_connection, get_database


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def setup_database():
    """Setup test database connection."""
    await connect_to_mongo()
    yield
    # Cleanup: drop test database
    db = get_database()
    await db.client.drop_database("candidate_profile_test")
    await close_mongo_connection()


@pytest.fixture
async def client(setup_database):
    """HTTP client for testing API endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def auth_client(setup_database):
    """HTTP client with Basic Auth for testing protected endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(
        transport=transport, 
        base_url="http://test",
        auth=("admin", "secret123")
    ) as ac:
        yield ac


@pytest.fixture
async def seed_profile(auth_client):
    """Seed the database with a test profile."""
    profile_data = {
        "name": "Test User",
        "email": "test@example.com",
        "education": [
            {"degree": "B.Tech", "institution": "Test University", "year": "2024"}
        ],
        "skills": ["Python", "FastAPI", "MongoDB"],
        "projects": [
            {
                "title": "Test Project",
                "description": "A test project",
                "links": ["https://github.com/test"],
                "skills": ["Python", "FastAPI"]
            }
        ],
        "work": [
            {
                "title": "Developer",
                "company": "Test Corp",
                "duration": "2023-2024",
                "description": "Testing"
            }
        ],
        "links": {
            "github": "https://github.com/test",
            "linkedin": "https://linkedin.com/in/test"
        }
    }
    
    # Delete existing profile first
    await auth_client.delete("/profile")
    
    # Create new profile
    response = await auth_client.post("/profile", json=profile_data)
    return response.json()
