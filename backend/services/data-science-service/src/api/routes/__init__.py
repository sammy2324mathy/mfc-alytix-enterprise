from fastapi import APIRouter
from .models import router as models_router
from .features import router as features_router
from .pipelines import router as pipelines_router
from .risk_scoring import router as risk_scoring_router
from . import (
    claims, customers, dashboards, deployment, features, fraud,
    governance, models, pipelines, predictions, pricing, risk_scoring,
 #   statistics, execution, regression, clustering, anomaly, timeseries, bayesian, lab
    execution, lab
)

router = APIRouter()
router.include_router(models.router, prefix="/models", tags=["models"])
router.include_router(features.router, prefix="/features", tags=["features"])
router.include_router(pipelines.router, prefix="/pipelines", tags=["pipelines"])
router.include_router(risk_scoring.router, prefix="/risk-scoring", tags=["risk-scoring"])
router.include_router(pricing.router, prefix="/pricing", tags=["pricing"])
router.include_router(fraud.router, prefix="/fraud", tags=["fraud"])
router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
router.include_router(customers.router, prefix="/customers", tags=["customers"])
router.include_router(claims.router, prefix="/claims", tags=["claims"])
router.include_router(dashboards.router, prefix="/dashboards", tags=["dashboards"])
router.include_router(deployment.router, prefix="/deployment", tags=["deployment"])
router.include_router(governance.router, prefix="/governance", tags=["governance"])
# router.include_router(statistics.router, prefix="/statistics", tags=["statistics"])
router.include_router(execution.router, prefix="/execution", tags=["execution"])
# router.include_router(regression.router, prefix="/regression", tags=["regression"])
# router.include_router(clustering.router, prefix="/clustering", tags=["clustering"])
# router.include_router(anomaly.router, prefix="/anomaly", tags=["anomaly-detection"])
# router.include_router(timeseries.router, prefix="/timeseries", tags=["time-series"])
# router.include_router(bayesian.router, prefix="/bayesian", tags=["bayesian"])
router.include_router(lab.router, prefix="/lab", tags=["lab"])
