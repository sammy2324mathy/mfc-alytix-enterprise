from typing import List, Dict
import numpy as np
from math import exp, factorial


class ClaimFrequencyModel:
    """
    Actuarial Claim Frequency Model

    Uses Poisson distribution:
        P(N = k) = (λ^k * e^-λ) / k!
    """

    def __init__(self, lambda_: float = None):
        self.lambda_ = lambda_

    # -------------------------------
    # Fit Model (Estimate λ)
    # -------------------------------
    def fit(self, claims_count: List[int], exposure: List[float]) -> float:
        """
        Estimate λ (expected claims per unit exposure)
        λ = total claims / total exposure
        """
        total_claims = sum(claims_count)
        total_exposure = sum(exposure)

        if total_exposure == 0:
            raise ValueError("Total exposure cannot be zero")

        self.lambda_ = total_claims / total_exposure

        return round(self.lambda_, 6)

    # -------------------------------
    # Probability Mass Function
    # -------------------------------
    def pmf(self, k: int) -> float:
        """
        Probability of k claims
        """
        if self.lambda_ is None:
            raise ValueError("Model not fitted")

        prob = (self.lambda_ ** k) * exp(-self.lambda_) / factorial(k)

        return round(prob, 6)

    # -------------------------------
    # Generate Distribution
    # -------------------------------
    def distribution(self, max_k: int = 10) -> List[Dict]:
        """
        Returns probability distribution up to k
        """
        return [
            {"k": k, "probability": self.pmf(k)}
            for k in range(max_k + 1)
        ]

    # -------------------------------
    # Simulate Claims
    # -------------------------------
    def simulate(self, n_periods: int) -> List[int]:
        """
        Simulate claim counts using Poisson process
        """
        if self.lambda_ is None:
            raise ValueError("Model not fitted")

        return list(np.random.poisson(self.lambda_, size=n_periods))

    # -------------------------------
    # Expected Claims
    # -------------------------------
    def expected_claims(self, exposure: float) -> float:
        """
        Expected number of claims = λ × exposure
        """
        if self.lambda_ is None:
            raise ValueError("Model not fitted")

        return round(self.lambda_ * exposure, 6)