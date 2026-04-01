from dataclasses import dataclass
import re


@dataclass(frozen=True)
class AccountNumber:
    """
    Value Object: AccountNumber

    Represents a validated account number.
    Immutable and enforces structure rules.
    """

    value: str

    def __post_init__(self):
        if not self.value:
            raise ValueError("Account number cannot be empty")

        normalized = self.value.strip()

        if not self._is_valid_format(normalized):
            raise ValueError(f"Invalid account number format: {self.value}")

        object.__setattr__(self, "value", normalized)

    # -------------------------------
    # Validation Rules
    # -------------------------------
    def _is_valid_format(self, value: str) -> bool:
        """
        Example formats supported:
        - 1000
        - 1000-01
        - 2000-EXP
        - ACC-1001

        Customize this to match your chart of accounts structure.
        """
        pattern = r"^[A-Z0-9\-]+$"
        return re.match(pattern, value) is not None

    # -------------------------------
    # Helpers
    # -------------------------------
    def prefix(self) -> str:
        """
        Returns first segment of account number
        Example: 1000-01 → 1000
        """
        return self.value.split("-")[0]

    def segments(self):
        return self.value.split("-")

    # -------------------------------
    # Comparison
    # -------------------------------
    def __eq__(self, other):
        return isinstance(other, AccountNumber) and self.value == other.value

    def __lt__(self, other: "AccountNumber"):
        return self.value < other.value

    # -------------------------------
    # Serialize
    # -------------------------------
    def to_dict(self):
        return {"account_number": self.value}

    def __str__(self):
        return self.value