"""
Rate limiting middleware using a simple in-memory sliding window approach.
"""
import time
from typing import Dict, List
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from .config import get_settings

settings = get_settings()


class RateLimiter:
    """Simple in-memory rate limiter using sliding window."""
    
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.window_size = 60  # 1 minute window
        self.requests: Dict[str, List[float]] = {}
    
    def _get_client_key(self, request: Request) -> str:
        """Get unique client identifier."""
        client_ip = request.client.host if request.client else "unknown"
        return client_ip
    
    def _clean_old_requests(self, key: str, current_time: float):
        """Remove requests outside the sliding window."""
        if key in self.requests:
            cutoff = current_time - self.window_size
            self.requests[key] = [t for t in self.requests[key] if t > cutoff]
    
    def is_allowed(self, request: Request) -> bool:
        """Check if request is allowed under rate limit."""
        key = self._get_client_key(request)
        current_time = time.time()
        
        self._clean_old_requests(key, current_time)
        
        if key not in self.requests:
            self.requests[key] = []
        
        if len(self.requests[key]) >= self.requests_per_minute:
            return False
        
        self.requests[key].append(current_time)
        return True
    
    def get_remaining(self, request: Request) -> int:
        """Get remaining requests for client."""
        key = self._get_client_key(request)
        current_time = time.time()
        self._clean_old_requests(key, current_time)
        
        used = len(self.requests.get(key, []))
        return max(0, self.requests_per_minute - used)


# Global rate limiter instance
rate_limiter = RateLimiter(requests_per_minute=settings.rate_limit_per_minute)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware to enforce rate limiting."""
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path == "/health":
            return await call_next(request)
        
        if not rate_limiter.is_allowed(request):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later.",
                headers={
                    "Retry-After": "60",
                    "X-RateLimit-Limit": str(settings.rate_limit_per_minute),
                    "X-RateLimit-Remaining": "0"
                }
            )
        
        response = await call_next(request)
        
        # Add rate limit headers
        remaining = rate_limiter.get_remaining(request)
        response.headers["X-RateLimit-Limit"] = str(settings.rate_limit_per_minute)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        
        return response
