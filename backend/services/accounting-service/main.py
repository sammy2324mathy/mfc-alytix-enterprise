import logging
import os
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from security import (
    SecurityHeadersMiddleware,
    RateLimitMiddleware,
    RequestValidationMiddleware,
    AuditLogMiddleware,
)

from src.bootstrap.seed import seed_if_empty
from src.core.database import SessionLocal, engine
from src.interfaces.api import router as api_router
from src.infrastructure import models  # noqa: F401 ensures metadata is populated

logger = logging.getLogger("accounting-service")

TRUSTED_HOSTS = os.getenv("TRUSTED_HOSTS", "*").split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        seed_if_empty(db)
    except Exception as exc:
        logger.warning("Accounting seed skipped: %s", exc)
    finally:
        db.close()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="MFCALYTIX Accounting Service",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # Security middleware
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(AuditLogMiddleware)
    app.add_middleware(RequestValidationMiddleware)
    app.add_middleware(RateLimitMiddleware, requests_per_minute=100)
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=TRUSTED_HOSTS)

    @app.exception_handler(IntegrityError)
    async def integrity_handler(request: Request, exc: IntegrityError):
        logger.info("Integrity constraint: %s", exc)
        return JSONResponse(
            status_code=409,
            content={"detail": "Conflict with existing data (duplicate code or violated constraint)", "code": "integrity_error"},
        )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health():
        return {"service": "accounting-service", "status": "ok", "version": app.version}

    @app.get("/ready")
    def ready():
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
        except Exception as exc:
            logger.exception("Readiness check failed")
            return JSONResponse(
                status_code=503,
                content={"ready": False, "database": "unavailable", "detail": str(exc)},
            )
        return {"ready": True, "database": "ok"}

    app.include_router(api_router, prefix="/accounting")
    return app


app = create_app()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
