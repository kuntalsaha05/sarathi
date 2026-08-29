from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SARATHI"
    environment: str = "development"
    debug: bool | str = True

    database_url: str = "postgresql+asyncpg://sarathi:sarathi_dev_pw@localhost:5432/sarathi_db"
    sync_database_url: str = "postgresql://sarathi:sarathi_dev_pw@localhost:5432/sarathi_db"
    redis_url: str = "redis://localhost:6379/0"

    mapbox_access_token: str = ""
    osrm_base_url: str = "http://localhost:5000"
    bhashini_api_key: str = ""
    bhashini_user_id: str = ""

    cors_origins: str = "http://localhost:5173,http://localhost:5174"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def is_debug(self) -> bool:
        if isinstance(self.debug, bool):
            return self.debug
        return str(self.debug).lower() in ("true", "1", "yes", "t", "debug")

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

