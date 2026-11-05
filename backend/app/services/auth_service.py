import logging
import uuid
from datetime import UTC, datetime

import jwt
from fastapi import Request, Response
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.deps import get_raw_token
from app.models import User
from app.schemas import Token, UserOut, UserProfileUpdate
from app.security import (
    AUTH_COOKIE_NAME,
    create_access_token,
    decode_token,
    hash_password,
    token_expiry,
    verify_password,
)
from app.token_blocklist import revoke

settings = get_settings()
logger = logging.app if hasattr(logging, "app") else logging.getLogger("app.auth")

REGISTER_FAILED_MESSAGE = "Pendaftaran gagal. Coba lagi beberapa saat."
DUPLICATE_EMAIL_MESSAGE = "Email sudah terdaftar. Gunakan email lain."
WRONG_CREDENTIALS_MESSAGE = "Email atau kata sandi salah."
CURRENT_PASSWORD_WRONG_MESSAGE = "Kata sandi lama salah."
TIMING_DUMMY_HASH = "$2b$12$MY2KRGFXCvVWbNSCg9JBT.PnUj4DgLuTOVDAW.vR.BIr0CEfGggMu"


def set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        AUTH_COOKIE_NAME,
        token,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
    )


def clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        AUTH_COOKIE_NAME,
        path="/",
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
    )


def allowed_origins() -> list[str]:
    return settings.cors_origin_list or ["http://localhost:3000"]


def issue_login(request: Request, response: Response, user: User) -> Token:
    token = create_access_token(user.id, user.role)
    set_auth_cookie(response, token)
    origin = request.headers.get("origin")
    if origin in allowed_origins():
        return Token(user=UserOut.model_validate(user))
    return Token(access_token=token, user=UserOut.model_validate(user))


def register_user(db: Session, request: Request, response: Response, payload) -> Token:
    normalized_email = payload.email.lower()
    if db.scalar(select(User).where(User.email == normalized_email)) is not None:
        raise ValueError(DUPLICATE_EMAIL_MESSAGE)

    new_user = User(
        email=normalized_email,
        password_hash=hash_password(payload.password),
        name=payload.name,
        role="user",
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError(REGISTER_FAILED_MESSAGE) from None

    db.refresh(new_user)
    return issue_login(request, response, new_user)


def authenticate_user(
    db: Session, request: Request, response: Response, email: str, password: str
) -> Token:
    normalized_email = email.lower()
    existing_user = db.scalar(select(User).where(User.email == normalized_email))
    if existing_user is None or existing_user.is_deleted:
        verify_password(password, TIMING_DUMMY_HASH)
        raise LookupError(WRONG_CREDENTIALS_MESSAGE)

    if not verify_password(password, existing_user.password_hash):
        raise LookupError(WRONG_CREDENTIALS_MESSAGE)

    return issue_login(request, response, existing_user)


def rotate_session(
    db: Session, request: Request, response: Response, user: User, bearer: str | None
) -> Token:
    raw_token = get_raw_token(request, bearer)
    if raw_token is not None:
        try:
            old_claims = decode_token(raw_token)
            old_jti = uuid.UUID(str(old_claims["jti"]))
            revoke(
                db,
                old_jti,
                user.id,
                token_expiry(old_claims),
                effective_at=datetime.now(UTC),
            )
        except (jwt.PyJWTError, KeyError, ValueError):
            logger.info("rotasi sesi dilewati; token lama tanpa jti (bearer legacy)")
    return issue_login(request, response, user)


def logout_user(
    db: Session,
    request: Request,
    response: Response,
    current_user: User,
    bearer: str | None,
) -> None:
    raw_token = get_raw_token(request, bearer)
    if raw_token is not None:
        try:
            claims = decode_token(raw_token)
            jti = uuid.UUID(str(claims["jti"]))
            revoke(db, jti, current_user.id, token_expiry(claims))
        except (jwt.PyJWTError, KeyError, ValueError):
            pass
    clear_auth_cookie(response)


def update_user_profile(
    db: Session, current_user: User, payload: UserProfileUpdate
) -> User:
    if payload.current_password is not None:
        if not verify_password(payload.current_password, current_user.password_hash):
            raise ValueError(CURRENT_PASSWORD_WRONG_MESSAGE)

    if payload.email is not None:
        normalized_email = payload.email.lower()
        existing = db.scalar(
            select(User).where(
                User.email == normalized_email, User.id != current_user.id
            )
        )
        if existing is not None:
            raise ValueError(DUPLICATE_EMAIL_MESSAGE)
        current_user.email = normalized_email

    if payload.name is not None:
        current_user.name = payload.name

    if payload.new_password is not None:
        current_user.password_hash = hash_password(payload.new_password)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError(DUPLICATE_EMAIL_MESSAGE) from None

    db.refresh(current_user)
    return current_user
