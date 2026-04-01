from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP


@dataclass(frozen=True)
class Money:
    """
    Value Object: Money

    Represents monetary value with precision and currency.
    Immutable and safe for financial calculations.
    """

    amount: Decimal
    currency: str = "USD"

    def __post_init__(self):
        if not isinstance(self.amount, Decimal):
            object.__setattr__(self, "amount", Decimal(str(self.amount)))

        if self.amount < 0:
            raise ValueError("Money amount cannot be negative")

        if not self.currency:
            raise ValueError("Currency must be provided")

        # Normalize to 2 decimal places
        normalized = self.amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        object.__setattr__(self, "amount", normalized)

    # -------------------------------
    # Arithmetic Operations
    # -------------------------------
    def add(self, other: "Money") -> "Money":
        self._check_currency(other)
        return Money(self.amount + other.amount, self.currency)

    def subtract(self, other: "Money") -> "Money":
        self._check_currency(other)
        result = self.amount - other.amount
        if result < 0:
            raise ValueError("Resulting money cannot be negative")
        return Money(result, self.currency)

    def multiply(self, factor: float) -> "Money":
        result = self.amount * Decimal(str(factor))
        return Money(result, self.currency)

    # -------------------------------
    # Comparison
    # -------------------------------
    def __eq__(self, other):
        return (
            isinstance(other, Money)
            and self.amount == other.amount
            and self.currency == other.currency
        )

    def __lt__(self, other: "Money"):
        self._check_currency(other)
        return self.amount < other.amount

    def __le__(self, other: "Money"):
        self._check_currency(other)
        return self.amount <= other.amount

    # -------------------------------
    # Utility
    # -------------------------------
    def _check_currency(self, other: "Money"):
        if self.currency != other.currency:
            raise ValueError("Currency mismatch")

    def to_dict(self):
        return {
            "amount": float(self.amount),
            "currency": self.currency
        }

    def __str__(self):
        return f"{self.currency} {self.amount}"