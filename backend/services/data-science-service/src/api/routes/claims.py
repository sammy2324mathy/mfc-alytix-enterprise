"""Claims Analysis API — severity/frequency analysis and cost optimization."""

from fastapi import APIRouter
from typing import List

from src.api.schemas.ds_schemas import ClaimsAnalysis

router = APIRouter()


@router.get("/analysis", response_model=List[ClaimsAnalysis])
def claims_analysis():
    return [
        ClaimsAnalysis(period="Jul", frequency=412, avg_severity=8200, total_incurred=3_378_400),
        ClaimsAnalysis(period="Aug", frequency=385, avg_severity=7800, total_incurred=3_003_000),
        ClaimsAnalysis(period="Sep", frequency=445, avg_severity=9100, total_incurred=4_049_500),
        ClaimsAnalysis(period="Oct", frequency=398, avg_severity=8500, total_incurred=3_383_000),
        ClaimsAnalysis(period="Nov", frequency=468, avg_severity=8900, total_incurred=4_165_200),
        ClaimsAnalysis(period="Dec", frequency=510, avg_severity=9800, total_incurred=4_998_000),
    ]


@router.get("/severity-frequency")
def severity_frequency_summary():
    return {
        "avg_claim_amount": 8720,
        "avg_processing_days": 4.2,
        "cost_savings_ytd": 1_400_000,
        "severity_model": "GBRT v2.4",
        "severity_mae": 420,
        "frequency_trend": "increasing",
        "top_cost_drivers": ["Motor theft", "Property fire", "Life critical illness"],
    }
