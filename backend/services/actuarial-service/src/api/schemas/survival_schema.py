from pydantic import BaseModel, Field
from typing import List, Optional


# -------------------------------
# Input Schema
# -------------------------------
class SurvivalRequest(BaseModel):
    """
    Input schema for survival analysis.
    """
    time: List[float] = Field(..., description="Time durations")
    event: List[int] = Field(..., description="Event occurred (1) or censored (0)")


class KaplanMeierRequest(BaseModel):
    """Input schema for Kaplan-Meier estimator (used by frontend)."""
    durations: List[float] = Field(..., description="Observed durations")
    events: List[int] = Field(..., description="Event indicators (1=event, 0=censored)")


# -------------------------------
# Kaplan-Meier Output
# -------------------------------
class SurvivalPoint(BaseModel):
    time: float
    survival_probability: float


class SurvivalResponse(BaseModel):
    """
    Output schema for survival curve.
    """
    survival_curve: List[SurvivalPoint]
    median_survival_time: Optional[float]


# -------------------------------
# Hazard Function Output
# -------------------------------
class HazardPoint(BaseModel):
    time: float
    hazard: float


class HazardResponse(BaseModel):
    hazard_curve: List[HazardPoint]


# -------------------------------
# Cox Model Input
# -------------------------------
class CoxModelRequest(BaseModel):
    """
    Input schema for Cox Proportional Hazards model.
    """
    time: List[float]
    event: List[int]
    features: List[List[float]]  # 2D matrix (samples x features)

    def validate_dimensions(self):
        n = len(self.time)
        if not (len(self.event) == n and len(self.features) == n):
            raise ValueError("All inputs must have the same number of samples")


# -------------------------------
# Cox Model Output
# -------------------------------
class CoxModelResponse(BaseModel):
    coefficients: List[float]
    hazard_ratios: List[float]