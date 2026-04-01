from fastapi import APIRouter, HTTPException, Depends
import numpy as np
from typing import Dict, List, Optional

from src.models.portfolio import PortfolioRiskRequest
from src.metrics.var import RiskMetrics
from shared.auth import get_current_user_claims

router = APIRouter(dependencies=[Depends(get_current_user_claims)])

def _extract_returns_matrix(req: PortfolioRiskRequest) -> np.ndarray:
    try:
        returns_matrix = np.array([asset.returns for asset in req.assets])
        if len(returns_matrix) == 0 or returns_matrix.shape[1] < 2:
            raise ValueError
        return returns_matrix
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid historical return data. Must be uniform across assets.")

@router.post("/var/parametric")
def parametric_var(req: PortfolioRiskRequest):
    weights = np.array([asset.weight for asset in req.assets])
    returns_matrix = _extract_returns_matrix(req)
    cov_matrix = np.cov(returns_matrix)
    
    var = RiskMetrics.parametric_var(req.portfolio_value, weights, cov_matrix, req.confidence_level, req.time_horizon_days)
    return {"method": "Parametric VaR", "value": var, "currency": "USD"}

@router.post("/var/historical")
def historical_var(req: PortfolioRiskRequest):
    returns_matrix = _extract_returns_matrix(req)
    weights = np.array([asset.weight for asset in req.assets])
    port_returns = np.dot(weights, returns_matrix)
    
    var = RiskMetrics.historical_var(req.portfolio_value, port_returns, req.confidence_level, req.time_horizon_days)
    return {"method": "Historical VaR", "value": var, "currency": "USD"}

@router.post("/cvar/historical")
def conditional_var(req: PortfolioRiskRequest):
    returns_matrix = _extract_returns_matrix(req)
    weights = np.array([asset.weight for asset in req.assets])
    port_returns = np.dot(weights, returns_matrix)
    
    cvar = RiskMetrics.conditional_var(req.portfolio_value, port_returns, req.confidence_level, req.time_horizon_days)
    return {"method": "Conditional VaR (ES)", "value": cvar, "currency": "USD"}
