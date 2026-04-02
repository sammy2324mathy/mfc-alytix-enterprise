from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import math

router = APIRouter()

class PolicyInput(BaseModel):
    age: int
    sum_assured: float
    annual_premium: float

class AssumptionsInput(BaseModel):
    interest_rate: float
    mortality_improvement: float = 0.01

class ProjectionRequest(BaseModel):
    policy: PolicyInput
    assumptions: AssumptionsInput

class CashFlow(BaseModel):
    period: int
    premium: float
    claims: float
    expenses: float
    net_cash_flow: float
    discount_factor: float
    pv_net_cash_flow: float

class ProjectionResponse(BaseModel):
    cash_flows: List[CashFlow]
    bel: float
    risk_adjustment: float

@router.post("/run", response_model=ProjectionResponse)
def run_projection(req: ProjectionRequest):
    """
    Run a multi-period actuarial projection for a single policy.
    Calculates Best Estimate Liability (BEL) using DCF.
    """
    cash_flows = []
    total_pv = 0.0
    
    # Projection parameters
    projection_years = 30
    expense_ratio = 0.05 # 5% of premium
    
    for t in range(projection_years):
        # Age at period t
        current_age = req.policy.age + t
        
        # Simplified probability of death (Gompertz-like)
        # qx = alpha * exp(beta * age)
        alpha = 0.0001
        beta = 0.08
        qx = alpha * math.exp(beta * current_age) * (1 - req.assumptions.mortality_improvement)**t
        qx = min(qx, 1.0)
        
        # Cash flows
        premium = req.policy.annual_premium if t < 20 else 0 # 20-year pay
        claims = req.policy.sum_assured * qx
        expenses = premium * expense_ratio
        
        net_cf = premium - claims - expenses
        
        # Discounting
        discount_factor = 1 / ((1 + req.assumptions.interest_rate) ** t)
        pv_net_cf = net_cf * discount_factor
        
        cash_flows.append(CashFlow(
            period=t,
            premium=round(premium, 2),
            claims=round(claims, 2),
            expenses=round(expenses, 2),
            net_cash_flow=round(net_cf, 2),
            discount_factor=round(discount_factor, 4),
            pv_net_cash_flow=round(pv_net_cf, 2)
        ))
        
        total_pv += pv_net_cf

    # BEL is usually -PV(Future Cash Flows) in some contexts, 
    # but here let's say it's the PV of liabilities (Claims + Expenses - Premiums)
    bel = -total_pv
    risk_adjustment = bel * 0.03 # Simple 3% cost of capital RA

    return ProjectionResponse(
        cash_flows=cash_flows,
        bel=round(bel, 2),
        risk_adjustment=round(risk_adjustment, 2)
    )
