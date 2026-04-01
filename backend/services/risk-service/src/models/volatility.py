from typing import List, Dict
import numpy as np


class VolatilityCalculator:
    """
    Volatility models for financial returns

    Supported:
    - Historical volatility
    - Rolling volatility
    - Exponentially Weighted Moving Average (EWMA)
    """

    @staticmethod
    def validate_inputs(returns: List[float]):
        if len(returns) < 2:
            raise ValueError("At least two return observations are required.")

    # -----------------------------
    # HISTORICAL VOLATILITY
    # -----------------------------
    @staticmethod
    def historical_volatility(
        returns: List[float],
        periods_per_year: int = 252
    ) -> float:
        """
        Annualized historical volatility
        """
        VolatilityCalculator.validate_inputs(returns)

        returns_array = np.array(returns)
        vol = np.std(returns_array, ddof=1)

        return float(vol * np.sqrt(periods_per_year))

    # -----------------------------
    # ROLLING VOLATILITY
    # -----------------------------
    @staticmethod
    def rolling_volatility(
        returns: List[float],
        window: int = 20,
        periods_per_year: int = 252
    ) -> List[float]:
        """
        Rolling window volatility
        """
        VolatilityCalculator.validate_inputs(returns)

        returns_array = np.array(returns)

        if window >= len(returns_array):
            raise ValueError("Window size must be smaller than data length.")

        rolling_vol = []

        for i in range(window, len(returns_array) + 1):
            window_data = returns_array[i - window:i]
            vol = np.std(window_data, ddof=1) * np.sqrt(periods_per_year)
            rolling_vol.append(float(vol))

        return rolling_vol

    # -----------------------------
    # EWMA VOLATILITY
    # -----------------------------
    @staticmethod
    def ewma_volatility(
        returns: List[float],
        lambda_: float = 0.94,
        periods_per_year: int = 252
    ) -> float:
        """
        Exponentially Weighted Moving Average volatility
        (RiskMetrics approach)
        """
        VolatilityCalculator.validate_inputs(returns)

        if not (0 < lambda_ < 1):
            raise ValueError("Lambda must be between 0 and 1.")

        returns_array = np.array(returns)

        variance = 0.0
        for r in returns_array:
            variance = lambda_ * variance + (1 - lambda_) * (r ** 2)

        return float(np.sqrt(variance) * np.sqrt(periods_per_year))

    # -----------------------------
    # SUMMARY
    # -----------------------------
    @staticmethod
    def summary(
        returns: List[float],
        periods_per_year: int = 252
    ) -> Dict:
        """
        Full volatility report
        """
        return {
            "historical_volatility": VolatilityCalculator.historical_volatility(
                returns, periods_per_year
            ),
            "ewma_volatility": VolatilityCalculator.ewma_volatility(
                returns, periods_per_year=periods_per_year
            ),
        }