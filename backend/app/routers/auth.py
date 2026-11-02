from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import User
from app.schemas import RegisterIn, Token, UserOut
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

WRONG_CREDENTIALS_MESSAGE = "Email atau password salah."
DUPLICATE_EMAIL_MESSAGE = "Email sudah terdaftar. Gunakan email lain untuk mendaftar."


def issue_token(user: User) -> Token:
    return Token(
        access_token=create_access_token(user.id, user.role),
        user=UserOut.model_validate(user),
    )


@router.post("/register", response_model=Token, status_code=201)
def register_user(payload: RegisterIn, db: Session = Depends(get_db)) -> Token:
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
    return issue_token(new_user)


@router.post("/login", response_model=Token)
def authenticate_user(
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
    return issue_token(existing_user)


@router.get("/me", response_model=UserOut)
def show_profile(current_user: User = Depends(get_current_user)) -> User:
    return current_user
