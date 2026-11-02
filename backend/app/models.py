import uuid
from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Numeric,
    String,
    Text,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()")
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, server_default="user")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )

    reports: Mapped[list["WasteReport"]] = relationship(back_populates="user")


class WasteReport(Base):
    __tablename__ = "waste_reports"
    __table_args__ = (
        CheckConstraint(
            "category IN ('Organic Waste', 'Plastic Waste', 'Paper Waste')",
            name="ck_waste_reports_category",
        ),
        CheckConstraint(
            "status IN ('Pending', 'In Progress', 'Completed', 'Rejected')",
            name="ck_waste_reports_status",
        ),
        Index("idx_reports_status", "status"),
        Index("idx_reports_category", "category"),
        Index("idx_reports_user_id", "user_id"),
        Index("idx_reports_created_at", text("created_at DESC")),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()")
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    confidence: Mapped[float | None] = mapped_column(
        Float, nullable=True, server_default=text("0.0")
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    latitude: Mapped[float] = mapped_column(
        Numeric(10, 8, asdecimal=False), nullable=False
    )
    longitude: Mapped[float] = mapped_column(
        Numeric(11, 8, asdecimal=False), nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(30), nullable=False, server_default="Pending"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )

    user: Mapped["User"] = relationship(back_populates="reports")
