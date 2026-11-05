import uuid
from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models import User, WasteReport
from app.rate_limit import limiter
from app.schemas import (
    ReportCategory,
    ReportOut,
    ReportStatus,
    StatusIn,
)
from app.services.report_view import (
    enforce_report_field_bounds,
    find_report,
    render_report,
)
from app.services.storage import (
    ImageValidationError,
    delete_report_image,
    validate_and_save_image,
)

router = APIRouter(prefix="/api/reports", tags=["reports"])

NOT_FOUND_MESSAGE = "Laporan tidak ditemukan."
SAVE_FAILED_MESSAGE = "Laporan gagal disimpan. Coba lagi beberapa saat."
UPDATE_FAILED_MESSAGE = "Perubahan laporan gagal disimpan. Coba lagi beberapa saat."


def _collect_form_fields(
    description: str | None,
    latitude: float | None,
    longitude: float | None,
    category: ReportCategory | None,
    confidence: float | None,
) -> dict:
    return {
        "description": description,
        "latitude": latitude,
        "longitude": longitude,
        "category": category,
        "confidence": confidence,
    }


@router.post("", response_model=ReportOut, status_code=201)
@limiter.limit("10/minute")
def create_report(
    request: Request,
    image: Annotated[UploadFile, File()],
    description: Annotated[str | None, Form()] = None,
    latitude: Annotated[float | None, Form()] = None,
    longitude: Annotated[float | None, Form()] = None,
    category: Annotated[ReportCategory | None, Form()] = None,
    confidence: Annotated[float, Form()] = 0.0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReportOut:
    raw_fields = _collect_form_fields(
        description, latitude, longitude, category, confidence
    )
    bounded_fields = enforce_report_field_bounds(raw_fields)
    try:
        image_url = validate_and_save_image(image)
    except ImageValidationError as failure:
        raise HTTPException(
            status_code=failure.status_code, detail=failure.message
        ) from None

    resolved_description = bounded_fields.description or "Laporan sampah mobile"
    resolved_category = (
        bounded_fields.category.value
        if bounded_fields.category is not None
        else ReportCategory.organic.value
    )
    resolved_confidence = (
        bounded_fields.confidence if bounded_fields.confidence is not None else 0.0
    )
    resolved_latitude = (
        bounded_fields.latitude if bounded_fields.latitude is not None else 0.0
    )
    resolved_longitude = (
        bounded_fields.longitude if bounded_fields.longitude is not None else 0.0
    )

    new_report = WasteReport(
        user_id=current_user.id,
        image_url=image_url,
        category=resolved_category,
        confidence=resolved_confidence,
        description=resolved_description,
        latitude=resolved_latitude,
        longitude=resolved_longitude,
        status=ReportStatus.pending.value,
    )
    db.add(new_report)
    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        delete_report_image(image_url)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=SAVE_FAILED_MESSAGE,
        ) from None
    db.refresh(new_report)

    rendered = render_report(new_report)
    rendered.reporter_name = current_user.name
    return rendered


@router.put("/{report_id}", response_model=ReportOut)
@limiter.limit("20/minute")
def update_report(
    request: Request,
    report_id: uuid.UUID,
    image: UploadFile | None = File(None),
    description: str | None = Form(None),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    category: ReportCategory | None = Form(None),
    confidence: float | None = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReportOut:
    report = find_report(db, report_id, current_user)
    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=NOT_FOUND_MESSAGE
        )

    raw_fields = _collect_form_fields(
        description, latitude, longitude, category, confidence
    )
    bounded_fields = enforce_report_field_bounds(raw_fields)
    if bounded_fields.description is not None:
        report.description = bounded_fields.description
    if bounded_fields.latitude is not None:
        report.latitude = bounded_fields.latitude
    if bounded_fields.longitude is not None:
        report.longitude = bounded_fields.longitude
    if bounded_fields.category is not None:
        report.category = bounded_fields.category.value
    if bounded_fields.confidence is not None:
        report.confidence = bounded_fields.confidence

    old_image_url = None
    new_image_url = None
    if image is not None and bool(image.filename):
        try:
            new_image_url = validate_and_save_image(image)
        except ImageValidationError as failure:
            raise HTTPException(
                status_code=failure.status_code, detail=failure.message
            ) from None
        old_image_url = report.image_url
        report.image_url = new_image_url

    try:
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        if new_image_url is not None:
            delete_report_image(new_image_url)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=UPDATE_FAILED_MESSAGE,
        ) from None
    db.refresh(report)
    if old_image_url is not None:
        delete_report_image(old_image_url)
    return render_report(report)


@router.patch("/{report_id}/status", response_model=ReportOut)
@limiter.limit("20/minute")
def update_report_status(
    request: Request,
    report_id: uuid.UUID,
    body_status: StatusIn,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
) -> ReportOut:
    report = find_report(db, report_id, current_user)
    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=NOT_FOUND_MESSAGE
        )

    report.status = body_status.status.value
    db.commit()
    db.refresh(report)
    return render_report(report)


@router.delete("/{report_id}", status_code=204)
@limiter.limit("20/minute")
def remove_report(
    request: Request,
    report_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    report = find_report(db, report_id, current_user)
    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=NOT_FOUND_MESSAGE
        )

    image_url = report.image_url
    db.delete(report)
    db.commit()
    delete_report_image(image_url)
