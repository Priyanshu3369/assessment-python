from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    app_name: str = "Candidate Profile API"
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "candidate_profile"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
