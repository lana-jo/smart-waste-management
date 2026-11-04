import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models import User, WasteReport
from app.schemas import UserAdminCreate, UserAdminUpdate, UserOut, UserRole
from app.security import hash_password
from app.services.storage import delete_report_image

router = APIRouter(
    prefix="/api/users", tags=["users"], dependencies=[Depends(require_admin)]
)

NOT_FOUND_MESSAGE = "Pengguna tidak ditemukan."
DUPLICATE_EMAIL_MESSAGE = "Email sudah terdaftar. Gunakan email lain."
SELF_ROLE_MESSAGE = "Anda tidak dapat mengubah role akun Anda sendiri."
LAST_ADMIN_MESSAGE = "Setidaknya harus ada satu admin yang aktif."
SELF_DELETE_MESSAGE = "Anda tidak dapat menghapus akun sendiri."
ADMIN_DELETE_MESSAGE = "Akun admin tidak dapat dihapus."


def count_admins(db: Session) -> int:
    return int(
        db.scalar(
            select(func.count())
            .select_from(User)
            .where(User.role == "admin", User.is_deleted.is_(False))
        )
        or 0
    )


def find_user(db: Session, user_id: uuid.UUID) -> User | None:
    return db.scalar(select(User).where(User.id == user_id, User.is_deleted.is_(False)))


@router.get("", response_model=list[UserOut])
def list_users(
    include_deleted: bool = False, db: Session = Depends(get_db)
) -> list[User]:
    query = select(User).order_by(User.created_at.desc())
    if not include_deleted:
        query = query.where(User.is_deleted.is_(False))
    return list(db.scalars(query).all())


@router.post("", response_model=UserOut, status_code=201)
def create_user(payload: UserAdminCreate, db: Session = Depends(get_db)) -> User:
    normalized_email = payload.email.lower()
    if db.scalar(select(User).where(User.email == normalized_email)) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=DUPLICATE_EMAIL_MESSAGE
        )

    new_user = User(
        name=payload.name,
        email=normalized_email,
        password_hash=hash_password(payload.password),
        role=payload.role.value,
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
    return new_user


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: uuid.UUID,
    payload: UserAdminUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> User:
    target_user = find_user(db, user_id)
    if target_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=NOT_FOUND_MESSAGE
        )
    if target_user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Anda tidak dapat mengelola akun Anda sendiri.",
        )

    if payload.email is not None:
        normalized_email = payload.email.lower()
        taken_by = db.scalar(
            select(User).where(
                User.email == normalized_email, User.id != target_user.id
            )
        )
        if taken_by is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail=DUPLICATE_EMAIL_MESSAGE
            )
        target_user.email = normalized_email

    if payload.name is not None:
        target_user.name = payload.name
    if payload.password is not None:
        target_user.password_hash = hash_password(payload.password)
    if payload.role is not None:
        if target_user.id == admin.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail=SELF_ROLE_MESSAGE
            )
        if (
            target_user.role == "admin"
            and payload.role is UserRole.user
            and count_admins(db) <= 1
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail=LAST_ADMIN_MESSAGE
            )
        target_user.role = payload.role.value

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail=DUPLICATE_EMAIL_MESSAGE
        ) from None
    db.refresh(target_user)
    return target_user


@router.delete("/{user_id}", status_code=204)
def remove_user(
    user_id: uuid.UUID,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> None:
    target_user = find_user(db, user_id)
    if target_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=NOT_FOUND_MESSAGE
        )
    if target_user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=SELF_DELETE_MESSAGE
        )
    if target_user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=ADMIN_DELETE_MESSAGE
        )

    reported_image_urls = db.scalars(
        select(WasteReport.image_url).where(WasteReport.user_id == target_user.id)
    ).all()

    target_user.is_deleted = True
    db.commit()
    for image_url in reported_image_urls:
        delete_report_image(image_url)
