from typing import List, Dict


class AssumptionValidator:
    """
    Validates actuarial assumptions:
    - Mortality rates
    - Interest rates
    - Claims data
    - Exposure
    """

    # -------------------------------
    # Interest Rate Validation
    # -------------------------------
    def validate_interest_rate(self, rate: float):
        if rate < 0 or rate > 1:
            raise ValueError("Interest rate must be between 0 and 1")

    # -------------------------------
    # Mortality Table Validation
    # -------------------------------
    def validate_mortality_table(self, qx: Dict[int, float]):
        if not qx:
            raise ValueError("Mortality table cannot be empty")

        for age, rate in qx.items():
            if rate < 0 or rate > 1:
                raise ValueError(f"Invalid mortality rate at age {age}")

    # -------------------------------
    # Claims Data Validation
    # -------------------------------
    def validate_claims(self, claims: List[float]):
        if not claims:
            raise ValueError("Claims list cannot be empty")

        for c in claims:
            if c < 0:
                raise ValueError("Claim amounts must be non-negative")

    # -------------------------------
    # Exposure Validation
    # -------------------------------
    def validate_exposure(self, exposure: float):
        if exposure <= 0:
            raise ValueError("Exposure must be greater than zero")

    # -------------------------------
    # Premium Validation
    # -------------------------------
    def validate_premium(self, premium: float):
        if premium < 0:
            raise ValueError("Premium must be non-negative")

    # -------------------------------
    # Survival Data Validation
    # -------------------------------
    def validate_survival_data(self, time: List[float], event: List[int]):
        if len(time) != len(event):
            raise ValueError("Time and event arrays must be same length")

        for t in time:
            if t < 0:
                raise ValueError("Time values must be non-negative")

        for e in event:
            if e not in (0, 1):
                raise ValueError("Event must be 0 (censored) or 1 (event)")

    # -------------------------------
    # Discount Rate Validation
    # -------------------------------
    def validate_discount_rate(self, rate: float):
        if rate < 0 or rate > 1:
            raise ValueError("Discount rate must be between 0 and 1")

    # -------------------------------
    # General Validation Pipeline
    # -------------------------------
    def validate_pricing_inputs(
        self,
        base_premium: float,
        term_years: int,
        discount_rate: float
    ):
        self.validate_premium(base_premium)

        if term_years <= 0:
            raise ValueError("Term years must be positive")

        self.validate_discount_rate(discount_rate)

    # -------------------------------
    # Full Claims Validation
    # -------------------------------
    def validate_claims_model_inputs(
        self,
        claims: List[float],
        exposure: float,
        premiums: float
    ):
        self.validate_claims(claims)
        self.validate_exposure(exposure)
        self.validate_premium(premiums)