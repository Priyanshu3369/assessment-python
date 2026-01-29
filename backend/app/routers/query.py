from fastapi import APIRouter, Query
from typing import Optional
from ..database import get_database
from collections import Counter

router = APIRouter(tags=["query"])


@router.get("/projects")
async def get_projects(skill: Optional[str] = Query(None, description="Filter projects by skill")):
    """
    Get all projects, optionally filtered by skill.
    Use ?skill=python to filter projects that use Python.
    """
    db = get_database()
    profile = await db.profiles.find_one()
    
    if not profile:
        return {"projects": []}
    
    projects = profile.get("projects", [])
    
    if skill:
        skill_lower = skill.lower()
        projects = [
            p for p in projects
            if any(skill_lower in s.lower() for s in p.get("skills", []))
        ]
    
    return {"projects": projects, "count": len(projects)}


@router.get("/skills")
async def get_skills():
    """Get all skills from the profile."""
    db = get_database()
    profile = await db.profiles.find_one()
    
    if not profile:
        return {"skills": []}
    
    return {"skills": profile.get("skills", [])}


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
async def search(q: str = Query(..., min_length=1, description="Search query")):
    """
    Full-text search across profile data.
    Searches name, skills, project titles, and project descriptions.
    """
    db = get_database()
    profile = await db.profiles.find_one()
    
    if not profile:
        return {"results": [], "query": q}
    
    q_lower = q.lower()
    results = {
        "query": q,
        "matches": {
            "name": False,
            "skills": [],
            "projects": [],
            "work": []
        }
    }
    
    # Search in name
    if q_lower in profile.get("name", "").lower():
        results["matches"]["name"] = True
    
    # Search in skills
    results["matches"]["skills"] = [
        skill for skill in profile.get("skills", [])
        if q_lower in skill.lower()
    ]
    
    # Search in projects
    results["matches"]["projects"] = [
        {"title": p["title"], "description": p["description"]}
        for p in profile.get("projects", [])
        if q_lower in p.get("title", "").lower() or q_lower in p.get("description", "").lower()
    ]
    
    # Search in work experience
    results["matches"]["work"] = [
        {"title": w["title"], "company": w["company"]}
        for w in profile.get("work", [])
        if q_lower in w.get("title", "").lower() or 
           q_lower in w.get("company", "").lower() or
           q_lower in w.get("description", "").lower()
    ]
    
    return results
