from typing import List, Sequence

from sqlalchemy.orm import Session

from src.infrastructure.models import JournalEntry, Transaction


class TransactionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, description: str, lines: Sequence[dict]) -> Transaction:
        tx = Transaction(description=description)
        self.db.add(tx)
        self.db.flush()
        for line in lines:
            entry = JournalEntry(
                transaction_id=tx.id,
                account_id=int(line["account_id"]),
                debit=float(line.get("debit", 0) or 0),
                credit=float(line.get("credit", 0) or 0),
            )
            self.db.add(entry)
        self.db.commit()
        self.db.refresh(tx)
        return tx

    def list(self) -> List[Transaction]:
        return self.db.query(Transaction).order_by(Transaction.created_at.desc()).all()
