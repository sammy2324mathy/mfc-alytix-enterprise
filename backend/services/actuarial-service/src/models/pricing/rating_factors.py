from typing import Dict, List


class RatingFactor:
    """
    Represents a single rating factor.
    Example: age factor, smoker factor
    """

    def __init__(self, name: str, relativities: Dict[str, float]):
        """
        relativities: mapping of category → multiplier
        """
        self.name = name
        self.relativities = relativities

    def get_factor(self, value: str) -> float:
        """
        Get factor for given category
        """
        return self.relativities.get(value, 1.0)


class RatingEngine:
    """
    Applies multiple rating factors to compute adjusted premium
    """

    def __init__(self, base_rate: float):
        self.base_rate = base_rate
        self.factors: List[RatingFactor] = []

    # -------------------------------
    # Add Rating Factor
    # -------------------------------
    def add_factor(self, factor: RatingFactor):
        self.factors.append(factor)

    # -------------------------------
    # Calculate Premium
    # -------------------------------
    def calculate(self, inputs: Dict[str, str]) -> Dict:
        """
        inputs: {"age": "30-40", "smoker": "yes"}
        """
        premium = self.base_rate
        breakdown = []

        for factor in self.factors:
            value = inputs.get(factor.name)
            multiplier = factor.get_factor(value)

            premium *= multiplier

            breakdown.append({
                "factor": factor.name,
                "value": value,
                "multiplier": multiplier
            })

        return {
            "base_rate": self.base_rate,
            "final_premium": round(premium, 6),
            "breakdown": breakdown
        }

    # -------------------------------
    # Total Multiplier
    # -------------------------------
    def total_multiplier(self, inputs: Dict[str, str]) -> float:
        multiplier = 1.0

        for factor in self.factors:
            value = inputs.get(factor.name)
            multiplier *= factor.get_factor(value)

        return round(multiplier, 6)