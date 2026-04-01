import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from src.api.routes import router as api_router
from src.core.database import engine
from src import models  # noqa: F401 ensures models are registered before create_all

from security import (
    SecurityHeadersMiddleware,
    RateLimitMiddleware,
    RequestValidationMiddleware,
    AuditLogMiddleware,
)

import os
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else ["*"]
TRUSTED_HOSTS = os.getenv("TRUSTED_HOSTS", "*").split(",")


def create_app() -> FastAPI:
    app = FastAPI(
        title="MFCALYTIX Auth Service",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Security middleware
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(AuditLogMiddleware)
    app.add_middleware(RateLimitMiddleware, requests_per_minute=100)
    app.add_middleware(RequestValidationMiddleware)
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=TRUSTED_HOSTS)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health():
        return {"service": "auth-service", "status": "ok", "version": app.version}

    @app.get("/ready")
    def ready():
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
        except Exception as exc:
            return JSONResponse(
                status_code=503,
                content={"ready": False, "database": "unavailable", "detail": str(exc)},
            )
        return {"ready": True, "database": "ok"}

    app.include_router(api_router, prefix="/auth")
    return app


app = create_app()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
