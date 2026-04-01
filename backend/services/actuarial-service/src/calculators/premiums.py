from pydantic import BaseModel
import math

class PremiumCalculator:
    @staticmethod
    def calculate_term_life_premium(age: int, death_benefit: float, interest_rate: float, term_years: int) -> float:
        """
        Simplified term life premium calculation based on mortality curve approximations.
        """
        # Extremely simplified mortality prob curve
        base_mortality_rate = 0.001
        mortality_scalar = math.exp((age - 30) * 0.08)
        annual_mortality = base_mortality_rate * mortality_scalar
        
        # Present value of benefits
        pv_benefits = sum(death_benefit * annual_mortality / ((1 + interest_rate) ** t) for t in range(1, term_years + 1))
        
        # Present value of an annuity due of $1
        annuity_factor = sum(1 / ((1 + interest_rate) ** t) for t in range(term_years))
        
        annual_premium = pv_benefits / annuity_factor
        return round(annual_premium, 2)
