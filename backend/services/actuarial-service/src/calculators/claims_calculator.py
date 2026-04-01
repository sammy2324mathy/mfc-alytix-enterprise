from typing import List, Dict
import numpy as np


class ClaimsCalculator:
    """
    Claims Analytics Engine

    Computes:
    - Claim frequency
    - Claim severity
    - Loss ratios
    - Aggregate losses
    """

    # -------------------------------
    # Claim Frequency
    # -------------------------------
    def claim_frequency(self, num_claims: int, exposure: float) -> float:
        """
        Frequency = Number of Claims / Exposure
        """
        if exposure == 0:
            return 0.0

        return round(num_claims / exposure, 6)

    # -------------------------------
    # Claim Severity
    # -------------------------------
    def claim_severity(self, claims: List[float]) -> float:
        """
        Severity = Average claim size
        """
        if not claims:
            return 0.0

        return round(np.mean(claims), 6)

    # -------------------------------
    # Aggregate Claims
    # -------------------------------
    def aggregate_claims(self, claims: List[float]) -> float:
        """
        Total claims amount
        """
        return round(sum(claims), 6)

    # -------------------------------
    # Loss Ratio
    # -------------------------------
    def loss_ratio(self, claims: List[float], premiums: float) -> float:
        """
        Loss Ratio = Total Claims / Earned Premiums
        """
        total_claims = self.aggregate_claims(claims)

        if premiums == 0:
            return 0.0

        return round(total_claims / premiums, 6)

    # -------------------------------
    # Pure Premium
    # -------------------------------
    def pure_premium(self, claims: List[float], exposure: float) -> float:
        """
        Pure Premium = Frequency × Severity
        """
        frequency = self.claim_frequency(len(claims), exposure)
        severity = self.claim_severity(claims)

        return round(frequency * severity, 6)

    # -------------------------------
    # Risk Metrics Summary
    # -------------------------------
    def analyze(
        self,
        claims: List[float],
        premiums: float,
        exposure: float
    ) -> Dict:
        """
        Full claims analysis pipeline
        """
        total_claims = self.aggregate_claims(claims)
        frequency = self.claim_frequency(len(claims), exposure)
        severity = self.claim_severity(claims)
        loss_ratio = self.loss_ratio(claims, premiums)
        pure_premium = self.pure_premium(claims, exposure)

        return {
            "total_claims": total_claims,
            "frequency": frequency,
            "severity": severity,
            "loss_ratio": loss_ratio,
            "pure_premium": pure_premium
        }