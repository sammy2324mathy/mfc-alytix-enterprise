from fastapi import APIRouter, Depends
from shared.auth import get_current_user_claims
from .calculators import router as calc_router
from .mortality import router as mortality_router
from .survival import router as survival_router
from .pricing import router as pricing_router
from .projections import router as projections_router
from .policy_modeling import router as policy_router
from .profit_testing import router as profit_router
from .scenarios import router as scenario_router
from .alm import router as alm_router
from .capital import router as capital_router
from .regulatory import router as regulatory_router
from .claims_autopilot import router as claims_router
from .valuations import router as valuation_router

router = APIRouter(dependencies=[Depends(get_current_user_claims)])
router.include_router(calc_router, prefix="/calculators", tags=["calculators"])
router.include_router(mortality_router, prefix="/mortality", tags=["mortality"])
router.include_router(survival_router, prefix="/survival", tags=["survival"])
router.include_router(pricing_router, prefix="/pricing", tags=["pricing"])
router.include_router(projections_router, prefix="/projections", tags=["projections"])
router.include_router(policy_router, prefix="/policy", tags=["policy-modeling"])
router.include_router(profit_router, prefix="/financial", tags=["profit-testing"])
router.include_router(scenario_router, prefix="/scenarios", tags=["scenarios"])
router.include_router(alm_router, prefix="/alm", tags=["asset-liability"])
router.include_router(capital_router, prefix="/capital", tags=["capital-modeling"])
router.include_router(regulatory_router, prefix="/regulatory", tags=["regulatory"])
router.include_router(claims_router, prefix="/claims-autopilot", tags=["claims-autopilot"])
router.include_router(valuation_router, prefix="/valuations", tags=["valuations"])
