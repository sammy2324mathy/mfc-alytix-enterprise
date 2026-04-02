from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
import datetime

router = APIRouter()

class ValuationRecord(BaseModel):
    valuation_id: str
    status: str
    date_performed: str
    bel: float
    ra: float
    csm: float
    reviewer: str = "Chief Actuary"

VALUATIONS = [
    ValuationRecord(valuation_id="VAL-2025-Q1-01", status="Finalized", date_performed="2025-03-15", bel=142000000.0, ra=4200000.0, csm=12000000.0),
    ValuationRecord(valuation_id="VAL-2025-Q1-02", status="Draft", date_performed="2025-04-01", bel=143200000.0, ra=4350000.0, csm=12400000.0),
    ValuationRecord(valuation_id="VAL-2024-YE", status="Finalized", date_performed="2024-12-31", bel=138000000.0, ra=4100000.0, csm=11500000.0),
]

@router.get("/list", response_model=List[ValuationRecord])
def list_valuations():
    """Return all historical valuations."""
    return VALUATIONS

@router.post("/{valuation_id}/review", response_model=ValuationRecord)
def review_valuation(valuation_id: str, reviewer: str = "Chief Actuary"):
    """Peer review a valuation record."""
    for v in VALUATIONS:
        if v.valuation_id == valuation_id:
            v.status = "Finalized"
            v.reviewer = reviewer
            return v
    raise HTTPException(status_code=404, detail="Valuation record not found")
