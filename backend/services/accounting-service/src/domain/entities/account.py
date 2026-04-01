from dataclasses import dataclass, field
from datetime import datetime
from uuid import uuid4


VALID_ACCOUNT_TYPES = ["asset", "liability", "equity", "revenue", "expense"]


@dataclass
class Account:
    """
    Domain Entity: Account

    Represents a ledger account in the chart of accounts.
    """

    name: str
    account_type: str

    id: str = field(default_factory=lambda: str(uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
    balance: float = 0.0

    def __post_init__(self):
        self._validate()

    # -------------------------------
    # Validation
    # -------------------------------
    def _validate(self):
        if self.account_type not in VALID_ACCOUNT_TYPES:
            raise ValueError(
                f"Invalid account type. Must be one of {VALID_ACCOUNT_TYPES}"
            )

        if not self.name:
            raise ValueError("Account name cannot be empty")

    # -------------------------------
    # Apply Debit
    # -------------------------------
    def apply_debit(self, amount: float):
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")

        if self.account_type in ["asset", "expense"]:
            self.balance += amount
        else:
            self.balance -= amount

    # -------------------------------
    # Apply Credit
    # -------------------------------
    def apply_credit(self, amount: float):
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")

        if self.account_type in ["liability", "equity", "revenue"]:
            self.balance += amount
        else:
            self.balance -= amount

    # -------------------------------
    # Apply Entry (generic)
    # -------------------------------
    def apply_entry(self, entry_type: str, amount: float):
        if entry_type == "debit":
            self.apply_debit(amount)
        elif entry_type == "credit":
            self.apply_credit(amount)
        else:
            raise ValueError("Entry type must be 'debit' or 'credit'")

    # -------------------------------
    # Serialize
    # -------------------------------
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "account_type": self.account_type,
            "balance": round(self.balance, 2),
            "created_at": self.created_at,
        }