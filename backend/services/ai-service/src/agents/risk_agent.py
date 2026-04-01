from typing import Dict, Any
import numpy as np

from .base_agent import BaseAgent

# Validators
from src.validators.assumption_validator import AssumptionValidator
from src.validators.model_validator import ModelValidator


class RiskAgent(BaseAgent):
    """
    AI Agent: Risk Analyst

    Capabilities:
    - Risk scoring
    - Expected loss calculation
    - Volatility estimation
    - Portfolio risk evaluation
    """

    def __init__(self):
        super().__init__("RiskAgent")

        self.assumption_validator = AssumptionValidator()
        self.model_validator = ModelValidator()

    # -------------------------------
    # Core Execution
    # -------------------------------
    def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Expected input:
        {
            "claims": [100, 200, 300],
            "exposure": 1000,
            "premium": 500,
            "confidence_level": 0.95
        }
        """

        self.validate_input(input_data)

        claims = input_data.get("claims", [])
        exposure = input_data.get("exposure", 1)
        premium = input_data.get("premium", 0)
        confidence = input_data.get("confidence_level", 0.95)

        # -------------------------------
        # Validate inputs
        # -------------------------------
        self.assumption_validator.validate_claims(claims)
        self.assumption_validator.validate_exposure(exposure)
        self.assumption_validator.validate_premium(premium)

        # -------------------------------
        # Basic Risk Metrics
        # -------------------------------
        total_claims = sum(claims)
        claim_count = len(claims)

        frequency = claim_count / exposure
        severity = np.mean(claims) if claims else 0

        expected_loss = frequency * severity * exposure

        # -------------------------------
        # Variance & Volatility
        # -------------------------------
        variance = np.var(claims) if claims else 0
        std_dev = np.sqrt(variance)

        # -------------------------------
        # Value at Risk (VaR)
        # -------------------------------
        var = np.percentile(claims, confidence * 100) if claims else 0

        # -------------------------------
        # Loss Ratio
        # -------------------------------
        loss_ratio = total_claims / premium if premium > 0 else 0

        # -------------------------------
        # Risk Score (normalized)
        # -------------------------------
        risk_score = min(1.0, (loss_ratio + (var / (premium + 1))) / 2)

        # -------------------------------
        # Validate outputs
        # -------------------------------
        self.model_validator.validate_loss_ratio(loss_ratio)
        self.model_validator.validate_numeric_output(risk_score, "risk_score")

        # -------------------------------
        # Risk Level Classification
        # -------------------------------
        if risk_score < 0.3:
            level = "LOW"
        elif risk_score < 0.7:
            level = "MEDIUM"
        else:
            level = "HIGH"

        # -------------------------------
        # Output
        # -------------------------------
        return {
            "metrics": {
                "total_claims": total_claims,
                "frequency": round(frequency, 6),
                "severity": round(severity, 4),
                "expected_loss": round(expected_loss, 4),
                "variance": round(variance, 4),
                "std_dev": round(std_dev, 4),
                "VaR": round(var, 4),
                "loss_ratio": round(loss_ratio, 4),
            },
            "risk": {
                "score": round(risk_score, 4),
                "level": level,
            }
        }