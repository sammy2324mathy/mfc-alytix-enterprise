from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import random
import math
from pydantic import BaseModel

router = APIRouter()

class SimulationRequest(BaseModel):
    policy_count: int = 10000
    p_claim: float = 0.05
    severity_mean: float = 50000
    severity_sigma: float = 0.5

class SimulationResponse(BaseModel):
    total_claims: int
    total_incurred: float
    avg_severity: float
    max_claim: float
    loss_ratio: float
    distribution: List[Dict[str, float]]

@router.post("/claims-simulation", response_model=SimulationResponse)
def run_claims_simulation(req: SimulationRequest):
    """
    Perform a Monte Carlo simulation of insurance claims.
    Uses Log-normal distribution for severity.
    """
    total_claims = 0
    total_incurred = 0.0
    max_claim = 0.0
    sev_list = []

    # Simple Monte Carlo
    for _ in range(req.policy_count):
        if random.random() < req.p_claim:
            # Log-normal severity
            # Mean = exp(mu + sigma^2 / 2) => mu = ln(Mean) - sigma^2 / 2
            mu = math.log(req.severity_mean) - (req.severity_sigma ** 2) / 2
            severity = random.lognormvariate(mu, req.severity_sigma)
            
            total_claims += 1
            total_incurred += severity
            max_claim = max(max_claim, severity)
            sev_list.append(severity)

    avg_severity = total_incurred / total_claims if total_claims > 0 else 0
    # Simulate a premium of Mean Severity * Target P_Claim * 1.5 (Profit margin)
    simulated_premium = req.severity_mean * req.p_claim * 1.5 * req.policy_count
    loss_ratio = total_incurred / simulated_premium if simulated_premium > 0 else 0

    # Bucket the distribution for a chart
    buckets = 20
    if not sev_list:
        distribution = []
    else:
        min_s = 0
        max_s = max_claim
        step = max_s / buckets
        distribution = []
        for i in range(buckets):
            b_start = i * step
            b_end = (i + 1) * step
            count = sum(1 for s in sev_list if b_start <= s < b_end)
            distribution.append({"range": round(b_end, 0), "count": count})

    return SimulationResponse(
        total_claims=total_claims,
        total_incurred=round(total_incurred, 0),
        avg_severity=round(avg_severity, 0),
        max_claim=round(max_claim, 0),
        loss_ratio=round(loss_ratio, 4),
        distribution=distribution
    )

@router.get("/market-rates")
def get_market_rates():
    """Return realistic market interest rates (yield curve)."""
    # 1Y, 2Y, 5Y, 10Y, 20Y, 30Y
    tenors = ["1Y", "2Y", "5Y", "10Y", "20Y", "30Y"]
    base_rate = 0.035
    rates = []
    for i, t in enumerate(tenors):
        # Normal upward sloping curve
        rate = base_rate + (i * 0.005) + random.uniform(-0.002, 0.002)
        rates.append({"tenor": t, "rate": round(rate, 4)})
    return rates
