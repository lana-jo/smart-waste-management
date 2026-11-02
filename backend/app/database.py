from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings

PSYCOPG_URL_PREFIX = "postgresql+psycopg://"


def to_psycopg_url(raw_url: str) -> str:
    if raw_url.startswith("postgresql+"):
        return raw_url
    if raw_url.startswith("postgresql://"):
        return raw_url.replace("postgresql://", PSYCOPG_URL_PREFIX, 1)
    return raw_url


settings = get_settings()
engine = create_engine(to_psycopg_url(settings.database_url), pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db() -> Iterator[Session]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
