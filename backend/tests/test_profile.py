"""
Tests for profile CRUD endpoints.
"""
import pytest


@pytest.mark.asyncio
async def test_create_profile_requires_auth(client):
    """Test that creating a profile without auth returns 401."""
    response = await client.post("/profile", json={
        "name": "Test",
        "email": "test@test.com"
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_profile_with_auth(auth_client):
    """Test that creating a profile with auth works."""
    # First delete any existing profile
    await auth_client.delete("/profile")
    
    response = await auth_client.post("/profile", json={
        "name": "Test User",
        "email": "test@example.com",
        "skills": ["Python", "FastAPI"],
        "projects": [],
        "education": [],
        "work": [],
        "links": {}
    })
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"


@pytest.mark.asyncio
async def test_get_profile(client, seed_profile):
    """Test getting a profile."""
    response = await client.get("/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test User"
    assert "skills" in data
    assert "projects" in data


@pytest.mark.asyncio
async def test_update_profile_requires_auth(client, seed_profile):
    """Test that updating a profile without auth returns 401."""
    response = await client.put("/profile", json={
        "name": "Updated Name"
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_update_profile_with_auth(auth_client, seed_profile):
    """Test updating a profile with auth."""
    response = await auth_client.put("/profile", json={
        "name": "Updated User"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated User"


@pytest.mark.asyncio
async def test_delete_profile_requires_auth(client, seed_profile):
    """Test that deleting a profile without auth returns 401."""
    response = await client.delete("/profile")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_delete_profile_with_auth(auth_client, seed_profile):
    """Test deleting a profile with auth."""
    response = await auth_client.delete("/profile")
    assert response.status_code == 204
