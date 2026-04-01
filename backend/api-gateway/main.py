"""
MFCALYTIX API Gateway — single entry for the SPA and external clients.

Proxies preserve each service's URL prefix (/auth, /accounting, …). Uses a shared httpx client with
timeouts, strips hop-by-hop headers, and returns structured 502s when upstreams are unreachable.
"""

from __future__ import annotations

import asyncio
import logging
import time
import uuid
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from typing import Deque, Dict

import httpx
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from config import GatewayConfig, load_config

logger = logging.getLogger("api-gateway")
config: GatewayConfig = load_config()

request_log: Dict[str, Deque[float]] = defaultdict(deque)

# Hop-by-hop headers must not be forwarded from upstream (RFC 7230).
HOP_BY_HOP = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
}


def _filter_response_headers(headers: httpx.Headers) -> Dict[str, str]:
    out: Dict[str, str] = {}
    for key, value in headers.items():
        if key.lower() in HOP_BY_HOP:
            continue
        out[key] = value
    return out


def _upstream_url(target_base: str, service_mount: str, full_path: str) -> str:
    base = target_base.rstrip("/")
    mount = service_mount if service_mount.startswith("/") else f"/{service_mount}"
    fp = full_path or ""
    if fp and not fp.startswith("/"):
        fp = f"/{fp}"
    return f"{base}{mount}{fp}"


async def proxy(request: Request, target_base: str, service_mount: str, full_path: str) -> Response:
    url = _upstream_url(target_base, service_mount, full_path)
    client: httpx.AsyncClient = request.app.state.http_client

    headers = dict(request.headers)
    headers.pop("host", None)
    rid = request.headers.get("x-request-id") or str(uuid.uuid4())
    headers["x-request-id"] = rid

    try:
        resp = await client.request(
            request.method,
            url,
            params=request.query_params,
            headers=headers,
            content=await request.body(),
        )
    except httpx.RequestError as exc:
        logger.warning("Upstream request failed: %s %s — %s", request.method, url, exc)
        return JSONResponse(
            status_code=502,
            content={
                "detail": "Bad gateway: upstream service unavailable or timed out",
                "upstream": target_base,
                "path": f"{service_mount}{full_path or ''}",
            },
            headers={"x-request-id": rid},
        )

    return Response(
        content=resp.content,
        status_code=resp.status_code,
        headers=_filter_response_headers(resp.headers),
        media_type=resp.headers.get("content-type"),
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    timeout = httpx.Timeout(
        connect=config.upstream_connect_timeout,
        read=config.upstream_read_timeout,
        write=config.upstream_read_timeout,
        pool=5.0,
    )
    async with httpx.AsyncClient(timeout=timeout, follow_redirects=False) as client:
        app.state.http_client = client
        logger.info("API gateway started; upstream timeouts connect=%ss read=%ss", config.upstream_connect_timeout, config.upstream_read_timeout)
        yield
    logger.info("API gateway shutdown")


app = FastAPI(
    title="MFCALYTIX API Gateway",
    description="Unified Entry Point for the MFC ALYTIX Enterprise Platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        rid = request.headers.get("x-request-id") or str(uuid.uuid4())
        request.state.request_id = rid
        response = await call_next(request)
        response.headers["x-request-id"] = rid
        return response


app.add_middleware(RequestIdMiddleware)


MAX_BODY_BYTES = 10 * 1024 * 1024  # 10 MB


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Inject OWASP-recommended security headers into every response."""

    async def dispatch(self, request: Request, call_next):
        # Reject oversized request bodies early
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > MAX_BODY_BYTES:
            return JSONResponse(
                status_code=413,
                content={"detail": "Request body too large"},
            )

        response = await call_next(request)

        # --- Security headers ---
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=(), payment=()"
        )
        response.headers["Strict-Transport-Security"] = (
            "max-age=63072000; includeSubDomains; preload"
        )
        response.headers["Cache-Control"] = "no-store"
        response.headers["Pragma"] = "no-cache"
        # Remove server identity leakage
        if "server" in response.headers:
            del response.headers["server"]
        return response


app.add_middleware(SecurityHeadersMiddleware)


async def rate_limit(request: Request):
    if request.url.path in ("/health", "/healthz", "/readyz"):
        return
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    window = request_log[ip]
    window.append(now)
    while window and window[0] < now - config.rate_limit_window_seconds:
        window.popleft()
    if len(window) > config.rate_limit_requests:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")


@app.middleware("http")
async def apply_rate_limit(request: Request, call_next):
    try:
        await rate_limit(request)
    except HTTPException as exc:
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
    return await call_next(request)


async def _probe_health(client: httpx.AsyncClient, base_url: str, name: str) -> dict:
    url = f"{base_url.rstrip('/')}/health"
    try:
        r = await client.get(url, timeout=3.0)
        body = None
        if r.headers.get("content-type", "").startswith("application/json"):
            try:
                body = r.json()
            except Exception:
                body = r.text[:200]
        return {"service": name, "url": base_url, "status_code": r.status_code, "ok": r.status_code == 200, "body": body}
    except Exception as exc:
        return {"service": name, "url": base_url, "ok": False, "error": str(exc)}


@app.get("/health")
async def health(request: Request, deep: bool = False):
    """Liveness. Use ?deep=1 to probe critical upstream /health endpoints (parallel)."""
    out = {
        "status": "ok",
        "service": "api-gateway",
        "version": app.version,
    }
    if not deep:
        return out

    client: httpx.AsyncClient = request.app.state.http_client
    probes = [
        _probe_health(client, config.auth_service_url, "auth-service"),
        _probe_health(client, config.accounting_service_url, "accounting-service"),
        _probe_health(client, config.actuarial_service_url, "actuarial-service"),
        _probe_health(client, config.ai_service_url, "ai-service"),
    ]
    results = await asyncio.gather(*probes)
    out["upstream"] = list(results)
    out["degraded"] = any(not r.get("ok") for r in results if isinstance(r, dict))
    return out


@app.get("/readyz")
async def readyz():
    """Kubernetes-style name: gateway process is up (does not guarantee all backends)."""
    return {"ready": True}


# --- Proxies (mount prefix restored for each downstream app) ---


@app.api_route("/auth{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def auth_proxy(request: Request, full_path: str):
    return await proxy(request, config.auth_service_url, "/auth", full_path)


@app.api_route("/accounting{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def accounting_proxy(request: Request, full_path: str):
    return await proxy(request, config.accounting_service_url, "/accounting", full_path)


@app.api_route("/actuarial{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def actuarial_proxy(request: Request, full_path: str):
    return await proxy(request, config.actuarial_service_url, "/actuarial", full_path)


@app.api_route("/risk{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def risk_proxy(request: Request, full_path: str):
    return await proxy(request, config.risk_service_url, "/risk", full_path)




@app.api_route("/ai{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def ai_proxy(request: Request, full_path: str):
    return await proxy(request, config.ai_service_url, "/ai", full_path)


@app.api_route("/compliance{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def compliance_proxy(request: Request, full_path: str):
    return await proxy(request, config.compliance_service_url, "/compliance", full_path)


@app.api_route("/workspace{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def workspace_proxy(request: Request, full_path: str):
    return await proxy(request, config.workspace_service_url, "/workspace", full_path)


@app.api_route("/ds{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def ds_proxy(request: Request, full_path: str):
    return await proxy(request, config.data_science_service_url, "/ds", full_path)


@app.api_route("/excel{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def excel_proxy(request: Request, full_path: str):
    return await proxy(request, config.excel_engine_service_url, "/excel", full_path)
