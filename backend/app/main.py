import asyncio
import logging
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from sqlalchemy import text

from app.config import get_settings
from app.database import SessionLocal, engine
from app.models import Base, RevokedToken
from app.rate_limit import limiter, rate_limit_exceeded_handler
from app.routers import (
    auth,
    client_errors,
    csp_report,
    ml,
    report_changes,
    reports,
    users,
)
from app.token_blocklist import purge, run_token_purge_loop

logger = logging.getLogger("app.main")
settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    # Fail fast: produksi wajib cookie secure.
    if os.getenv("ENV", "").lower() == "production" and not settings.cookie_secure:
        raise RuntimeError("COOKIE_SECURE harus true di produksi.")

    # Tabel blacklist token dibuat on-boot agar DB lama tanpa init.sql tetap jalan.
    Base.metadata.create_all(
        bind=engine, tables=[RevokedToken.__table__], checkfirst=True
    )
    # Migration idempotent: kolom effective_at (grace window rotation).
    with engine.connect() as conn:
        conn.execute(
            text(
                "ALTER TABLE revoked_tokens "
                "ADD COLUMN IF NOT EXISTS effective_at TIMESTAMPTZ NOT NULL DEFAULT now()"
            )
        )
        conn.commit()

    # Purge token kedaluwarsa saat startup & jalankan background task periodik (R55)
    with SessionLocal() as db:
        purge(db)
    purge_task = asyncio.create_task(run_token_purge_loop())
    yield
    purge_task.cancel()


app = FastAPI(title="Smart Waste Management API", version="0.1.0", lifespan=lifespan)


@app.exception_handler(RequestValidationError)
def show_validation_errors(request, exc: RequestValidationError) -> JSONResponse:
    logger.warning("validation error: %s", jsonable_encoder(exc.errors()))
    return JSONResponse(
        status_code=422,
        content={
            "message": "Data yang dikirim tidak valid. Periksa kembali isian form."
        },
    )


app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

CORS_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
CORS_HEADERS = ["Content-Type", "Authorization", "Accept"]

if settings.cors_allow_all:
    # Escape hatch debug lokal saja: CORS terbuka TANPA credentials
    # (cookie antar-origin tidak mungkin lewat mode ini).
    logger.warning(
        "CORS_ALLOW_ALL aktif: allow-origin regex '.*' TANPA credentials. "
        "Jangan dipakai di produksi."
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=".*",
        allow_credentials=False,
        allow_methods=CORS_METHODS,
        allow_headers=CORS_HEADERS,
    )
else:
    allowed_origins = settings.cors_origin_list or ["http://localhost:3000"]
    logger.info("CORS whitelist: %s", allowed_origins)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=CORS_METHODS,
        allow_headers=CORS_HEADERS,
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
    csp_report.router,
    client_errors.router,
):
    app.include_router(router_block)


@app.get("/")
def read_service_status() -> dict[str, str]:
    return {"status": "ok", "version": "0.1.0"}
