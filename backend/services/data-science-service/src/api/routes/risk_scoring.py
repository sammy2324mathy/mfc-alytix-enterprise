"""Risk Scoring API — ML-based customer risk segmentation."""

import random
from fastapi import APIRouter
from typing import List

from src.api.schemas.ds_schemas import RiskSegment, RiskScoreRequest, RiskScoreResponse

router = APIRouter()

SEGMENTS: List[RiskSegment] = [
    RiskSegment(segment="Very Low", customer_count=245000, avg_premium=820, claim_rate=2.1, action="accept"),
    RiskSegment(segment="Low", customer_count=412000, avg_premium=1150, claim_rate=4.8, action="accept"),
    RiskSegment(segment="Medium", customer_count=189000, avg_premium=1680, claim_rate=8.2, action="review"),
    RiskSegment(segment="High", customer_count=38000, avg_premium=2950, claim_rate=15.6, action="refer"),
    RiskSegment(segment="Very High", customer_count=8200, avg_premium=4800, claim_rate=28.3, action="refer"),
]


@router.get("/segments", response_model=List[RiskSegment])
def get_segments():
    return SEGMENTS


@router.post("/score", response_model=RiskScoreResponse)
def score_customer(req: RiskScoreRequest):
    # Simple heuristic scoring (would be ML model in production)
    base_score = 50.0
    if req.age < 25:
        base_score += 15
    elif req.age > 60:
        base_score += 10
    base_score += req.claim_history * 12
    base_score -= (req.credit_score - 600) * 0.05
    score = max(0, min(100, base_score + random.uniform(-5, 5)))

    if score < 20:
        segment, action = "Very Low", "accept"
    elif score < 40:
        segment, action = "Low", "accept"
    elif score < 60:
        segment, action = "Medium", "review"
    elif score < 80:
        segment, action = "High", "refer"
    else:
        segment, action = "Very High", "refer"

    return RiskScoreResponse(
        customer_id=req.customer_id, risk_score=round(score, 1),
        risk_segment=segment, recommended_action=action,
    )
