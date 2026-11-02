import uuid
from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRole(StrEnum):
    admin = "admin"
    user = "user"


class ReportStatus(StrEnum):
    pending = "Pending"
    in_progress = "In Progress"
    completed = "Completed"
    rejected = "Rejected"


class ReportCategory(StrEnum):
    organic = "Organic Waste"
    plastic = "Plastic Waste"
    paper = "Paper Waste"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: str
    role: str
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class StatusIn(BaseModel):
    status: ReportStatus


class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    image_url: str
    category: str
    confidence: float | None = 0.0
    description: str
    latitude: float
    longitude: float
    status: str
    created_at: datetime
    updated_at: datetime
    reporter_name: str = ""


class ReportPage(BaseModel):
    items: list[ReportOut]
    total: int
    limit: int
    offset: int


class StatsOut(BaseModel):
    total: int
    by_status: dict[str, int]
    by_category: dict[str, int]


class UserAdminCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    role: UserRole


class UserAdminUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    email: EmailStr | None = None
    password: str | None = Field(None, min_length=8, max_length=72)
    role: UserRole | None = None


class ReportUpdateFields(BaseModel):
    description: str | None = Field(None, min_length=1, max_length=2000)
    latitude: float | None = Field(None, ge=-90, le=90)
    longitude: float | None = Field(None, ge=-180, le=180)
    category: ReportCategory | None = None
    confidence: float | None = Field(None, ge=0, le=1)
