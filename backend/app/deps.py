import uuid

import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import User
from app.security import AUTH_COOKIE_NAME, decode_token
from app.token_blocklist import is_revoked

bearer_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

UNAUTHORIZED_MESSAGE = "Token tidak valid atau kedaluwarsa. Silakan login kembali."
FORBIDDEN_MESSAGE = "Aksi ini hanya untuk admin. Silakan hubungi pengelola."

# TODO(deprecate): mobile-app/src/services/api.ts masih mengirim Authorization:
# Bearer (dibaca 2026-11, konsultasi read-only). Setelah mobile pindah ke cookie,
# set BEARER_FALLBACK_ENABLED=false di env, baru hapus jalur Bearer.


def get_raw_token(
    request: Request, bearer: str | None = Depends(bearer_scheme)
) -> str | None:
    """Cookie HttpOnly dulu (frontend-web); Bearer hanya fallback (mobile-app)."""
    cookie_token = request.cookies.get(AUTH_COOKIE_NAME)
    if cookie_token:
        return cookie_token
    if get_settings().bearer_fallback_enabled:
        return bearer
    return None


def _unauthorized() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=UNAUTHORIZED_MESSAGE,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
    bearer: str | None = Depends(bearer_scheme),
) -> User:
    token = get_raw_token(request, bearer)
    if token is None:
        raise _unauthorized()
    try:
        claims = decode_token(token)
        user_id = uuid.UUID(str(claims["sub"]))
    except (jwt.PyJWTError, KeyError, ValueError):
        raise _unauthorized() from None

    raw_jti = claims.get("jti")
    if not raw_jti:
        raise _unauthorized()
    try:
        jti = uuid.UUID(str(raw_jti))
    except (ValueError, TypeError):
        raise _unauthorized() from None
    if is_revoked(db, jti):
        raise _unauthorized()

    current_user = db.scalar(select(User).where(User.id == user_id))
    if current_user is None:
        raise _unauthorized()
    return current_user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=FORBIDDEN_MESSAGE
        )
    return current_user
