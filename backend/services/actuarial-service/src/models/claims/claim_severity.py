from typing import List, Dict
import numpy as np
from math import log, exp, sqrt, pi


class ClaimSeverityModel:
    """
    Actuarial Claim Severity Model

    Supports:
    - Lognormal distribution (default)
    - Basic statistics
    - Simulation of claim sizes
    """

    def __init__(self):
        self.mu = None
        self.sigma = None

    # -------------------------------
    # Fit Lognormal Model
    # -------------------------------
    def fit(self, claims: List[float]) -> Dict:
        """
        Fit lognormal distribution:
        ln(X) ~ N(mu, sigma^2)
        """
        if not claims:
            raise ValueError("Claims data cannot be empty")

        log_claims = np.log(claims)

        self.mu = float(np.mean(log_claims))
        self.sigma = float(np.std(log_claims))

        return {
            "mu": round(self.mu, 6),
            "sigma": round(self.sigma, 6),
        }

    # -------------------------------
    # Probability Density Function
    # -------------------------------
    def pdf(self, x: float) -> float:
        """
        Lognormal PDF
        """
        if self.mu is None or self.sigma is None:
            raise ValueError("Model not fitted")

        if x <= 0:
            return 0.0

        coefficient = 1 / (x * self.sigma * sqrt(2 * pi))
        exponent = -((log(x) - self.mu) ** 2) / (2 * self.sigma ** 2)

        return round(coefficient * exp(exponent), 6)

    # -------------------------------
    # Mean Severity
    # -------------------------------
    def mean(self) -> float:
        """
        E[X] for lognormal
        """
        if self.mu is None or self.sigma is None:
            raise ValueError("Model not fitted")

        return round(exp(self.mu + (self.sigma ** 2) / 2), 6)

    # -------------------------------
    # Variance
    # -------------------------------
    def variance(self) -> float:
        """
        Var[X] for lognormal
        """
        if self.mu is None or self.sigma is None:
            raise ValueError("Model not fitted")

        return round(
            (exp(self.sigma ** 2) - 1) * exp(2 * self.mu + self.sigma ** 2),
            6
        )

    # -------------------------------
    # Simulate Claims
    # -------------------------------
    def simulate(self, n: int) -> List[float]:
        """
        Generate simulated claim sizes
        """
        if self.mu is None or self.sigma is None:
            raise ValueError("Model not fitted")

        samples = np.random.lognormal(self.mu, self.sigma, n)

        return [round(float(x), 6) for x in samples]

    # -------------------------------
    # Percentiles (Risk Metrics)
    # -------------------------------
    def percentile(self, p: float) -> float:
        """
        Compute percentile (VaR approximation)
        """
        if self.mu is None or self.sigma is None:
            raise ValueError("Model not fitted")

        z = np.percentile(np.random.normal(0, 1, 100000), p * 100)

        return round(exp(self.mu + self.sigma * z), 6)