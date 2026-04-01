from typing import Dict, Any

# Base agent
from .base_agent import BaseAgent

# Validators
from src.validators.assumption_validator import AssumptionValidator
from src.validators.model_validator import ModelValidator

# Actuarial models (adjust imports if needed)
from src.models.mortality.mortality_rates import MortalityTable
from src.models.pricing.rating_factors import RatingEngine, RatingFactor


class ActuarialAgent(BaseAgent):
    """
    AI Agent: Actuarial Specialist

    Capabilities:
    - Mortality analysis
    - Premium calculation
    - Risk evaluation
    - Model validation
    """

    def __init__(self):
        super().__init__("ActuarialAgent")

        self.assumption_validator = AssumptionValidator()
        self.model_validator = ModelValidator()

    # -------------------------------
    # Core Execution
    # -------------------------------
    def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Expected input:
        {
            "mortality_table": {30: 0.001, 31: 0.0012},
            "age": 30,
            "term": 5,
            "base_premium": 100,
            "rating_inputs": {"age": "26-40", "smoker": "yes"}
        }
        """

        self.validate_input(input_data)

        # Extract inputs
        qx = input_data.get("mortality_table")
        age = input_data.get("age")
        term = input_data.get("term")
        base_premium = input_data.get("base_premium", 100)
        rating_inputs = input_data.get("rating_inputs", {})

        # -------------------------------
        # Validate assumptions
        # -------------------------------
        self.assumption_validator.validate_mortality_table(qx)
        self.assumption_validator.validate_premium(base_premium)

        # -------------------------------
        # Mortality Modeling
        # -------------------------------
        mortality_model = MortalityTable(qx)

        survival_prob = mortality_model.survival_probability(age, term)
        death_prob = mortality_model.death_probability(age, term)

        life_expectancy = mortality_model.life_expectancy(age)

        # -------------------------------
        # Pricing (Rating Engine)
        # -------------------------------
        rating_engine = RatingEngine(base_premium)

        # Example rating factors (can be dynamic)
        rating_engine.add_factor(
            RatingFactor("age", {
                "18-25": 1.5,
                "26-40": 1.2,
                "41+": 1.1
            })
        )

        rating_engine.add_factor(
            RatingFactor("smoker", {
                "yes": 2.0,
                "no": 1.0
            })
        )

        pricing_result = rating_engine.calculate(rating_inputs)

        premium = pricing_result["final_premium"]

        # -------------------------------
        # Validate outputs
        # -------------------------------
        self.model_validator.validate_premium_output(premium)

        # -------------------------------
        # Risk Score (simple)
        # -------------------------------
        risk_score = round(death_prob * premium, 4)

        # -------------------------------
        # Final Output
        # -------------------------------
        return {
            "mortality": {
                "survival_probability": survival_prob,
                "death_probability": death_prob,
                "life_expectancy": life_expectancy
            },
            "pricing": pricing_result,
            "risk": {
                "risk_score": risk_score
            }
        }