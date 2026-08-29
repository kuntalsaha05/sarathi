from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://sarathi:sarathi@localhost:5432/sarathi"
    OSRM_URL: str = "http://localhost:5000"
    MAPBOX_TOKEN: Optional[str] = None
    BASHINI_API_KEY: Optional[str] = None
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"


settings = Settings()
