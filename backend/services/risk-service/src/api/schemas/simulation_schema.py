from typing import List, Optional
from pydantic import BaseModel, Field


# -----------------------------
# REQUEST SCHEMA
# -----------------------------
class SimulationRequest(BaseModel):
    """
    Input for Monte Carlo / risk simulation
    """
    returns: List[float] = Field(
        ...,
        description="Historical returns series",
        example=[0.01, -0.02, 0.015, -0.005]
    )

    confidence_level: float = Field(
        0.95,
        gt=0,
        lt=1,
        description="Confidence level (e.g. 0.95)"
    )

    simulations: int = Field(
        10000,
        gt=100,
        description="Number of Monte Carlo simulations"
    )

    time_horizon: int = Field(
        1,
        gt=0,
        description="Forecast horizon (in periods)"
    )

    risk_free_rate: Optional[float] = Field(
        0.0,
        description="Risk-free rate per period"
    )


# -----------------------------
# RESPONSE SCHEMA
# -----------------------------
class SimulationResponse(BaseModel):
    """
    Output from simulation
    """
    confidence_level: float

    var: float
    expected_shortfall: float

    simulated_mean: float
    simulated_std: float

    min_return: float
    max_return: float


# -----------------------------
# EXTENDED RESPONSE (OPTIONAL)
# -----------------------------
class SimulationDetailedResponse(SimulationResponse):
    """
    Extended output with distribution details
    """
    percentiles: List[float] = Field(
        ...,
        description="Key percentiles of simulated distribution"
    )

    sample_paths: Optional[List[float]] = Field(
        None,
        description="Optional simulated return paths (subset)"
    )