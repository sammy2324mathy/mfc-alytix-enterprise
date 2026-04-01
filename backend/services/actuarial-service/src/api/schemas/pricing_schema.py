from pydantic import BaseModel, Field, model_validator
from typing import List, Optional
from enum import Enum


# -------------------------------
# Risk Factor Input
# -------------------------------
class RiskFactor(BaseModel):
    name: str = Field(..., description="Risk factor name (e.g., age, smoker)")
    value: float = Field(..., description="Numeric value of the risk factor")


# -------------------------------
# Pricing Request
# -------------------------------
class PricingRequest(BaseModel):
    """
    Input schema for actuarial pricing.
    """
    base_premium: float = Field(..., gt=0, description="Base premium amount")
    risk_factors: List[RiskFactor] = Field(default_factory=list)
    term_years: int = Field(..., gt=0, description="Policy duration in years")
    discount_rate: float = Field(0.0, ge=0, description="Discount rate (e.g., 0.1 for 10%)")

    @model_validator(mode="after")
    def validate_inputs(self):
        if self.term_years <= 0:
            raise ValueError("term_years must be greater than zero")
        return self


# -------------------------------
# Pricing Breakdown
# -------------------------------
class PricingComponent(BaseModel):
    component: str
    value: float


# -------------------------------
# Pricing Response
# -------------------------------
class PricingResponse(BaseModel):
    """
    Output schema for premium calculation.
    """
    base_premium: float
    adjusted_premium: float
    final_premium: float
    discount_applied: float
    breakdown: List[PricingComponent]


# -------------------------------
# Batch Pricing Request
# -------------------------------
class BatchPricingRequest(BaseModel):
    policies: List[PricingRequest]


# -------------------------------
# Batch Pricing Response
# -------------------------------
class BatchPricingResponse(BaseModel):
    results: List[PricingResponse]


class PremiumRequest(BaseModel):
    """Simplified premium pricing request used by the pricing route."""
    age: int = Field(..., description="Insured age")
    base_rate: float = Field(..., gt=0, description="Base premium rate")
    smoker: bool = Field(False, description="Is the insured a smoker")


class PremiumResponse(BaseModel):
    """Response for simplified premium pricing."""
    premium: float


# -------------------------------
# Rate Proposals (Operationality)
# -------------------------------
class RateProposalStatus(str, Enum):
    DRAFT = "Draft"
    PENDING_REVIEW = "Pending Review"
    COMMITTED = "Committed to Engine"
    REJECTED = "Rejected"

class RateProposal(BaseModel):
    id: str
    date: str
    product: str
    currentRate: float
    proposedDelta: float
    justification: str
    analyst: str
    status: RateProposalStatus

class RateProposalCreate(BaseModel):
    product: str
    proposedDelta: float
    justification: str
    analyst: str
    status: RateProposalStatus = RateProposalStatus.DRAFT