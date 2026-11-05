from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import User
from app.rate_limit import limiter
from app.schemas import RegisterIn, Token, UserOut, UserProfileUpdate
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=201)
@limiter.limit("5/minute")
def register(
    request: Request,
    response: Response,
    payload: RegisterIn,
    db: Session = Depends(get_db),
) -> Token:
    try:
        return auth_service.register_user(db, request, response, payload)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=str(e)
        ) from None


@router.post("/login", response_model=Token, response_model_exclude_none=True)
@limiter.limit("10/minute")
def authenticate_user(
    request: Request,
    response: Response,
    credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> Token:
    try:
        return auth_service.authenticate_user(
            db, request, response, credentials.username, credentials.password
        )
    except LookupError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=auth_service.WRONG_CREDENTIALS_MESSAGE,
            headers={"WWW-Authenticate": "Bearer"},
        ) from None


@router.post("/refresh", response_model=Token, response_model_exclude_none=True)
@limiter.limit("20/minute")
def refresh_session(
    request: Request,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Token:
    return auth_service.rotate_session(db, request, response, current_user, None)


@router.post("/logout")
@limiter.limit("30/minute")
def logout(
    request: Request,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    auth_service.logout_user(db, request, response, current_user, None)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserOut)
@limiter.limit("60/minute")
def read_current_user(
    request: Request, current_user: User = Depends(get_current_user)
) -> User:
    return current_user


@router.put("/me", response_model=UserOut)
@limiter.limit("20/minute")
def update_current_user(
    request: Request,
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    try:
        return auth_service.update_user_profile(db, current_user, payload)
    except ValueError as e:
        status_code = (
            status.HTTP_400_BAD_REQUEST
            if str(e) == auth_service.CURRENT_PASSWORD_WRONG_MESSAGE
            else status.HTTP_409_CONFLICT
        )
        raise HTTPException(status_code=status_code, detail=str(e)) from None
