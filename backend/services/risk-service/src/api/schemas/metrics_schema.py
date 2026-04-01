from typing import List, Optional
from pydantic import BaseModel, Field


# -----------------------------
# BASE INPUT
# -----------------------------
class ReturnsInput(BaseModel):
    """
    Base input for all risk metrics
    """
    returns: List[float] = Field(
        ...,
        description="List of asset/portfolio returns",
        example=[0.01, -0.02, 0.015, -0.005]
    )


# -----------------------------
# VALUE AT RISK (VaR)
# -----------------------------
class VaRRequest(ReturnsInput):
    confidence_level: float = Field(
        0.95,
        gt=0,
        lt=1,
        description="Confidence level"
    )


class VaRResponse(BaseModel):
    confidence_level: float
    historical_var: float
    parametric_var: float
    monte_carlo_var: float


# -----------------------------
# EXPECTED SHORTFALL (ES)
# -----------------------------
class ESRequest(ReturnsInput):
    confidence_level: float = Field(
        0.95,
        gt=0,
        lt=1
    )


class ESResponse(BaseModel):
    confidence_level: float
    value_at_risk: float
    expected_shortfall: float


# -----------------------------
# DRAWDOWN
# -----------------------------
class DrawdownResponse(BaseModel):
    max_drawdown: float
    drawdown_duration: int
    recovery_time: int


# -----------------------------
# SHARPE RATIO
# -----------------------------
class SharpeRequest(ReturnsInput):
    risk_free_rate: Optional[float] = Field(
        0.0,
        description="Risk-free rate per period"
    )
    periods_per_year: Optional[int] = Field(
        252,
        gt=0,
        description="Trading periods per year"
    )


class SharpeResponse(BaseModel):
    sharpe_ratio: float
    annualized_return: float
    volatility: float


# -----------------------------
# COMBINED METRICS (OPTIONAL)
# -----------------------------
class RiskSummaryResponse(BaseModel):
    """
    Full portfolio risk snapshot
    """
    var: VaRResponse
    es: ESResponse
    drawdown: DrawdownResponse
    sharpe: SharpeResponse