"""Model Deployment API — production model registry, health, and drift monitoring."""

from fastapi import APIRouter, Depends
from typing import List

from src.api.schemas.ds_schemas import ModelDeployment
from shared.auth import get_current_user_claims
from src.model_registry.registry import registry

router = APIRouter(dependencies=[Depends(get_current_user_claims)])

DEPLOYMENTS: List[ModelDeployment] = [
    ModelDeployment(model_id="MDL-014", name="Fraud Detection (Isolation Forest)", version="v3.1", endpoint="/ds/fraud/score", latency_ms=45, requests_daily="12,400", drift_status="stable", health="healthy"),
    ModelDeployment(model_id="MDL-015", name="Risk Scoring (XGBoost)", version="v4.2", endpoint="/ds/risk/score", latency_ms=32, requests_daily="28,100", drift_status="stable", health="healthy"),
    ModelDeployment(model_id="MDL-016", name="Churn Prediction (LightGBM)", version="v2.0", endpoint="/ds/predictions/churn", latency_ms=28, requests_daily="8,500", drift_status="minor drift", health="warning"),
    ModelDeployment(model_id="MDL-017", name="Claims Severity (GBRT)", version="v2.4", endpoint="/ds/claims/severity", latency_ms=38, requests_daily="5,200", drift_status="stable", health="healthy"),
    ModelDeployment(model_id="MDL-018", name="Premium Optimizer (GLM+RF)", version="v3.1", endpoint="/ds/pricing/optimize", latency_ms=52, requests_daily="15,800", drift_status="stable", health="healthy"),
    ModelDeployment(model_id="MDL-019", name="Customer Segmentation (K-Means)", version="v1.5", endpoint="/ds/customers/segments", latency_ms=120, requests_daily="2,100", drift_status="stable", health="healthy"),
    ModelDeployment(model_id="MDL-020", name="NLP Claims Triage (BERT)", version="v1.0", endpoint="/ds/claims/triage", latency_ms=180, requests_daily="3,400", drift_status="stable", health="healthy"),
]


@router.get("/registry", response_model=List[ModelDeployment])
def list_deployed_models():
    return DEPLOYMENTS


@router.get("/{model_id}/health")
def model_health(model_id: str):
    for m in DEPLOYMENTS:
        if m.model_id == model_id:
            return {
                "model_id": m.model_id,
                "name": m.name,
                "health": m.health,
                "latency_ms": m.latency_ms,
                "drift_status": m.drift_status,
                "uptime_pct": 99.7 if m.health == "healthy" else 95.2,
                "last_retrained": "2025-12-15",
                "next_scheduled_retrain": "2026-03-30",
            }
    return {"error": "Model not found"}


@router.get("/legacy")
def list_legacy_models():
    """List models from the in-memory registry (backward compat)."""
    return registry.list_models()
