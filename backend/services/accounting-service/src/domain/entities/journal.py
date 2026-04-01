from dataclasses import dataclass, field
from datetime import datetime
from typing import List
from uuid import uuid4


# -------------------------------
# Journal Line (Detail)
# -------------------------------
@dataclass
class JournalLine:
    account_id: int
    amount: float
    entry_type: str  # "debit" or "credit"

    def __post_init__(self):
        if self.amount <= 0:
            raise ValueError("Amount must be greater than zero")

        if self.entry_type not in ["debit", "credit"]:
            raise ValueError("Entry type must be 'debit' or 'credit'")


# -------------------------------
# Journal Entry (Header + Lines)
# -------------------------------
@dataclass
class JournalEntry:
    description: str
    lines: List[JournalLine]

    id: str = field(default_factory=lambda: str(uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)

    def __post_init__(self):
        self._validate()

    # -------------------------------
    # Validation
    # -------------------------------
    def _validate(self):
        if not self.lines or len(self.lines) < 2:
            raise ValueError("Journal entry must have at least two lines")

        if not self.is_balanced():
            raise ValueError("Journal entry is not balanced")

    # -------------------------------
    # Check Balance
    # -------------------------------
    def is_balanced(self) -> bool:
        total_debit = sum(line.amount for line in self.lines if line.entry_type == "debit")
        total_credit = sum(line.amount for line in self.lines if line.entry_type == "credit")

        return round(total_debit, 2) == round(total_credit, 2)

    # -------------------------------
    # Totals
    # -------------------------------
    def get_totals(self):
        total_debit = sum(line.amount for line in self.lines if line.entry_type == "debit")
        total_credit = sum(line.amount for line in self.lines if line.entry_type == "credit")

        return {
            "total_debit": round(total_debit, 2),
            "total_credit": round(total_credit, 2),
            "is_balanced": self.is_balanced()
        }

    # -------------------------------
    # Convert to Ledger Entries
    # -------------------------------
    def to_ledger_entries(self):
        """
        Converts journal lines into ledger entries format.
        """
        return [
            {
                "account_id": line.account_id,
                "amount": line.amount,
                "type": line.entry_type,
                "created_at": self.created_at
            }
            for line in self.lines
        ]

    # -------------------------------
    # Serialize
    # -------------------------------
    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "created_at": self.created_at,
            "lines": [
                {
                    "account_id": line.account_id,
                    "amount": line.amount,
                    "type": line.entry_type
                }
                for line in self.lines
            ],
            "totals": self.get_totals()
        }