"""
Authentication module for protecting write operations.
Uses HTTP Basic Auth with configurable credentials.
"""
import secrets
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from .config import get_settings

security = HTTPBasic()
settings = get_settings()


def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    """
    Verify HTTP Basic Auth credentials for write operations.
    Returns the username if authentication is successful.
    """
    correct_username = secrets.compare_digest(
        credentials.username.encode("utf8"),
        settings.admin_username.encode("utf8")
    )
    correct_password = secrets.compare_digest(
        credentials.password.encode("utf8"),
        settings.admin_password.encode("utf8")
    )
    
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    
    return credentials.username


# Dependency to use in protected routes
def require_auth(username: str = Depends(verify_credentials)) -> str:
    """Dependency that requires authentication."""
    return username
