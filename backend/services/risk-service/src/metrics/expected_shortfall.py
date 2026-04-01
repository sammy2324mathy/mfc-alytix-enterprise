# expected_shortfall.py placeholder
from typing import List, Dict
import numpy as np


class ExpectedShortfallCalculator:
    """
    Expected Shortfall (ES) / Conditional VaR (CVaR)

    Measures the average loss beyond the Value at Risk (VaR).
    """

    @staticmethod
    def validate_inputs(returns: List[float], confidence_level: float):
        if len(returns) < 2:
            raise ValueError("At least two return observations are required.")

        if not (0 < confidence_level < 1):
            raise ValueError("Confidence level must be between 0 and 1.")

    @staticmethod
    def value_at_risk(returns: List[float], confidence_level: float) -> float:
        """
        Historical VaR
        """
        sorted_returns = np.sort(returns)
        index = int((1 - confidence_level) * len(sorted_returns))
        return float(sorted_returns[index])

    @staticmethod
    def expected_shortfall(returns: List[float], confidence_level: float) -> float:
        """
        ES = average of losses worse than VaR
        """
        ExpectedShortfallCalculator.validate_inputs(returns, confidence_level)

        sorted_returns = np.sort(returns)
        var_threshold = ExpectedShortfallCalculator.value_at_risk(
            sorted_returns, confidence_level
        )

        tail_losses = sorted_returns[sorted_returns <= var_threshold]

        if len(tail_losses) == 0:
            return 0.0

        return float(np.mean(tail_losses))

    @staticmethod
    def summary(returns: List[float], confidence_level: float = 0.95) -> Dict:
        """
        Full ES report
        """
        var = ExpectedShortfallCalculator.value_at_risk(
            returns, confidence_level
        )
        es = ExpectedShortfallCalculator.expected_shortfall(
            returns, confidence_level
        )

        return {
            "confidence_level": confidence_level,
            "value_at_risk": var,
            "expected_shortfall": es,
        }