import logging
import uuid
from datetime import UTC, datetime, timedelta

import jwt
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth_helpers import (
    _clear_auth_cookie,
    _issue_login,
    _set_auth_cookie,
    _verifies_current_password,
)
from app.config import get_settings
from app.database import get_db
from app.deps import bearer_scheme, get_current_user, get_raw_token
from app.models import User
from app.rate_limit import limiter
from app.schemas import RegisterIn, Token, UserOut, UserProfileUpdate
from app.security import (
    create_access_token,
    decode_token,
    hash_password,
    token_expiry,
    verify_password,
)
from app.token_blocklist import revoke

logger = logging.getLogger("app.auth")
settings = get_settings()

router = APIRouter(prefix="/api/auth", tags=["auth"])

WRONG_CREDENTIALS_MESSAGE = "Email atau password salah."
DUPLICATE_EMAIL_MESSAGE = "Email sudah terdaftar. Gunakan email lain untuk mendaftar."
REAUTH_MESSAGE = "Password saat ini tidak sesuai. Periksa kembali kata sandi Anda."
LOGOUT_MESSAGE = "Logout berhasil."


@router.post(
    "/register", response_model=Token, status_code=201, response_model_exclude_none=True
)
@limiter.limit("5/minute")
def register_user(
    request: Request,
    response: Response,
    payload: RegisterIn,
    db: Session = Depends(get_db),
) -> Token:
    normalized_email = payload.email.lower()
    if db.scalar(select(User).where(User.email == normalized_email)) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=DUPLICATE_EMAIL_MESSAGE
        )

    new_user = User(
        name=payload.name,
        email=normalized_email,
        password_hash=hash_password(payload.password),
        role="user",
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=DUPLICATE_EMAIL_MESSAGE
        ) from None
    db.refresh(new_user)
    return _issue_login(request, response, new_user)


@router.post("/login", response_model=Token, response_model_exclude_none=True)
@limiter.limit("10/minute")
def authenticate_user(
    request: Request,
    response: Response,
    credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> Token:
    existing_user = db.scalar(
        select(User).where(User.email == credentials.username.lower())
    )
    if existing_user is None or not verify_password(
        credentials.password, existing_user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=WRONG_CREDENTIALS_MESSAGE,
            headers={"WWW-Authenticate": "Bearer"},
        )
    return _issue_login(request, response, existing_user)


@router.post("/refresh", response_model=Token, response_model_exclude_none=True)
@limiter.limit("20/minute")
def refresh_session(
    request: Request,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    bearer: str | None = Depends(bearer_scheme),
) -> Token:
    raw_token = get_raw_token(request, bearer)
    if raw_token is not None:
        try:
            old_claims = decode_token(raw_token)
            old_jti = uuid.UUID(str(old_claims["jti"]))
            expiry = token_expiry(old_claims)
        except (jwt.PyJWTError, KeyError, ValueError):
            return _issue_login(
                request, response, current_user
            )  # token legacy tanpa jti
        # grace window 30s: token lama masih valid in-flight
        revoke(
            db,
            old_jti,
            current_user.id,
            expiry,
            effective_at=datetime.now(UTC) + timedelta(seconds=30),
        )
    return _issue_login(request, response, current_user)


@router.post("/logout")
@limiter.limit("30/minute")
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    bearer: str | None = Depends(bearer_scheme),
) -> dict[str, str]:
    # Tanpa get_current_user agar cookie rusak/kedaluwarsa tetap bisa "dibuang".
    raw_token = get_raw_token(request, bearer)
    try:
        if raw_token is not None:
            try:
                claims = decode_token(raw_token)
                raw_sub = claims.get("sub")
                user_id = uuid.UUID(str(raw_sub)) if raw_sub else None
                jti = uuid.UUID(str(claims["jti"]))
                # grace=0: revoke efektif sekarang
                revoke(
                    db,
                    jti,
                    user_id,
                    token_expiry(claims),
                    effective_at=datetime.now(UTC),
                )
            except (jwt.PyJWTError, KeyError, ValueError):
                logger.info("logout menerima token tak valid; cookie tetap dihapus")
    finally:
        _clear_auth_cookie(response)
    return {"message": LOGOUT_MESSAGE}


@router.get("/me", response_model=UserOut)
def show_profile(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.put("/me", response_model=UserOut)
def update_profile(
    request: Request,
    response: Response,
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    bearer: str | None = Depends(bearer_scheme),
) -> User:
    # Re-auth: ganti password/email wajib konfirmasi password saat ini.
    sensitive_change = payload.password is not None or payload.email is not None
    if sensitive_change and not _verifies_current_password(payload, current_user):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=REAUTH_MESSAGE
        )

    if payload.name is not None:
        current_user.name = payload.name.strip()
    if payload.email is not None:
        normalized_email = payload.email.lower()
        if (
            db.scalar(
                select(User).where(
                    User.email == normalized_email, User.id != current_user.id
                )
            )
            is not None
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=DUPLICATE_EMAIL_MESSAGE,
            )
        current_user.email = normalized_email
    password_changed = payload.password is not None
    if password_changed:
        current_user.password_hash = hash_password(payload.password)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=DUPLICATE_EMAIL_MESSAGE,
        ) from None
    db.refresh(current_user)

    if password_changed:
        # Putar sesi: token lama dibuang dari blacklist, cookie baru direspons ini.
        rotate_session(request, response, db, current_user, bearer)
    return current_user


def rotate_session(
    request: Request,
    response: Response,
    db: Session,
    user: User,
    bearer: str | None = None,
) -> None:
    """Revoke jti token lama, lalu kirim token + cookie baru pada response."""
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
    _set_auth_cookie(response, create_access_token(user.id, user.role))
