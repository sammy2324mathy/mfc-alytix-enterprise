"""Pydantic schemas for Risk Service endpoints."""

from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class SeverityLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class StressScenario(BaseModel):
    scenario_id: str
    name: str
    description: str
    category: str  # market, credit, operational, liquidity
    severity: SeverityLevel
    probability: float = Field(ge=0, le=1)
    impact_pct: float = Field(description="Impact as percentage of portfolio")
    parameters: dict = Field(default_factory=dict)


class StressTestRequest(BaseModel):
    portfolio_value: float = Field(gt=0)
    scenarios: Optional[List[str]] = None  # None = run all
    confidence_level: float = Field(default=0.99, ge=0.9, le=0.999)


class StressTestResult(BaseModel):
    scenario_id: str
    scenario_name: str
    pre_stress_value: float
    post_stress_value: float
    loss: float
    loss_pct: float
    breaches_limit: bool


class CapitalAllocation(BaseModel):
    business_unit: str
    required_capital: float
    available_capital: float
    utilization_pct: float
    risk_category: str


class SolvencyMetrics(BaseModel):
    total_required: float
    total_available: float
    solvency_ratio: float
    regulatory_minimum: float
    surplus: float


class RiskLimit(BaseModel):
    limit_id: str
    category: str
    metric: str
    board_limit: float
    current_value: float
    utilization_pct: float
    status: str  # within, warning, breach


class RiskLimitUpdate(BaseModel):
    limit_id: str
    new_board_limit: float = Field(gt=0)
    reason: str
    approved_by: str


class SimulationRequest(BaseModel):
    portfolio_value: float = Field(gt=0)
    simulations: int = Field(default=1000, ge=100, le=10000)
    confidence_level: float = Field(default=0.95, ge=0.9, le=0.99)


class SimulationResult(BaseModel):
    var_95: float
    var_99: float
    expected_shortfall: float
    mean_outcome: float
    standard_deviation: float
