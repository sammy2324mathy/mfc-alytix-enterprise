from fastapi import APIRouter, Depends
from shared.auth import get_current_user_claims
from .simulations import router as sim_router
from .metrics import router as metrics_router
from .stress_tests import router as stress_router
from .capital import router as capital_router
from .appetite import router as appetite_router
from .risk_limits import router as limits_router
from .reinsurance import router as reinsurance_router

router = APIRouter(dependencies=[Depends(get_current_user_claims)])
router.include_router(sim_router, prefix="/simulations", tags=["simulations"])
router.include_router(metrics_router, prefix="/metrics", tags=["metrics"])
router.include_router(stress_router, prefix="/stress-tests", tags=["stress-tests"])
router.include_router(capital_router, prefix="/capital", tags=["capital"])
router.include_router(appetite_router, prefix="/appetite", tags=["appetite"])
router.include_router(limits_router, prefix="/risk-limits", tags=["risk-limits"])
router.include_router(reinsurance_router, prefix="/reinsurance", tags=["reinsurance"])
