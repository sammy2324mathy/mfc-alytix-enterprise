"""Predictive Analytics API — claims forecasting and churn prediction."""

import math
from fastapi import APIRouter
from typing import List

from src.api.schemas.ds_schemas import ForecastRequest, ForecastPoint

router = APIRouter()


@router.post("/forecast", response_model=List[ForecastPoint])
def generate_forecast(req: ForecastRequest):
    """Generate a time-series forecast using selected model (Linear, ARIMA, or LSTM)."""
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    results = []
    
    # Base data for simulation
    historical = req.historical_data or [410.5, 415.2, 418.8, 422.1, 425.5, 428.9, 432.2, 435.6]
    last_val = historical[-1]
    
    for i in range(req.horizon_months):
        idx = len(historical) + i
        
        if req.model_type == "arima":
            # Simple AR(1) logic migrated from forecasting-service
            predicted = last_val * (req.phi ** (i + 1))
        elif req.model_type == "lstm":
            # Simple LSTM mock (mean) migrated from forecasting-service
            predicted = sum(historical) / len(historical)
        else:
            # Traditional Linear/Sinusoidal baseline
            predicted = 415 + math.sin(idx * 0.4) * 55 + idx * 9
            
        spread = predicted * (1 - req.confidence_level) * 3
        actual = (420 + math.sin(idx * 0.4) * 60 + idx * 8) if idx < 12 else None
        
        results.append(ForecastPoint(
            period=months[idx % 12],
            predicted=round(predicted, 1),
            lower_ci=round(predicted - spread, 1),
            upper_ci=round(predicted + spread, 1),
            actual=round(actual, 1) if actual else None,
        ))
        
    return results


@router.get("/churn")
def churn_predictions():
    """Return churn risk summary."""
    return {
        "overall_churn_rate": 4.2,
        "trend": "-0.8% vs Q3",
        "high_risk_count": 3420,
        "segments": [
            {"segment": "Young Professionals", "churn_rate": 8.1, "risk": "high"},
            {"segment": "Value Seekers", "churn_rate": 5.4, "risk": "medium"},
            {"segment": "Corporate Bulk", "churn_rate": 3.2, "risk": "medium"},
            {"segment": "Family Shield", "churn_rate": 2.1, "risk": "low"},
            {"segment": "Premium Loyal", "churn_rate": 1.4, "risk": "low"},
        ]
    }
