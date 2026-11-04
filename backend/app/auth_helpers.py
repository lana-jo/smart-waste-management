"""Helper functions for the auth router (cookie/token issuance).

Dipisah agar routers/auth.py tetap di bawah batas 250 baris (R73).
"""

from typing import TYPE_CHECKING

from fastapi import Request, Response

from app.config import get_settings
from app.models import User
from app.schemas import Token, UserOut
from app.security import AUTH_COOKIE_NAME, create_access_token, verify_password

if TYPE_CHECKING:
    from app.schemas import UserProfileUpdate

settings = get_settings()


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        AUTH_COOKIE_NAME,
        token,
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
    )


def _clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        AUTH_COOKIE_NAME,
        path="/",
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
    )


def _allowed_origins() -> list[str]:
    return settings.cors_origin_list or ["http://localhost:3000"]


def _issue_login(request: Request, response: Response, user: User) -> Token:
    token = create_access_token(user.id, user.role)
    _set_auth_cookie(response, token)
    origin = request.headers.get("origin")
    if origin in _allowed_origins():
        # Web: token hanya di cookie, body tanpa access_token.
        return Token(user=UserOut.model_validate(user))
    # Mobile/native: sertakan access_token di body.
    return Token(access_token=token, user=UserOut.model_validate(user))


def _verifies_current_password(
    payload: "UserProfileUpdate", current_user: User
) -> bool:
    return payload.current_password is not None and verify_password(
        payload.current_password, current_user.password_hash
    )
