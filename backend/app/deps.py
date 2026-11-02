import uuid

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security import decode_token

bearer_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

UNAUTHORIZED_MESSAGE = "Token tidak valid atau kedaluwarsa. Silakan login kembali."
FORBIDDEN_MESSAGE = "Aksi ini hanya untuk admin. Silakan hubungi pengelola."


def get_current_user(
    token: str | None = Depends(bearer_scheme), db: Session = Depends(get_db)
) -> User:
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=UNAUTHORIZED_MESSAGE,
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        claims = decode_token(token)
        user_id = uuid.UUID(str(claims["sub"]))
    except (jwt.PyJWTError, KeyError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=UNAUTHORIZED_MESSAGE,
            headers={"WWW-Authenticate": "Bearer"},
        ) from None

    current_user = db.scalar(select(User).where(User.id == user_id))
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=UNAUTHORIZED_MESSAGE,
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=FORBIDDEN_MESSAGE
        )
    return current_user
