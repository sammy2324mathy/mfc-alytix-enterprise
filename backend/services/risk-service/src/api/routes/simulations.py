from fastapi import APIRouter, HTTPException, Depends
import numpy as np

from src.models.portfolio import MonteCarloRequest
from src.api.schemas.risk_schemas import SimulationRequest, SimulationResult
from shared.auth import get_current_user_claims
from src.simulations.monte_carlo import MonteCarloEngine

router = APIRouter(dependencies=[Depends(get_current_user_claims)])

@router.post("/gbm")
def monte_carlo_gbm(req: MonteCarloRequest):
    try:
        returns_matrix = np.array([asset.returns for asset in req.assets])
        if len(returns_matrix) == 0 or returns_matrix.shape[1] < 2:
            raise ValueError
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid historical return data.")
        
    weights = np.array([asset.weight for asset in req.assets])
    port_returns = np.dot(weights, returns_matrix)
    
    mu = float(np.mean(port_returns))
    sigma = float(np.std(port_returns))
    
    paths = MonteCarloEngine.simulate_gbm(
        req.portfolio_value, mu, sigma, req.time_horizon_days, req.num_simulations
    )
    
    final_prices = paths[-1]
    expected_value = float(np.mean(final_prices))
    
    percentile = (1 - req.confidence_level) * 100
    worst_case = float(np.percentile(final_prices, percentile))
    mc_var = float(req.portfolio_value - worst_case)
    
    return {
        "method": "Monte Carlo GBM",
        "expected_portfolio_value": expected_value,
        "monte_carlo_var": mc_var,
        "currency": "USD"
    }
