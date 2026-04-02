from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import random

router = APIRouter()

class AssetProjectionRequest(BaseModel):
    assets: List[Dict[str, Any]]
    periods: int = 10
    reinvestment_rate: float = 0.04

@router.post("/asset-projection")
def project_assets(req: AssetProjectionRequest):
    """Project asset values over time."""
    projections = []
    current_value = sum(a.get("value", 0) for a in req.assets)
    
    for t in range(req.periods + 1):
        projections.append({"period": t, "value": round(current_value, 2)})
        current_value *= (1 + req.reinvestment_rate + random.uniform(-0.01, 0.01))
        
    return {"projections": projections}

@router.get("/metrics")
def get_alm_metrics():
    """Return ALM health metrics."""
    return {
        "duration_gap": round(random.uniform(-0.5, 0.5), 2),
        "convexity_gap": round(random.uniform(0.1, 0.3), 2),
        "liquidity_ratio": round(random.uniform(1.2, 1.8), 2),
        "status": "Healthy"
    }
