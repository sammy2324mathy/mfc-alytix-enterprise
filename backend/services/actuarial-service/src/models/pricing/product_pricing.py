from typing import Dict, List

from models.claims.claim_frequency import ClaimFrequencyModel
from models.claims.claim_severity import ClaimSeverityModel
from models.pricing.premium_calculator import PremiumCalculator


class ProductPricingModel:
    """
    Product-Level Pricing Model

    Combines:
    - Frequency model
    - Severity model
    - Premium calculator

    Produces:
    - Final premium
    - Risk metrics
    """

    def __init__(
        self,
        expense_ratio: float = 0.2,
        profit_margin: float = 0.1,
        discount_rate: float = 0.05,
    ):
        self.frequency_model = ClaimFrequencyModel()
        self.severity_model = ClaimSeverityModel()
        self.premium_calculator = PremiumCalculator(
            expense_ratio=expense_ratio,
            profit_margin=profit_margin,
            discount_rate=discount_rate,
        )

    # -------------------------------
    # Fit Models
    # -------------------------------
    def fit(
        self,
        claims_count: List[int],
        exposure: List[float],
        claim_sizes: List[float],
    ) -> Dict:
        """
        Fit frequency and severity models
        """
        lambda_ = self.frequency_model.fit(claims_count, exposure)
        severity_params = self.severity_model.fit(claim_sizes)

        return {
            "frequency_lambda": lambda_,
            "severity_params": severity_params,
        }

    # -------------------------------
    # Price Product
    # -------------------------------
    def price(
        self,
        exposure: float,
        term: int = 1
    ) -> Dict:
        """
        Compute premium for given exposure
        """
        # Expected claims (frequency)
        frequency = self.frequency_model.expected_claims(exposure)

        # Expected severity
        severity = self.severity_model.mean()

        premium = self.premium_calculator.calculate(
            frequency=frequency,
            severity=severity,
            term=term
        )

        return {
            "expected_frequency": round(frequency, 6),
            "expected_severity": round(severity, 6),
            **premium
        }

    # -------------------------------
    # Scenario Analysis
    # -------------------------------
    def scenario_analysis(
        self,
        exposures: List[float],
        term: int = 1
    ) -> List[Dict]:
        """
        Price multiple exposure scenarios
        """
        results = []

        for exp in exposures:
            result = self.price(exp, term)
            result["exposure"] = exp
            results.append(result)

        return results

    # -------------------------------
    # Risk Simulation
    # -------------------------------
    def simulate_losses(
        self,
        n_simulations: int = 1000
    ) -> List[float]:
        """
        Simulate aggregate losses
        """
        losses = []

        for _ in range(n_simulations):
            freq = self.frequency_model.simulate(1)[0]
            severities = self.severity_model.simulate(freq)

            total_loss = sum(severities)
            losses.append(round(total_loss, 6))

        return losses