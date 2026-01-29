from fastapi import APIRouter, HTTPException, status, Depends
from ..database import get_database
from ..models import ProfileCreate, ProfileUpdate, ProfileResponse
from ..auth import require_auth
from bson import ObjectId

router = APIRouter(prefix="/profile", tags=["profile"])


def profile_helper(profile) -> dict:
    """Convert MongoDB document to response format."""
    return {
        "id": str(profile["_id"]),
        "name": profile["name"],
        "email": profile["email"],
        "education": profile.get("education", []),
        "skills": profile.get("skills", []),
        "projects": profile.get("projects", []),
        "work": profile.get("work", []),
        "links": profile.get("links", {})
    }


@router.get("", response_model=ProfileResponse)
async def get_profile():
    """Get the candidate profile."""
    db = get_database()
    profile = await db.profiles.find_one()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return profile_helper(profile)


@router.post("", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(profile: ProfileCreate, username: str = Depends(require_auth)):
    """
    Create a new profile.
    Requires HTTP Basic Auth.
    """
    db = get_database()
    
    # Check if profile already exists
    existing = await db.profiles.find_one()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists. Use PUT to update."
        )
    
    profile_dict = profile.model_dump()
    result = await db.profiles.insert_one(profile_dict)
    
    created_profile = await db.profiles.find_one({"_id": result.inserted_id})
    return profile_helper(created_profile)


@router.put("", response_model=ProfileResponse)
async def update_profile(profile_update: ProfileUpdate, username: str = Depends(require_auth)):
    """
    Update the profile.
    Requires HTTP Basic Auth.
    """
    db = get_database()
    
    existing = await db.profiles.find_one()
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    update_data = {k: v for k, v in profile_update.model_dump().items() if v is not None}
    
    if update_data:
        await db.profiles.update_one(
            {"_id": existing["_id"]},
            {"$set": update_data}
        )
    
    updated_profile = await db.profiles.find_one({"_id": existing["_id"]})
    return profile_helper(updated_profile)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(username: str = Depends(require_auth)):
    """
    Delete the profile.
    Requires HTTP Basic Auth.
    """
    db = get_database()
    
    result = await db.profiles.delete_one({})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
