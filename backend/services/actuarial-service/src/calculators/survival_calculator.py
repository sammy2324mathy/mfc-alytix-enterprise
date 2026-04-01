from typing import List, Dict
import numpy as np


class SurvivalCalculator:
    """
    Core actuarial survival analysis engine.
    Implements:
    - Kaplan-Meier estimator
    - Hazard function
    """

    # -------------------------------
    # Kaplan-Meier Estimator
    # -------------------------------
    def kaplan_meier(self, time: List[float], event: List[int]) -> List[Dict]:
        """
        Computes survival probabilities over time.
        """
        data = sorted(zip(time, event), key=lambda x: x[0])

        times = np.array([t for t, _ in data])
        events = np.array([e for _, e in data])

        unique_times = np.unique(times)

        n = len(times)
        survival_prob = 1.0

        result = []

        for t in unique_times:
            at_risk = np.sum(times >= t)
            events_at_t = np.sum((times == t) & (events == 1))

            if at_risk > 0:
                survival_prob *= (1 - events_at_t / at_risk)

            result.append({
                "time": float(t),
                "survival_probability": float(round(survival_prob, 6))
            })

        return result

    # -------------------------------
    # Median Survival Time
    # -------------------------------
    def median_survival_time(self, survival_curve: List[Dict]) -> float:
        """
        Returns time where survival probability <= 0.5
        """
        for point in survival_curve:
            if point["survival_probability"] <= 0.5:
                return point["time"]

        return None

    # -------------------------------
    # Hazard Function
    # -------------------------------
    def hazard_function(self, time: List[float], event: List[int]) -> List[Dict]:
        """
        Estimates hazard rate at each time point.
        """
        data = sorted(zip(time, event), key=lambda x: x[0])

        times = np.array([t for t, _ in data])
        events = np.array([e for _, e in data])

        unique_times = np.unique(times)

        result = []

        for t in unique_times:
            at_risk = np.sum(times >= t)
            events_at_t = np.sum((times == t) & (events == 1))

            hazard = (events_at_t / at_risk) if at_risk > 0 else 0

            result.append({
                "time": float(t),
                "hazard": float(round(hazard, 6))
            })

        return result

    # -------------------------------
    # Full Survival Analysis
    # -------------------------------
    def analyze(self, time: List[float], event: List[int]) -> Dict:
        """
        Full pipeline:
        - Survival curve
        - Median survival
        - Hazard function
        """
        survival_curve = self.kaplan_meier(time, event)
        median_time = self.median_survival_time(survival_curve)
        hazard_curve = self.hazard_function(time, event)

        return {
            "survival_curve": survival_curve,
            "median_survival_time": median_time,
            "hazard_curve": hazard_curve
        }