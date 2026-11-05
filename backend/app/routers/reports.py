import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps import get_current_user
from app.models import User, WasteReport
from app.rate_limit import limiter
from app.schemas import (
    ReportCategory,
    ReportOut,
    ReportPage,
    ReportStatus,
    StatsOut,
)
from app.services.report_view import find_report, render_report

router = APIRouter(prefix="/api/reports", tags=["reports"])

NOT_FOUND_MESSAGE = "Laporan tidak ditemukan."


@router.get("", response_model=ReportPage)
@limiter.limit("30/minute")
def list_reports(
    request: Request,
    search: str | None = Query(None, max_length=100),
    status_filter: str | None = Query(None, alias="status"),
    category: str | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReportPage:
    filters = []
    if search:
        pattern = f"%{search}%"
        filters.append(
            or_(WasteReport.description.ilike(pattern), User.name.ilike(pattern))
        )
    if status_filter and status_filter.strip():
        try:
            parsed_status = ReportStatus(status_filter.strip())
            filters.append(WasteReport.status == parsed_status.value)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Status laporan tidak valid.",
            ) from None
    if category and category.strip():
        try:
            parsed_category = ReportCategory(category.strip())
            filters.append(WasteReport.category == parsed_category.value)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Kategori laporan tidak valid.",
            ) from None
    if current_user.role != "admin":
        filters.append(WasteReport.user_id == current_user.id)

    joined_statement = select(WasteReport).join(User, WasteReport.user_id == User.id)
    total_statement = select(func.count()).select_from(
        joined_statement.where(*filters).subquery()
    )
    total = db.scalar(total_statement) or 0

    report_statement = (
        joined_statement.options(joinedload(WasteReport.user))
        .where(*filters)
        .order_by(WasteReport.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    reports = db.scalars(report_statement).all()
    return ReportPage(
        items=[render_report(report) for report in reports],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/stats", response_model=StatsOut)
@limiter.limit("30/minute")
def read_report_stats(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StatsOut:
    status_statement = select(WasteReport.status, func.count()).group_by(
        WasteReport.status
    )
    category_statement = select(WasteReport.category, func.count()).group_by(
        WasteReport.category
    )
    if current_user.role != "admin":
        status_statement = status_statement.where(
            WasteReport.user_id == current_user.id
        )
        category_statement = category_statement.where(
            WasteReport.user_id == current_user.id
        )

    by_status = {entry.value: 0 for entry in ReportStatus}
    for status_value, row_count in db.execute(status_statement).all():
        by_status[status_value] = row_count

    by_category = {entry.value: 0 for entry in ReportCategory}
    for category_value, row_count in db.execute(category_statement).all():
        by_category[category_value] = row_count

    return StatsOut(
        total=sum(by_status.values()), by_status=by_status, by_category=by_category
    )


@router.get("/{report_id}", response_model=ReportOut)
def read_report(
    report_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReportOut:
    report = find_report(db, report_id, current_user)
    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=NOT_FOUND_MESSAGE
        )
    return render_report(report)
