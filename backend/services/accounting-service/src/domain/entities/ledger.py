from dataclasses import dataclass, field
from datetime import datetime
from typing import List
from uuid import uuid4


# -------------------------------
# Ledger Entry (Single Line)
# -------------------------------
@dataclass
class LedgerEntry:
    account_id: int
    amount: float
    entry_type: str  # "debit" or "credit"

    id: str = field(default_factory=lambda: str(uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)

    def __post_init__(self):
        self._validate()

    def _validate(self):
        if self.amount <= 0:
            raise ValueError("Amount must be greater than zero")

        if self.entry_type not in ["debit", "credit"]:
            raise ValueError("Entry type must be 'debit' or 'credit'")


# -------------------------------
# Ledger (Aggregate Root Entity)
# -------------------------------
class Ledger:
    """
    Represents a collection of ledger entries for a transaction.
    Enforces double-entry accounting rules.
    """

    def __init__(self):
        self.entries: List[LedgerEntry] = []

    # -------------------------------
    # Add Entry
    # -------------------------------
    def add_entry(self, entry: LedgerEntry):
        self.entries.append(entry)

    # -------------------------------
    # Create Double Entry
    # -------------------------------
    def post_transaction(self, debit_account_id: int, credit_account_id: int, amount: float):
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")

        if debit_account_id == credit_account_id:
            raise ValueError("Debit and credit accounts must differ")

        debit_entry = LedgerEntry(
            account_id=debit_account_id,
            amount=amount,
            entry_type="debit"
        )

        credit_entry = LedgerEntry(
            account_id=credit_account_id,
            amount=amount,
            entry_type="credit"
        )

        self.entries.extend([debit_entry, credit_entry])

        # Validate after posting
        if not self.is_balanced():
            raise ValueError("Ledger is not balanced after transaction")

    # -------------------------------
    # Check Balance
    # -------------------------------
    def is_balanced(self) -> bool:
        total_debit = sum(e.amount for e in self.entries if e.entry_type == "debit")
        total_credit = sum(e.amount for e in self.entries if e.entry_type == "credit")

        return round(total_debit, 2) == round(total_credit, 2)

    # -------------------------------
    # Get Totals
    # -------------------------------
    def get_totals(self):
        total_debit = sum(e.amount for e in self.entries if e.entry_type == "debit")
        total_credit = sum(e.amount for e in self.entries if e.entry_type == "credit")

        return {
            "total_debit": round(total_debit, 2),
            "total_credit": round(total_credit, 2),
            "is_balanced": self.is_balanced()
        }

    # -------------------------------
    # Export Entries (for DB)
    # -------------------------------
    def to_dict(self):
        return [
            {
                "id": entry.id,
                "account_id": entry.account_id,
                "amount": entry.amount,
                "type": entry.entry_type,
                "created_at": entry.created_at,
            }
            for entry in self.entries
        ]