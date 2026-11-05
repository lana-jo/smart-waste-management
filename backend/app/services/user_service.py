import uuid

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import User, WasteReport
from app.schemas import UserAdminCreate, UserAdminUpdate
from app.security import hash_password
from app.services.storage import delete_report_image

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


def list_users(db: Session, include_deleted: bool = False) -> list[User]:
    query = select(User).order_by(User.created_at.desc())
    if not include_deleted:
        query = query.where(User.is_deleted.is_(False))
    return list(db.scalars(query).all())


def create_user(db: Session, payload: UserAdminCreate) -> User:
    normalized_email = payload.email.lower()
    if db.scalar(select(User).where(User.email == normalized_email)) is not None:
        raise ValueError(DUPLICATE_EMAIL_MESSAGE)

    new_user = User(
        email=normalized_email,
        password_hash=hash_password(payload.password),
        name=payload.name,
        role=payload.role.value,
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError(DUPLICATE_EMAIL_MESSAGE) from None
    db.refresh(new_user)
    return new_user


def update_user(
    db: Session, user_id: uuid.UUID, payload: UserAdminUpdate, admin_id: uuid.UUID
) -> User:
    target_user = find_user(db, user_id)
    if target_user is None:
        raise LookupError(NOT_FOUND_MESSAGE)
    if target_user.id == admin_id:
        raise PermissionError("Anda tidak dapat mengelola akun Anda sendiri.")

    if payload.role is not None and payload.role.value != target_user.role:
        if target_user.id == admin_id:
            raise PermissionError(SELF_ROLE_MESSAGE)
        if target_user.role == "admin" and payload.role.value != "admin":
            if count_admins(db) <= 1:
                raise ValueError(LAST_ADMIN_MESSAGE)

    if payload.email is not None:
        normalized_email = payload.email.lower()
        existing = db.scalar(
            select(User).where(User.email == normalized_email, User.id != user_id)
        )
        if existing is not None:
            raise ValueError(DUPLICATE_EMAIL_MESSAGE)
        target_user.email = normalized_email

    if payload.name is not None:
        target_user.name = payload.name

    if payload.password is not None:
        target_user.password_hash = hash_password(payload.password)

    if payload.role is not None:
        target_user.role = payload.role.value

    if payload.is_deleted is not None:
        if payload.is_deleted and target_user.role == "admin" and count_admins(db) <= 1:
            raise ValueError(LAST_ADMIN_MESSAGE)
        target_user.is_deleted = payload.is_deleted

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError(DUPLICATE_EMAIL_MESSAGE) from None

    db.refresh(target_user)
    return target_user


def delete_user(db: Session, user_id: uuid.UUID, admin_id: uuid.UUID) -> None:
    target_user = find_user(db, user_id)
    if target_user is None:
        raise LookupError(NOT_FOUND_MESSAGE)
    if target_user.id == admin_id:
        raise PermissionError(SELF_DELETE_MESSAGE)
    if target_user.role == "admin":
        raise PermissionError(ADMIN_DELETE_MESSAGE)

    reported_image_urls = db.scalars(
        select(WasteReport.image_url).where(WasteReport.user_id == target_user.id)
    ).all()

    target_user.is_deleted = True
    db.commit()
    for image_url in reported_image_urls:
        delete_report_image(image_url)
