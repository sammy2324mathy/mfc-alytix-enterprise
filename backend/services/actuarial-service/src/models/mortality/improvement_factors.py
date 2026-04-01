# improvement_factors.py placeholder
from typing import List, Dict


class MortalityImprovementModel:
    """
    Mortality Improvement Model

    Applies improvement factors to base mortality rates:
        q_x,t = q_x,0 × (1 - improvement_rate)^t
    """

    def __init__(self, improvement_rate: float = 0.01):
        """
        improvement_rate: annual mortality improvement (e.g., 0.01 = 1%)
        """
        self.improvement_rate = improvement_rate

    # -------------------------------
    # Apply Improvement (Single Age)
    # -------------------------------
    def apply(
        self,
        base_mortality: float,
        years: int
    ) -> float:
        """
        Adjust mortality for future years
        """
        improved_rate = base_mortality * ((1 - self.improvement_rate) ** years)

        return round(improved_rate, 8)

    # -------------------------------
    # Apply to Mortality Table
    # -------------------------------
    def apply_table(
        self,
        mortality_table: Dict[int, float],
        years: int
    ) -> Dict[int, float]:
        """
        Apply improvements across all ages
        """
        improved_table = {}

        for age, qx in mortality_table.items():
            improved_table[age] = self.apply(qx, years)

        return improved_table

    # -------------------------------
    # Multi-Year Projection
    # -------------------------------
    def project(
        self,
        mortality_table: Dict[int, float],
        max_years: int
    ) -> Dict[int, Dict[int, float]]:
        """
        Project mortality table over multiple years

        Returns:
            {year: {age: qx}}
        """
        projections = {}

        for year in range(max_years + 1):
            projections[year] = self.apply_table(mortality_table, year)

        return projections

    # -------------------------------
    # Cohort Mortality Adjustment
    # -------------------------------
    def cohort_adjustment(
        self,
        base_mortality: float,
        birth_year: int,
        current_year: int
    ) -> float:
        """
        Apply cohort-based improvement
        """
        years = current_year - birth_year

        return self.apply(base_mortality, years)

    # -------------------------------
    # Summary Metrics
    # -------------------------------
    def analyze(
        self,
        mortality_table: Dict[int, float],
        years: int
    ) -> Dict:
        """
        Returns improved table + average change
        """
        improved = self.apply_table(mortality_table, years)

        avg_before = sum(mortality_table.values()) / len(mortality_table)
        avg_after = sum(improved.values()) / len(improved)

        return {
            "average_mortality_before": round(avg_before, 8),
            "average_mortality_after": round(avg_after, 8),
            "improvement": round(avg_before - avg_after, 8),
            "table": improved
        }