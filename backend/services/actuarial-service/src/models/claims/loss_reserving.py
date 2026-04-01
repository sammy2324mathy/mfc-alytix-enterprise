from typing import List, Dict
import numpy as np


class LossReservingModel:
    """
    Actuarial Loss Reserving Model

    Implements:
    - Chain Ladder Method
    - Development Factors
    - Ultimate Loss Estimation
    """

    # -------------------------------
    # Development Factors
    # -------------------------------
    def development_factors(self, triangle: List[List[float]]) -> List[float]:
        """
        Calculate age-to-age (link) ratios
        """
        triangle = np.array(triangle, dtype=float)

        n_periods = triangle.shape[1]
        factors = []

        for j in range(n_periods - 1):
            numerator = 0.0
            denominator = 0.0

            for i in range(len(triangle)):
                if triangle[i, j] > 0 and triangle[i, j + 1] > 0:
                    numerator += triangle[i, j + 1]
                    denominator += triangle[i, j]

            factor = (numerator / denominator) if denominator > 0 else 1.0
            factors.append(round(factor, 6))

        return factors

    # -------------------------------
    # Cumulative Development Factors
    # -------------------------------
    def cumulative_factors(self, dev_factors: List[float]) -> List[float]:
        """
        Convert link ratios into cumulative factors
        """
        cum_factors = []

        for i in range(len(dev_factors)):
            product = 1.0
            for f in dev_factors[i:]:
                product *= f
            cum_factors.append(round(product, 6))

        return cum_factors

    # -------------------------------
    # Estimate Ultimate Loss
    # -------------------------------
    def ultimate_losses(
        self,
        triangle: List[List[float]],
        cum_factors: List[float]
    ) -> List[float]:
        """
        Estimate ultimate losses per origin period
        """
        triangle = np.array(triangle, dtype=float)

        ultimates = []

        for i, row in enumerate(triangle):
            # last observed value in row
            last_idx = np.max(np.where(row > 0))
            latest_value = row[last_idx]

            factor = cum_factors[last_idx] if last_idx < len(cum_factors) else 1.0

            ultimate = latest_value * factor
            ultimates.append(round(ultimate, 6))

        return ultimates

    # -------------------------------
    # Reserve Calculation
    # -------------------------------
    def reserves(
        self,
        triangle: List[List[float]],
        ultimates: List[float]
    ) -> List[float]:
        """
        Reserve = Ultimate - Reported
        """
        triangle = np.array(triangle, dtype=float)

        reserves = []

        for i, row in enumerate(triangle):
            reported = np.max(row)
            reserve = ultimates[i] - reported
            reserves.append(round(reserve, 6))

        return reserves

    # -------------------------------
    # Full Chain Ladder Analysis
    # -------------------------------
    def analyze(self, triangle: List[List[float]]) -> Dict:
        """
        Full reserving pipeline
        """
        dev_factors = self.development_factors(triangle)
        cum_factors = self.cumulative_factors(dev_factors)
        ultimates = self.ultimate_losses(triangle, cum_factors)
        reserves = self.reserves(triangle, ultimates)

        return {
            "development_factors": dev_factors,
            "cumulative_factors": cum_factors,
            "ultimate_losses": ultimates,
            "reserves": reserves,
            "total_reserve": round(sum(reserves), 6),
        }