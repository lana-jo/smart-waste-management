"""Rate limit anti-abuse: kunci per-token Bearer (per-praktis per-user, R47),
fallback ke IP untuk request tak ber-auth.

Storage: redis:// jika REDIS_URL diisi (bersama lintas worker uvicorn),
memory per-proses bila kosong (cukup untuk worker tunggal). Pesan 429
singkat tanpa detail internal (R75).
"""

import hashlib

from fastapi import Request
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from starlette.responses import JSONResponse, Response

from app.config import get_settings

RATE_LIMIT_MESSAGE = "Terlalu banyak percobaan. Coba lagi nanti."


def _client_ip(request: Request) -> str:
    settings = get_settings()
    trusted = set(settings.trusted_proxy_list)
    peer = request.client.host if request.client else ""
    # Jika peer bukan trusted proxy (atau tidak ada trusted proxy dikonfigurasi),
    # jangan pernah percaya header X-Forwarded-For untuk mencegah IP spoofing.
    if not trusted or peer not in trusted:
        return peer or "unknown"
    xff = request.headers.get("x-forwarded-for")
    if not xff:
        return peer
    candidates = [p.strip() for p in xff.split(",") if p.strip()]
    # Walk dari kanan, skip trusted proxies; pakai IP pertama yang tidak trusted.
    for ip in reversed(candidates):
        if ip not in trusted:
            return ip
    return candidates[0] if candidates else peer


def _limiter_key(request: Request) -> str:
    auth_header = request.headers.get("authorization") or ""
    if auth_header.lower().startswith("bearer "):
        raw_token = auth_header[len("bearer ") :].strip()
        if raw_token:
            # Hash agar token mentah tidak pernah jadi kunci storage (R62).
            digest = hashlib.sha256(raw_token.encode()).hexdigest()[:24]
            return f"user:{digest}"
    return _client_ip(request)


limiter = Limiter(
    key_func=_limiter_key,
    storage_uri=(get_settings().redis_url or None),
    default_limits=[],
)


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """Handler bawaan slowapi tapi pesan generik ramah pengguna."""
    response = JSONResponse({"detail": RATE_LIMIT_MESSAGE}, status_code=429)
    if request.app.state.limiter is not None and hasattr(request, "state"):
        pending_limit = getattr(request.state, "view_rate_limit", None)
        if pending_limit:
            response = limiter._inject_headers(response, pending_limit)
    return response
