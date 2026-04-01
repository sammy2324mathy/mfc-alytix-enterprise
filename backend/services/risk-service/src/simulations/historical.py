from typing import List, Dict, Optional
import numpy as np

from src.metrics.value_at_risk import ValueAtRiskCalculator
from src.metrics.expected_shortfall import ExpectedShortfallCalculator
from src.models.volatility import VolatilityCalculator


class HistoricalSimulator:
    """
    Historical simulation engine (non-parametric)

    Uses actual observed returns instead of assuming distributions.
    """

    @staticmethod
    def validate_inputs(returns: List[float]):
        if len(returns) < 2:
            raise ValueError("At least two return observations are required.")

    # -----------------------------
    # SINGLE-ASSET HISTORICAL SIM
    # -----------------------------
    @staticmethod
    def simulate(
        returns: List[float],
        confidence_level: float = 0.95
    ) -> Dict:
        """
        Historical VaR & ES using observed returns
        """
        HistoricalSimulator.validate_inputs(returns)

        var = ValueAtRiskCalculator.historical_var(
            returns, confidence_level
        )

        es = ExpectedShortfallCalculator.expected_shortfall(
            returns, confidence_level
        )

        volatility = VolatilityCalculator.historical_volatility(returns)

        returns_array = np.array(returns)

        return {
            "confidence_level": confidence_level,
            "value_at_risk": var,
            "expected_shortfall": es,
            "volatility": volatility,
            "mean_return": float(np.mean(returns_array)),
            "min_return": float(np.min(returns_array)),
            "max_return": float(np.max(returns_array)),
        }

    # -----------------------------
    # PORTFOLIO HISTORICAL SIM
    # -----------------------------
    @staticmethod
    def simulate_portfolio(
        returns_matrix: np.ndarray,
        weights: np.ndarray,
        confidence_level: float = 0.95
    ) -> Dict:
        """
        Historical simulation for multi-asset portfolio

        returns_matrix: (samples x assets)
        weights: (assets,)
        """
        if returns_matrix.shape[1] != len(weights):
            raise ValueError("Weights must match number of assets")

        # Compute portfolio returns
        portfolio_returns = returns_matrix @ weights

        return HistoricalSimulator.simulate(
            portfolio_returns.tolist(),
            confidence_level
        )

    # -----------------------------
    # BOOTSTRAP SAMPLING
    # -----------------------------
    @staticmethod
    def bootstrap(
        returns: List[float],
        simulations: int = 10000
    ) -> np.ndarray:
        """
        Resample returns with replacement
        """
        HistoricalSimulator.validate_inputs(returns)

        returns_array = np.array(returns)

        sampled = np.random.choice(
            returns_array,
            size=simulations,
            replace=True
        )

        return sampled

    # -----------------------------
    # BOOTSTRAP + RISK METRICS
    # -----------------------------
    @staticmethod
    def bootstrap_simulation(
        returns: List[float],
        confidence_level: float = 0.95,
        simulations: int = 10000
    ) -> Dict:
        """
        Bootstrap-based risk estimation
        """
        sampled_returns = HistoricalSimulator.bootstrap(
            returns, simulations
        )

        return HistoricalSimulator.simulate(
            sampled_returns.tolist(),
            confidence_level
        )

    # -----------------------------
    # FULL SUMMARY
    # -----------------------------
    @staticmethod
    def summary(
        returns: List[float],
        confidence_level: float = 0.95,
        simulations: Optional[int] = None
    ) -> Dict:
        """
        Combine raw historical + bootstrap
        """
        result = {
            "historical": HistoricalSimulator.simulate(
                returns, confidence_level
            )
        }

        if simulations:
            result["bootstrap"] = HistoricalSimulator.bootstrap_simulation(
                returns,
                confidence_level,
                simulations
            )

        return result