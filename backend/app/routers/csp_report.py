"""Penerima report CSP violation dari frontend-web.

Tanpa auth + rate limit 30/menit per IP (limiter global app.rate_limit,
key_func _client_ip anti-spoof X-Forwarded-For). Body mentah TIDAK disimpan
(bisa mengandung token/nonce bocor); hanya directive + path dokumen yang
masuk log.
"""

import json
import logging
from urllib.parse import urlparse

from fastapi import APIRouter, Request, Response

from app.rate_limit import limiter

router = APIRouter(prefix="/api", tags=["Security"])
logger = logging.getLogger("app.csp")

MAX_BYTES = 10 * 1024


def _trim(value: str, width: int) -> str:
    cleaned = "".join(value.split()) or "-"
    return cleaned[:width]


@router.post("/csp-report", status_code=204)
@limiter.limit("30/minute")
async def receive_csp_report(request: Request) -> Response:
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
        logger.warning("csp-report invalid-json")
        return Response(status_code=204)

    report = payload.get("csp-report") if isinstance(payload, dict) else None
    if not isinstance(report, dict) or not report:
        logger.warning("csp-report empty")
        return Response(status_code=204)

    directive = report.get("effective-directive") or report.get(
        "violated-directive", ""
    )
    document_path = urlparse(str(report.get("document-uri", ""))).path
    logger.info(
        "csp-report directive=%s path=%s",
        _trim(str(directive), 120),
        _trim(str(document_path), 200),
    )
    return Response(status_code=204)
