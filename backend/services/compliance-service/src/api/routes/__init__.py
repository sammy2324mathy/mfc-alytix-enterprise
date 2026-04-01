from fastapi import APIRouter, Depends
from shared.auth import get_current_user_claims
from .audit import router as audit_router
from .regulations import router as regulations_router
from .policies import router as policies_router
from .filings import router as filings_router
from .signoff import router as signoff_router
from .rules import router as rules_router
from .telemetry import router as telemetry_router
from .reporting import router as reporting_router

router = APIRouter(dependencies=[Depends(get_current_user_claims)])
router.include_router(audit_router, prefix="/audit", tags=["audit"])
router.include_router(regulations_router, prefix="/regulations", tags=["regulations"])
router.include_router(policies_router, prefix="/policies", tags=["policies"])
router.include_router(filings_router, prefix="/filings", tags=["filings"])
router.include_router(signoff_router, prefix="/signoff", tags=["signoff"])
router.include_router(rules_router, prefix="/rules", tags=["rules"])
router.include_router(telemetry_router, prefix="/telemetry", tags=["telemetry"])
router.include_router(reporting_router, prefix="/reporting", tags=["reporting"])
