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
    access_token_expire_minutes: int = 45
    upload_dir: str = "uploads"

    # Sesi cookie: TTL pendek, diperbarui oleh POST /api/auth/refresh.
    auth_cookie_minutes: int = 45
    # Prod wajib COOKIE_SECURE=true; default False hanya untuk dev http lokal.
    cookie_secure: bool = False

    # Trusted proxy untuk parsing X-Forwarded-For (rate limit). Jangan percaya XFF mentah.
    trusted_proxies: str = "127.0.0.1,::1"

    # CORS: whitelist eksplisit via CORS_ORIGINS (koma). cors_allow_all hanya
    # escape hatch debug lokal dan TIDAK mengirim credentials.
    cors_allow_all: bool = False
    cors_origins: str = ""
    cors_origins_csv: str = ""

    # Fallback Bearer dipertahankan karena mobile-app masih memakainya.
    bearer_fallback_enabled: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        csv_text = self.cors_origins or self.cors_origins_csv
        return [
            origin.strip().rstrip("/")
            for origin in csv_text.split(",")
            if origin.strip()
        ]

    @property
    def trusted_proxy_list(self) -> list[str]:
        return [p.strip() for p in self.trusted_proxies.split(",") if p.strip()]

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
