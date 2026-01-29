"""
Tests for query endpoints (projects, skills, search).
"""
import pytest


@pytest.mark.asyncio
async def test_get_projects(client, seed_profile):
    """Test getting all projects."""
    response = await client.get("/projects")
    assert response.status_code == 200
    data = response.json()
    assert "projects" in data
    assert "count" in data
    assert "total" in data
    assert "page" in data


@pytest.mark.asyncio
async def test_get_projects_with_skill_filter(client, seed_profile):
    """Test filtering projects by skill."""
    response = await client.get("/projects?skill=python")
    assert response.status_code == 200
    data = response.json()
    assert "projects" in data
    # All returned projects should have Python skill
    for project in data["projects"]:
        skills_lower = [s.lower() for s in project.get("skills", [])]
        assert any("python" in s for s in skills_lower)


@pytest.mark.asyncio
async def test_get_projects_with_pagination(client, seed_profile):
    """Test projects endpoint pagination."""
    response = await client.get("/projects?page=1&page_size=5")
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert data["page_size"] == 5
    assert "has_next" in data
    assert "has_prev" in data
    assert "total_pages" in data


@pytest.mark.asyncio
async def test_get_skills(client, seed_profile):
    """Test getting all skills."""
    response = await client.get("/skills")
    assert response.status_code == 200
    data = response.json()
    assert "skills" in data
    assert "count" in data
    assert len(data["skills"]) > 0


@pytest.mark.asyncio
async def test_get_top_skills(client, seed_profile):
    """Test getting top skills."""
    response = await client.get("/skills/top?limit=3")
    assert response.status_code == 200
    data = response.json()
    assert "top_skills" in data
    assert len(data["top_skills"]) <= 3
    # Each skill should have a count
    for skill in data["top_skills"]:
        assert "skill" in skill
        assert "count" in skill


@pytest.mark.asyncio
async def test_search(client, seed_profile):
    """Test search endpoint."""
    response = await client.get("/search?q=python")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "python"
    assert "matches" in data
    assert "skills" in data["matches"]
    assert "projects" in data["matches"]


@pytest.mark.asyncio
async def test_search_pagination(client, seed_profile):
    """Test search endpoint pagination."""
    response = await client.get("/search?q=test&page=1&page_size=5")
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert data["page_size"] == 5


@pytest.mark.asyncio
async def test_search_no_results(client, seed_profile):
    """Test search with no matching results."""
    response = await client.get("/search?q=xyz123nonexistent")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "xyz123nonexistent"
    assert len(data["matches"]["skills"]) == 0
    assert len(data["matches"]["projects"]) == 0
