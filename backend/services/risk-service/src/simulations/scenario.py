from typing import List, Dict, Optional
import numpy as np

from src.metrics.value_at_risk import ValueAtRiskCalculator
from src.metrics.expected_shortfall import ExpectedShortfallCalculator
from src.models.volatility import VolatilityCalculator
from src.scenarios.stress_tests import StressTestEngine


class ScenarioSimulator:
    """
    Scenario-based simulation engine

    Combines:
    - Monte Carlo simulation
    - Stress testing
    - Risk metrics (VaR, ES)
    """

    @staticmethod
    def validate_inputs(returns: List[float]):
        if len(returns) < 2:
            raise ValueError("At least two return observations are required.")

    # -----------------------------
    # MONTE CARLO SIMULATION
    # -----------------------------
    @staticmethod
    def monte_carlo(
        returns: List[float],
        simulations: int = 10000
    ) -> np.ndarray:
        """
        Generate simulated returns using normal assumption
        """
        ScenarioSimulator.validate_inputs(returns)

        returns_array = np.array(returns)
        mean = np.mean(returns_array)
        std = np.std(returns_array, ddof=1)

        simulated = np.random.normal(mean, std, simulations)

        return simulated

    # -----------------------------
    # APPLY STRESS SCENARIO
    # -----------------------------
    @staticmethod
    def apply_stress(
        returns: List[float],
        scenario: str = "crash"
    ) -> List[float]:
        """
        Apply predefined stress scenarios
        """
        if scenario == "crash":
            return StressTestEngine.market_crash(returns)

        elif scenario == "volatility":
            return StressTestEngine.volatility_spike(returns)

        elif scenario == "combined":
            return StressTestEngine.combined_scenario(returns)

        else:
            raise ValueError(f"Unknown scenario: {scenario}")

    # -----------------------------
    # FULL SIMULATION PIPELINE
    # -----------------------------
    @staticmethod
    def run(
        returns: List[float],
        confidence_level: float = 0.95,
        simulations: int = 10000,
        scenario: Optional[str] = None
    ) -> Dict:
        """
        Full pipeline:
        1. Optional stress scenario
        2. Monte Carlo simulation
        3. Risk metrics
        """
        ScenarioSimulator.validate_inputs(returns)

        # Apply stress if provided
        if scenario:
            returns = ScenarioSimulator.apply_stress(returns, scenario)

        # Simulate
        simulated_returns = ScenarioSimulator.monte_carlo(
            returns, simulations
        )

        simulated_list = simulated_returns.tolist()

        # Risk metrics
        var = ValueAtRiskCalculator.historical_var(
            simulated_list, confidence_level
        )

        es = ExpectedShortfallCalculator.expected_shortfall(
            simulated_list, confidence_level
        )

        volatility = VolatilityCalculator.historical_volatility(
            simulated_list
        )

        return {
            "confidence_level": confidence_level,
            "scenario": scenario or "baseline",
            "value_at_risk": var,
            "expected_shortfall": es,
            "volatility": volatility,
            "mean_return": float(np.mean(simulated_returns)),
            "min_return": float(np.min(simulated_returns)),
            "max_return": float(np.max(simulated_returns)),
        }