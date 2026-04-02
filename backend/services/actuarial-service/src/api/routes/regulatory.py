from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import random

router = APIRouter()

class IFRS17Request(BaseModel):
    group_id: str
    pv_cashflows: float
    risk_adjustment: float
    csm: float = 0

@router.post("/ifrs17/gmm")
def ifrs17_gmm(req: IFRS17Request):
    """Calculate IFRS 17 General Measurement Model outcomes."""
    # Simplified logic: Insurance Contract Liability = fulfillment cash flows + CSM
    fcf = req.pv_cashflows + req.risk_adjustment
    total_liability = fcf + req.csm
    
    return {
        "group_id": req.group_id,
        "fulfillment_cash_flows": round(fcf, 2),
        "total_liability": round(total_liability, 2),
        "status": "Onerous" if total_liability > 0 and req.csm <= 0 else "Profitable",
        "timestamp": "2025-04-02T10:00:00Z"
    }

@router.get("/solvency-ii/disclosure")
def solvency_ii_disclosure():
    """Return Solvency II public disclosure template data."""
    return {
        "scr": 150000000.0,
        "eligible_own_funds": 280000000.0,
        "solvency_ratio": 1.86,
        "mcr": 45000000.0,
        "status": "Compliant"
    }
