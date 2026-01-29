from fastapi import APIRouter, Query
from typing import Optional
from ..database import get_database
from ..config import get_settings
from collections import Counter

router = APIRouter(tags=["query"])
settings = get_settings()


@router.get("/projects")
async def get_projects(
    skill: Optional[str] = Query(None, description="Filter projects by skill"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(None, ge=1, le=100, description="Items per page")
):
    """
    Get all projects with optional filtering and pagination.
    Use ?skill=python to filter projects that use Python.
    Use ?page=1&page_size=10 for pagination.
    """
    db = get_database()
    profile = await db.profiles.find_one()
    
    if not profile:
        return {"projects": [], "count": 0, "page": page, "page_size": page_size or settings.default_page_size, "total_pages": 0}
    
    projects = profile.get("projects", [])
    
    # Filter by skill
    if skill:
        skill_lower = skill.lower()
        projects = [
            p for p in projects
            if any(skill_lower in s.lower() for s in p.get("skills", []))
        ]
    
    total = len(projects)
    
    # Apply pagination
    actual_page_size = min(page_size or settings.default_page_size, settings.max_page_size)
    total_pages = (total + actual_page_size - 1) // actual_page_size if total > 0 else 0
    
    start = (page - 1) * actual_page_size
    end = start + actual_page_size
    paginated_projects = projects[start:end]
    
    return {
        "projects": paginated_projects,
        "count": len(paginated_projects),
        "total": total,
        "page": page,
        "page_size": actual_page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }


@router.get("/skills")
async def get_skills():
    """Get all skills from the profile."""
    db = get_database()
    profile = await db.profiles.find_one()
    
    if not profile:
        return {"skills": [], "count": 0}
    
    skills = profile.get("skills", [])
    return {"skills": skills, "count": len(skills)}


@router.get("/skills/top")
async def get_top_skills(limit: int = Query(5, ge=1, le=20)):
    """
    Get top skills based on frequency in projects.
    Skills that appear in more projects are ranked higher.
    """
    db = get_database()
    profile = await db.profiles.find_one()
    
    if not profile:
        return {"top_skills": []}
    
    # Count skill occurrences in projects
    skill_counts = Counter()
    for project in profile.get("projects", []):
        for skill in project.get("skills", []):
            skill_counts[skill.lower()] += 1
    
    # Also include profile skills (base count of 1)
    for skill in profile.get("skills", []):
        skill_counts[skill.lower()] += 1
    
    # Get top skills
    top_skills = [
        {"skill": skill, "count": count}
        for skill, count in skill_counts.most_common(limit)
    ]
    
    return {"top_skills": top_skills}


@router.get("/search")
async def search(
    q: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(1, ge=1, description="Page number for results"),
    page_size: int = Query(10, ge=1, le=50, description="Results per page")
):
    """
    Full-text search across profile data with pagination.
    Searches name, skills, project titles, and project descriptions.
    """
    db = get_database()
    profile = await db.profiles.find_one()
    
    if not profile:
        return {"results": [], "query": q}
    
    q_lower = q.lower()
    
    # Search in skills
    matching_skills = [
        skill for skill in profile.get("skills", [])
        if q_lower in skill.lower()
    ]
    
    # Search in projects
    matching_projects = [
        {"title": p["title"], "description": p["description"], "skills": p.get("skills", [])}
        for p in profile.get("projects", [])
        if q_lower in p.get("title", "").lower() or q_lower in p.get("description", "").lower()
    ]
    
    # Search in work experience
    matching_work = [
        {"title": w["title"], "company": w["company"], "duration": w.get("duration", "")}
        for w in profile.get("work", [])
        if q_lower in w.get("title", "").lower() or 
           q_lower in w.get("company", "").lower() or
           q_lower in w.get("description", "").lower()
    ]
    
    # Paginate projects
    total_projects = len(matching_projects)
    start = (page - 1) * page_size
    end = start + page_size
    paginated_projects = matching_projects[start:end]
    
    results = {
        "query": q,
        "matches": {
            "name": q_lower in profile.get("name", "").lower(),
            "skills": matching_skills,
            "projects": paginated_projects,
            "work": matching_work
        },
        "total_project_matches": total_projects,
        "page": page,
        "page_size": page_size,
        "has_more_projects": end < total_projects
    }
    
    return results
