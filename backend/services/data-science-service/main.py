"""
MFCALYTIX Data Science Service — ML pipelines, fraud detection, predictions, customer analytics,
model deployment, and data governance.
"""

import logging
import os
import traceback

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

from src.api.routes import router
from src.core.database import Base, engine

from security import (
    SecurityHeadersMiddleware,
    RateLimitMiddleware,
    RequestValidationMiddleware,
    AuditLogMiddleware,
)

logger = logging.getLogger("data-science-service")

ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else ["*"]
TRUSTED_HOSTS = os.getenv("TRUSTED_HOSTS", "*").split(",")


def create_app() -> FastAPI:
    Base.metadata.create_all(bind=engine)

    app = FastAPI(
        title="MFCALYTIX Data Science Service",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Security middleware
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(AuditLogMiddleware)
    app.add_middleware(RateLimitMiddleware, requests_per_minute=150, burst_size=25)
    app.add_middleware(RequestValidationMiddleware)
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=TRUSTED_HOSTS)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        logger.warning("Validation error: %s — %s", request.url.path, exc)
        return JSONResponse(
            status_code=422,
            content={"detail": str(exc), "code": "validation_error"},
        )

    @app.exception_handler(Exception)
    async def global_error_handler(request: Request, exc: Exception):
        logger.error(
            "Unhandled error on %s: %s\n%s",
            request.url.path,
            exc,
            traceback.format_exc(),
        )
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal data-science engine error", "code": "internal_error"},
        )

    @app.get("/health")
    def health():
        from src.core.database import SessionLocal
        try:
            db = SessionLocal()
            db.execute("SELECT 1")
            db.close()
            db_status = "connected"
        except Exception:
            db_status = "unavailable"
        return {"service": "data-science-service", "status": "ok", "version": app.version, "database": db_status}

    app.include_router(router, prefix="/ds")
    return app


app = create_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8009, reload=True)
