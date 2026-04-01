"""Pydantic schemas for Data Science Service endpoints."""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class PipelineStatus(str, Enum):
    healthy = "healthy"
    warning = "warning"
    failed = "failed"


class Pipeline(BaseModel):
    pipeline_id: str
    name: str
    source: str
    schedule: str
    record_count: int
    status: PipelineStatus
    last_run: str


class RiskSegment(BaseModel):
    segment: str
    customer_count: int
    avg_premium: float
    claim_rate: float
    action: str  # accept, review, refer


class RiskScoreRequest(BaseModel):
    customer_id: str
    age: int
    policy_type: str
    claim_history: int = 0
    credit_score: float = 650.0


class RiskScoreResponse(BaseModel):
    customer_id: str
    risk_score: float
    risk_segment: str
    recommended_action: str


class FraudScoreRequest(BaseModel):
    claim_id: str
    claim_amount: float
    claimant_name: str
    claim_type: str
    days_since_inception: int = 365
    prior_claims_90d: int = 0


class FraudScoreResponse(BaseModel):
    claim_id: str
    fraud_score: float
    anomaly_reasons: List[str]
    status: str  # flagged, under_review, cleared


class ForecastModelType(str, Enum):
    linear = "linear"
    arima = "arima"
    lstm = "lstm"


class ForecastRequest(BaseModel):
    metric: str = "claims_volume"
    horizon_months: int = Field(default=6, ge=1, le=24)
    confidence_level: float = Field(default=0.95, ge=0.8, le=0.99)
    model_type: ForecastModelType = ForecastModelType.linear
    historical_data: Optional[List[float]] = None
    phi: float = 0.9  # Parameter for ARIMA model


class ForecastPoint(BaseModel):
    period: str
    predicted: float
    lower_ci: float
    upper_ci: float
    actual: Optional[float] = None


class CustomerSegment(BaseModel):
    segment_name: str
    size_pct: float
    avg_policies: float
    avg_ltv: float
    churn_risk: str


class ClaimsAnalysis(BaseModel):
    period: str
    frequency: int
    avg_severity: float
    total_incurred: float


class DashboardSummary(BaseModel):
    dashboard_id: str
    name: str
    audience: str
    views_mtd: int
    refresh_rate: str
    status: str


class ModelDeployment(BaseModel):
    model_id: str
    name: str
    version: str
    endpoint: str
    latency_ms: int
    requests_daily: str
    drift_status: str
    health: str


class GovernanceControl(BaseModel):
    control_id: str
    area: str
    control_description: str
    compliance_status: str
    last_audit: str


class GovernanceAuditRequest(BaseModel):
    control_id: str
    requested_by: str


class GovernanceAuditResponse(BaseModel):
    audit_id: str
    status: str
    report_url: str
