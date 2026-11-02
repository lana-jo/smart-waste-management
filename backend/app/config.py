from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
MAX_UPLOAD_BYTES = 5 * 1024 * 1024


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(BACKEND_DIR / ".env", ".env"), extra="ignore"
    )

    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    upload_dir: str = "uploads"
    cors_origins_csv: str = ""
    cors_allow_all: bool = True

    @property
    def upload_root(self) -> Path:
        configured_path = Path(self.upload_dir)
        if configured_path.is_absolute():
            return configured_path
        return BACKEND_DIR / configured_path

    @property
    def backend_dir(self) -> Path:
        return BACKEND_DIR


@lru_cache
def get_settings() -> Settings:
    return Settings()
