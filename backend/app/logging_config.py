"""
Logging configuration for the application.
Sets up structured logging with request/response middleware.
"""
import logging
import sys
import time
from datetime import datetime
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


# Configure logging format
def setup_logging(log_level: str = "INFO"):
    """Configure application logging."""
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[
            logging.StreamHandler(sys.stdout),
        ]
    )
    
    # Set third-party loggers to warning
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("motor").setLevel(logging.WARNING)
    
    return logging.getLogger("app")


logger = setup_logging()


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all incoming requests and their responses."""
    
    async def dispatch(self, request: Request, call_next):
        # Start timer
        start_time = time.time()
        
        # Get request info
        method = request.method
        url = str(request.url.path)
        query = str(request.url.query) if request.url.query else ""
        client_ip = request.client.host if request.client else "unknown"
        
        # Log incoming request
        logger.info(f"➡️  {method} {url}{'?' + query if query else ''} | IP: {client_ip}")
        
        # Process request
        try:
            response = await call_next(request)
            
            # Calculate duration
            duration = (time.time() - start_time) * 1000
            
            # Log response
            status_emoji = "✅" if response.status_code < 400 else "❌"
            logger.info(f"{status_emoji} {method} {url} | Status: {response.status_code} | {duration:.2f}ms")
            
            return response
            
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            logger.error(f"❌ {method} {url} | Error: {str(e)} | {duration:.2f}ms")
            raise
