from typing import List, Dict
import numpy as np
from scipy.stats import norm


class ValueAtRiskCalculator:
    """
    Value at Risk (VaR)

    Supported methods:
    - Historical VaR
    - Parametric (Gaussian) VaR
    """

    @staticmethod
    def validate_inputs(returns: List[float], confidence_level: float):
        if len(returns) < 2:
            raise ValueError("At least two return observations are required.")

        if not (0 < confidence_level < 1):
            raise ValueError("Confidence level must be between 0 and 1.")

    # -----------------------------
    # HISTORICAL VAR
    # -----------------------------
    @staticmethod
    def historical_var(returns: List[float], confidence_level: float) -> float:
        """
        Historical simulation VaR
        """
        ValueAtRiskCalculator.validate_inputs(returns, confidence_level)

        sorted_returns = np.sort(returns)
        index = int((1 - confidence_level) * len(sorted_returns))

        return float(sorted_returns[index])

    # -----------------------------
    # PARAMETRIC (GAUSSIAN) VAR
    # -----------------------------
    @staticmethod
    def parametric_var(
        returns: List[float],
        confidence_level: float
    ) -> float:
        """
        Parametric VaR assuming normal distribution
        """
        ValueAtRiskCalculator.validate_inputs(returns, confidence_level)

        returns_array = np.array(returns)

        mean = np.mean(returns_array)
        std_dev = np.std(returns_array, ddof=1)

        z_score = norm.ppf(1 - confidence_level)

        var = mean + z_score * std_dev

        return float(var)

    # -----------------------------
    # MONTE CARLO VAR (OPTIONAL)
    # -----------------------------
    @staticmethod
    def monte_carlo_var(
        returns: List[float],
        confidence_level: float,
        simulations: int = 10000
    ) -> float:
        """
        Monte Carlo VaR using normal assumption
        """
        ValueAtRiskCalculator.validate_inputs(returns, confidence_level)

        returns_array = np.array(returns)

        mean = np.mean(returns_array)
        std_dev = np.std(returns_array, ddof=1)

        simulated = np.random.normal(mean, std_dev, simulations)
        simulated.sort()

        index = int((1 - confidence_level) * simulations)

        return float(simulated[index])

    # -----------------------------
    # SUMMARY
    # -----------------------------
    @staticmethod
    def summary(
        returns: List[float],
        confidence_level: float = 0.95
    ) -> Dict:
        """
        Full VaR report (multiple methods)
        """
        return {
            "confidence_level": confidence_level,
            "historical_var": ValueAtRiskCalculator.historical_var(
                returns, confidence_level
            ),
            "parametric_var": ValueAtRiskCalculator.parametric_var(
                returns, confidence_level
            ),
            "monte_carlo_var": ValueAtRiskCalculator.monte_carlo_var(
                returns, confidence_level
            ),
        }