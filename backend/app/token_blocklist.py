"""Blacklist jti logout/refresh. Bertahan via DB, aman untuk restart server.

Tabel revoked_tokens dibuat otomatis saat startup (main.lifespan) atau init.sql
untuk instalasi baru. Logikanya sederhana: dibuang saat exp-nya lewat.
"""

import asyncio
import logging
import uuid
from datetime import UTC, datetime

from sqlalchemy import delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import RevokedToken

logger = logging.getLogger("app.token_blocklist")


def revoke(
    db: Session,
    jti: uuid.UUID,
    user_id: uuid.UUID | None,
    expires_at: datetime,
    effective_at: datetime | None = None,
) -> None:
    purge(db)
    if effective_at is None:
        effective_at = datetime.now(UTC)
    if db.get(RevokedToken, jti) is not None:
        return
    try:
        db.add(
            RevokedToken(
                jti=jti,
                user_id=user_id,
                expires_at=expires_at,
                effective_at=effective_at,
            )
        )
        db.commit()
    except IntegrityError:
        db.rollback()


def is_revoked(db: Session, jti: uuid.UUID) -> bool:
    row = db.get(RevokedToken, jti)
    if row is None:
        return False
    return datetime.now(UTC) >= row.effective_at


def purge(db: Session) -> None:
    removed = db.execute(
        delete(RevokedToken).where(RevokedToken.expires_at <= datetime.now(UTC))
    ).rowcount
    if removed:
        db.commit()


async def run_token_purge_loop(interval_seconds: int = 3600) -> None:
    """Background task terjadwal untuk membersihkan revoked_tokens kedaluwarsa (R55)."""
    while True:
        await asyncio.sleep(interval_seconds)
        try:
            with SessionLocal() as db:
                purge(db)
        except Exception as e:
            logger.error("Gagal membersihkan token kedaluwarsa secara berkala: %s", e)
