from typing import Dict


class PremiumCalculator:
    """
    Actuarial Premium Calculator

    Computes:
    - Pure Premium
    - Loaded Premium
    - Discounted Premium
    """

    def __init__(
        self,
        expense_ratio: float = 0.2,
        profit_margin: float = 0.1,
        discount_rate: float = 0.05,
    ):
        self.expense_ratio = expense_ratio
        self.profit_margin = profit_margin
        self.discount_rate = discount_rate

    # -------------------------------
    # Pure Premium
    # -------------------------------
    def pure_premium(self, frequency: float, severity: float) -> float:
        """
        Pure Premium = Frequency × Severity
        """
        return round(frequency * severity, 6)

    # -------------------------------
    # Expense Loading
    # -------------------------------
    def apply_expenses(self, premium: float) -> float:
        return premium * (1 + self.expense_ratio)

    # -------------------------------
    # Profit Loading
    # -------------------------------
    def apply_profit(self, premium: float) -> float:
        return premium * (1 + self.profit_margin)

    # -------------------------------
    # Discounting
    # -------------------------------
    def discount(self, premium: float, t: int) -> float:
        """
        Present value adjustment
        """
        return premium / ((1 + self.discount_rate) ** t)

    # -------------------------------
    # Final Premium Calculation
    # -------------------------------
    def calculate(
        self,
        frequency: float,
        severity: float,
        term: int = 1
    ) -> Dict:
        """
        Full pricing pipeline
        """
        pure = self.pure_premium(frequency, severity)

        with_expenses = self.apply_expenses(pure)
        with_profit = self.apply_profit(with_expenses)
        discounted = self.discount(with_profit, term)

        return {
            "pure_premium": round(pure, 6),
            "with_expenses": round(with_expenses, 6),
            "with_profit": round(with_profit, 6),
            "final_premium": round(discounted, 6),
        }