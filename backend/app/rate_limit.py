"""Rate limit per-IP via slowapi 0.1.10 (verifikasi PyPI resmi 2026).

Catatan: storage memory berlaku per proses. Deployment multi-proses
(uvicorn --workers > 1) butuh storage bersama (redis://) sebelum dipakai;
ditandai TODO di bawah. Pesan 429 singkat tanpa detail internal (R75).
"""

from fastapi import Request
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from starlette.responses import JSONResponse, Response

from app.config import get_settings

# TODO(infra): ganti storage ke redis:// jika uvicorn dijalankan multi-worker.
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


limiter = Limiter(key_func=_client_ip, default_limits=[])


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """Handler bawaan slowapi tapi pesan generik ramah pengguna."""
    response = JSONResponse({"detail": RATE_LIMIT_MESSAGE}, status_code=429)
    if request.app.state.limiter is not None and hasattr(request, "state"):
        pending_limit = getattr(request.state, "view_rate_limit", None)
        if pending_limit:
            response = limiter._inject_headers(response, pending_limit)
    return response
