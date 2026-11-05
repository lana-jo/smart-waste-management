import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models import User
from app.schemas import UserAdminCreate, UserAdminUpdate, UserOut
from app.services import user_service

router = APIRouter(
    prefix="/api/users", tags=["users"], dependencies=[Depends(require_admin)]
)


@router.get("", response_model=list[UserOut])
def list_users(
    include_deleted: bool = False, db: Session = Depends(get_db)
) -> list[User]:
    return user_service.list_users(db, include_deleted)


@router.post("", response_model=UserOut, status_code=201)
def create_user(payload: UserAdminCreate, db: Session = Depends(get_db)) -> User:
    try:
        return user_service.create_user(db, payload)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=str(e)
        ) from None


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: uuid.UUID,
    payload: UserAdminUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> User:
    try:
        return user_service.update_user(db, user_id, payload, admin.id)
    except LookupError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
        ) from None
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=str(e)
        ) from None
    except ValueError as e:
        status_code = (
            status.HTTP_400_BAD_REQUEST
            if "admin" in str(e).lower()
            else status.HTTP_409_CONFLICT
        )
        raise HTTPException(status_code=status_code, detail=str(e)) from None


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: uuid.UUID,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> None:
    try:
        user_service.delete_user(db, user_id, admin.id)
    except LookupError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
        ) from None
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=str(e)
        ) from None
