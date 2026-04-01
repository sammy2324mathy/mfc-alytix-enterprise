"""
MFCALYTIX AI Service — multi-agent chat, knowledge management, and model configuration.
"""

import logging
import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from src.api.routes import router
from src.core.database import Base, engine

from security import (
    SecurityHeadersMiddleware,
    RateLimitMiddleware,
    RequestValidationMiddleware,
    AuditLogMiddleware,
)

logger = logging.getLogger("ai-service")

ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else ["*"]
TRUSTED_HOSTS = os.getenv("TRUSTED_HOSTS", "*").split(",")


def create_app() -> FastAPI:
    Base.metadata.create_all(bind=engine)

    app = FastAPI(
        title="MFCALYTIX AI Service",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Security middleware
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(AuditLogMiddleware)
    app.add_middleware(RateLimitMiddleware, requests_per_minute=100, burst_size=15)
    app.add_middleware(RequestValidationMiddleware)
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=TRUSTED_HOSTS)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
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
        return {"service": "ai-service", "status": "ok", "version": app.version, "database": db_status}

    app.include_router(router, prefix="/ai")
    return app


app = create_app()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8006, reload=True)
