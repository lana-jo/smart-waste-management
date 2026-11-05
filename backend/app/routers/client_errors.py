"""Penerima laporan error JavaScript dari frontend (beacon browser).

Tanpa auth + light rate limit (30/menit per IP). Body mentah TIDAK disimpan —
message/stack bisa memuat token atau path internal; hanya field terpilih yang
di-trim masuk log. Selalu balas 204 (termasuk body rusak) agar beacon
browser tidak memicu retry.
"""

import json
import logging
from urllib.parse import urlparse

from fastapi import APIRouter, Request, Response

from app.rate_limit import limiter

router = APIRouter(prefix="/api", tags=["Monitoring"])
logger = logging.getLogger("app.client_errors")

MAX_BYTES = 10 * 1024


def _trim(value: str, width: int) -> str:
    cleaned = "".join(value.split()) or "-"
    return cleaned[:width]


def _int_or_dash(value: object) -> str:
    """Cast aman lineno/colno jadi label log; '-' bila bukan angka."""
    if not isinstance(value, (int, float, str)):
        return "-"
    try:
        return str(int(value))
    except (ValueError, OverflowError):
        # OverflowError: json.loads menerima Infinity, int(inf) lempar ini.
        return "-"


@router.post("/client-errors", status_code=204)
@limiter.limit("30/minute")
async def receive_client_error(request: Request) -> Response:
    # Baca inkremental, bukan precheck content-length + body(): request
    # chunked/tanpa header itu bisa bypass precheck dan mem-buffer
    # seluruh body ke RAM sebelum cek 10KB (temuan QA HIGH).
    chunks: list[bytes] = []
    total = 0
    async for chunk in request.stream():
        total += len(chunk)
        if total > MAX_BYTES:
            return Response(status_code=413)
        chunks.append(chunk)
    body = b"".join(chunks)

    try:
        payload = json.loads(body) if body else None
    except (ValueError, json.JSONDecodeError):
        logger.warning("client-error invalid-json")
        return Response(status_code=204)

    if not isinstance(payload, dict) or not payload:
        logger.warning("client-error empty")
        return Response(status_code=204)

    logger.info(
        "client-error type=%s msg=%s src=%s:%s:%s path=%s stack=%s",
        _trim(str(payload.get("type", "")), 20),
        _trim(str(payload.get("message", "")), 300),
        _trim(str(payload.get("source", "")), 200),
        _int_or_dash(payload.get("lineno")),
        _int_or_dash(payload.get("colno")),
        # Hanya path dokumen yang diambil, query string dibuang.
        _trim(urlparse(str(payload.get("path", ""))).path, 200),
        _trim(str(payload.get("stack", "")), 1200),
    )
    return Response(status_code=204)
