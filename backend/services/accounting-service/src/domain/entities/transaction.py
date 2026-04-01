from dataclasses import dataclass, field
from datetime import datetime
from uuid import uuid4


@dataclass
class Transaction:
    """
    Domain Entity: Transaction

    Represents a financial transaction in the system.
    Enforces basic business rules.
    """

    debit_account_id: int
    credit_account_id: int
    amount: float

    id: str = field(default_factory=lambda: str(uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
    description: str = ""

    def __post_init__(self):
        self._validate()

    # -------------------------------
    # Business Rules Validation
    # -------------------------------
    def _validate(self):
        if self.amount <= 0:
            raise ValueError("Transaction amount must be greater than zero")

        if self.debit_account_id == self.credit_account_id:
            raise ValueError("Debit and credit accounts must be different")

    # -------------------------------
    # Convert to dict (for persistence)
    # -------------------------------
    def to_dict(self):
        return {
            "id": self.id,
            "debit_account_id": self.debit_account_id,
            "credit_account_id": self.credit_account_id,
            "amount": self.amount,
            "description": self.description,
            "created_at": self.created_at,
        }

    # -------------------------------
    # Domain Behavior
    # -------------------------------
    def get_summary(self):
        return {
            "transaction_id": self.id,
            "amount": self.amount,
            "from_account": self.debit_account_id,
            "to_account": self.credit_account_id,
            "timestamp": self.created_at.isoformat()
        }