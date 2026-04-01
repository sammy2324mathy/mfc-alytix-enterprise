"""Customer Analytics API — segmentation and lifetime value."""

from fastapi import APIRouter
from typing import List

from src.api.schemas.ds_schemas import CustomerSegment

router = APIRouter()

SEGMENTS: List[CustomerSegment] = [
    CustomerSegment(segment_name="Value Seekers", size_pct=34, avg_policies=1.2, avg_ltv=2400, churn_risk="medium"),
    CustomerSegment(segment_name="Premium Loyal", size_pct=22, avg_policies=3.1, avg_ltv=12800, churn_risk="low"),
    CustomerSegment(segment_name="Young Professionals", size_pct=18, avg_policies=1.5, avg_ltv=4200, churn_risk="high"),
    CustomerSegment(segment_name="Family Shield", size_pct=16, avg_policies=2.8, avg_ltv=9600, churn_risk="low"),
    CustomerSegment(segment_name="Corporate Bulk", size_pct=10, avg_policies=45, avg_ltv=85000, churn_risk="medium"),
]


@router.get("/segments", response_model=List[CustomerSegment])
def get_customer_segments():
    return SEGMENTS


@router.get("/{customer_id}/profile")
def get_customer_profile(customer_id: str):
    return {
        "customer_id": customer_id,
        "segment": "Premium Loyal",
        "total_policies": 3,
        "lifetime_value": 12800,
        "tenure_years": 8,
        "churn_probability": 0.014,
        "next_best_action": "Cross-sell property insurance",
        "satisfaction_score": 4.6,
    }
