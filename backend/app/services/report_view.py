import uuid

from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models import User, WasteReport
from app.schemas import ReportOut, ReportUpdateFields


def enforce_report_field_bounds(raw_fields: dict[str, object]) -> ReportUpdateFields:
    try:
        return ReportUpdateFields.model_validate(raw_fields)
    except ValidationError as failure:
        raise RequestValidationError(failure.errors()) from None


def render_report(report: WasteReport) -> ReportOut:
    rendered = ReportOut.model_validate(report)
    rendered.reporter_name = report.user.name
    return rendered


def find_report(db: Session, report_id: uuid.UUID, viewer: User) -> WasteReport | None:
    statement = (
        select(WasteReport)
        .options(joinedload(WasteReport.user))
        .where(WasteReport.id == report_id)
    )
    report = db.execute(statement).scalar_one_or_none()
    if report is not None and viewer.role != "admin" and report.user_id != viewer.id:
        return None
    return report
