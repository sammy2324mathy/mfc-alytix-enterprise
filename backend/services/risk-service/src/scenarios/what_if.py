from typing import List, Dict
import numpy as np


class StressTestEngine:
    """
    Stress testing engine for financial risk scenarios
    """

    @staticmethod
    def validate_inputs(returns: List[float]):
        if len(returns) < 2:
            raise ValueError("At least two return observations are required.")

    # -----------------------------
    # MARKET CRASH SCENARIO
    # -----------------------------
    @staticmethod
    def market_crash(returns: List[float], shock: float = -0.2) -> List[float]:
        """
        Apply a uniform market crash shock
        Example: -20% shock
        """
        StressTestEngine.validate_inputs(returns)
        return [r + shock for r in returns]

    # -----------------------------
    # VOLATILITY SPIKE
    # -----------------------------
    @staticmethod
    def volatility_spike(
        returns: List[float],
        multiplier: float = 2.0
    ) -> List[float]:
        """
        Increase volatility by scaling deviations
        """
        StressTestEngine.validate_inputs(returns)

        returns_array = np.array(returns)
        mean = np.mean(returns_array)

        stressed = mean + multiplier * (returns_array - mean)

        return stressed.tolist()

    # -----------------------------
    # INTEREST RATE SHOCK
    # -----------------------------
    @staticmethod
    def interest_rate_shock(
        returns: List[float],
        rate_shift: float = -0.01
    ) -> List[float]:
        """
        Simulate rate impact (proxy)
        """
        StressTestEngine.validate_inputs(returns)
        return [r + rate_shift for r in returns]

    # -----------------------------
    # COMBINED SCENARIO
    # -----------------------------
    @staticmethod
    def combined_scenario(
        returns: List[float],
        crash: float = -0.15,
        vol_multiplier: float = 1.5
    ) -> List[float]:
        """
        Apply crash + volatility spike
        """
        stressed = StressTestEngine.market_crash(returns, crash)
        stressed = StressTestEngine.volatility_spike(stressed, vol_multiplier)
        return stressed

    # -----------------------------
    # PORTFOLIO STRESS (MULTI-ASSET)
    # -----------------------------
    @staticmethod
    def portfolio_stress(
        data: np.ndarray,
        shock_vector: np.ndarray
    ) -> np.ndarray:
        """
        Apply asset-specific shocks

        data: (samples x assets)
        shock_vector: (assets,)
        """
        if data.shape[1] != len(shock_vector):
            raise ValueError("Shock vector must match number of assets")

        return data + shock_vector

    # -----------------------------
    # SUMMARY
    # -----------------------------
    @staticmethod
    def summary(returns: List[float]) -> Dict:
        """
        Generate multiple stress scenarios
        """
        crash = StressTestEngine.market_crash(returns)
        vol = StressTestEngine.volatility_spike(returns)
        combined = StressTestEngine.combined_scenario(returns)

        return {
            "market_crash_min": float(np.min(crash)),
            "volatility_spike_std": float(np.std(vol)),
            "combined_min": float(np.min(combined)),
        }