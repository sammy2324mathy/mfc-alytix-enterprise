"""Data Governance API — privacy controls, ethics, model cards, and regulatory compliance."""

from fastapi import APIRouter, Depends
from typing import List

from src.api.schemas.ds_schemas import GovernanceControl, GovernanceAuditRequest, GovernanceAuditResponse
from shared.auth import get_current_user_claims

router = APIRouter(dependencies=[Depends(get_current_user_claims)])

CONTROLS: List[GovernanceControl] = [
    GovernanceControl(control_id="GOV-01", area="Data Privacy", control_description="POPIA/GDPR consent management and data subject rights", compliance_status="compliant", last_audit="2025-11-15"),
    GovernanceControl(control_id="GOV-02", area="Algorithmic Ethics", control_description="Bias monitoring for protected classes in all scoring models", compliance_status="compliant", last_audit="2025-10-20"),
    GovernanceControl(control_id="GOV-03", area="Data Retention", control_description="Automated 7-year retention policy with secure disposal", compliance_status="compliant", last_audit="2025-09-01"),
    GovernanceControl(control_id="GOV-04", area="Access Control", control_description="RBAC enforcement with quarterly access reviews", compliance_status="compliant", last_audit="2025-12-01"),
    GovernanceControl(control_id="GOV-05", area="Model Documentation", control_description="Model cards for all production models with explainability reports", compliance_status="partial", last_audit="2025-11-10"),
    GovernanceControl(control_id="GOV-06", area="Regulatory Reporting", control_description="Automated regulatory data extracts for SAM/IFRS-17", compliance_status="compliant", last_audit="2025-12-15"),
]


@router.get("/controls", response_model=List[GovernanceControl])
def list_controls():
    return CONTROLS


@router.get("/model-cards")
def model_cards():
    """Return model cards for all production models."""
    return [
        {
            "model_id": "MDL-014",
            "name": "Fraud Detection (Isolation Forest)",
            "purpose": "Identify potentially fraudulent claims for investigation",
            "training_data": "500K historical claims (2019-2025)",
            "features": 42,
            "fairness_metrics": {"demographic_parity": 0.94, "equalized_odds": 0.91},
            "limitations": "Limited effectiveness on novel fraud patterns",
            "last_updated": "2025-12-15",
        },
        {
            "model_id": "MDL-015",
            "name": "Risk Scoring (XGBoost)",
            "purpose": "Score customer risk for underwriting decisions",
            "training_data": "1.2M policies with 3-year outcome window",
            "features": 68,
            "fairness_metrics": {"demographic_parity": 0.96, "equalized_odds": 0.93},
            "limitations": "Requires annual recalibration for drift",
            "last_updated": "2025-11-20",
        },
        {
            "model_id": "MDL-018",
            "name": "Premium Optimizer (GLM+RF)",
            "purpose": "Optimize premium pricing while maintaining competitiveness",
            "training_data": "2M policies with premium and loss history",
            "features": 35,
            "fairness_metrics": {"demographic_parity": 0.98, "equalized_odds": 0.95},
            "limitations": "Market data dependency for competitor benchmarking",
            "last_updated": "2025-12-01",
        },
    ]
