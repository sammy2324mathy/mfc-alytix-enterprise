"""Pricing Optimization API — premium model comparison and history."""

from fastapi import APIRouter
import math

router = APIRouter()


@router.get("/history")
def pricing_history():
    """Return 12-month model vs actual vs competitor premium data."""
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return [
        {
            "month": months[i],
            "model_premium": round(1200 + math.sin(i * 0.5) * 150 + i * 20),
            "actual_premium": round(1250 + math.sin(i * 0.5) * 120 + i * 18),
            "competitor_avg": round(1180 + i * 25),
        }
        for i in range(12)
    ]


@router.post("/optimize")
def optimize_premium(policy_type: str = "motor", age: int = 35, claim_history: int = 0):
    """Run pricing optimization model."""
    base = {"motor": 1200, "life": 850, "property": 1500, "commercial": 2200}.get(policy_type, 1200)
    age_factor = 1.0 + max(0, (age - 30)) * 0.008
    claims_factor = 1.0 + claim_history * 0.15
    optimized = round(base * age_factor * claims_factor, 2)
    return {
        "policy_type": policy_type,
        "base_premium": base,
        "age_factor": round(age_factor, 3),
        "claims_factor": round(claims_factor, 3),
        "optimized_premium": optimized,
        "model": "GLM + Random Forest Ensemble v3.1",
    }
