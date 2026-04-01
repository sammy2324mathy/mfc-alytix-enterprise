"""
Central configuration for the API gateway. Override via environment variables in Docker or local runs.
"""

import os
from dataclasses import dataclass


def _env(name: str, default: str) -> str:
    return os.getenv(name, default).rstrip("/")


@dataclass(frozen=True)
class GatewayConfig:
    auth_service_url: str
    accounting_service_url: str
    actuarial_service_url: str
    risk_service_url: str
    ai_service_url: str
    compliance_service_url: str
    workspace_service_url: str
    data_science_service_url: str
    excel_engine_service_url: str
    # HTTP client
    upstream_connect_timeout: float = 5.0
    upstream_read_timeout: float = 120.0
    # Rate limit (per IP)
    rate_limit_requests: int = 120
    rate_limit_window_seconds: int = 60
    # CORS
    cors_allow_origins: str = "*"


def load_config() -> GatewayConfig:
    return GatewayConfig(
        auth_service_url=_env("AUTH_SERVICE_URL", "http://auth-service:8001"),
        accounting_service_url=_env("ACCOUNTING_SERVICE_URL", "http://accounting-service:8002"),
        actuarial_service_url=_env("ACTUARIAL_SERVICE_URL", "http://actuarial-service:8004"),
        risk_service_url=_env("RISK_SERVICE_URL", "http://risk-service:8003"),
        ai_service_url=_env("AI_SERVICE_URL", "http://ai-service:8006"),
        compliance_service_url=_env("COMPLIANCE_SERVICE_URL", "http://compliance-service:8007"),
        workspace_service_url=_env("WORKSPACE_SERVICE_URL", "http://workspace-service:8008"),
        data_science_service_url=_env("DATA_SCIENCE_SERVICE_URL", "http://data-science-service:8009"),
        excel_engine_service_url=_env("EXCEL_ENGINE_SERVICE_URL", "http://excel-engine-service:8010"),
        upstream_connect_timeout=float(os.getenv("GATEWAY_UPSTREAM_CONNECT_TIMEOUT", "5")),
        upstream_read_timeout=float(os.getenv("GATEWAY_UPSTREAM_READ_TIMEOUT", "120")),
        rate_limit_requests=int(os.getenv("GATEWAY_RATE_LIMIT", "120")),
        rate_limit_window_seconds=int(os.getenv("GATEWAY_RATE_WINDOW", "60")),
        cors_allow_origins=os.getenv("CORS_ORIGINS", "*"),
    )
