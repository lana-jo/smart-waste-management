import uuid
from datetime import UTC, datetime, timedelta
from typing import TypedDict

import bcrypt
import jwt

from app.config import get_settings

settings = get_settings()

AUTH_COOKIE_NAME = "__Host-access_token"


class TokenClaims(TypedDict, total=False):
    sub: str
    role: str
    iat: int
    exp: int
    jti: str


def hash_password(plain_password: str) -> str:
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, stored_hash: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), stored_hash.encode("utf-8")
        )
    except ValueError:
        return False


def create_access_token(user_id: uuid.UUID, role: str) -> str:
    issued_at = datetime.now(UTC)
    expires_at = issued_at + timedelta(minutes=settings.access_token_expire_minutes)
    claims = {
        "sub": str(user_id),
        "role": role,
        "iat": issued_at,
        "exp": expires_at,
        "jti": str(uuid.uuid4()),
    }
    return jwt.encode(claims, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> TokenClaims:
    # Whitelist algoritma (tolak "none") + validasi exp wajib.
    decoded = jwt.decode(
        token,
        settings.jwt_secret,
        algorithms=[settings.jwt_algorithm],
        options={"require": ["exp"]},
    )
    return decoded  # type: ignore[return-value]


def token_expiry(claims: dict) -> datetime:
    return datetime.fromtimestamp(claims["exp"], tz=UTC)
