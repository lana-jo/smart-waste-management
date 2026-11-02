from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.routers import auth, ml, report_changes, reports, users

settings = get_settings()

app = FastAPI(title="Smart Waste Management API", version="0.1.0")


@app.exception_handler(RequestValidationError)
def show_validation_errors(request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "message": "Data yang dikirim tidak valid. Periksa kembali isian form.",
            "errors": jsonable_encoder(exc.errors()),
        },
    )


if settings.cors_allow_all:
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=".*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    allowed_origins = [
        origin.strip()
        for origin in settings.cors_origins_csv.split(",")
        if origin.strip()
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

upload_root = settings.upload_root
upload_root.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_root), name="uploads")

for router_block in (
    auth.router,
    reports.router,
    report_changes.router,
    users.router,
    ml.router,
):
    app.include_router(router_block)


@app.get("/")
def read_service_status() -> dict[str, str]:
    return {"status": "ok", "version": "0.1.0"}
