from typing import List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from src.infrastructure.models import Account, JournalEntry


class AccountRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, code: str, account_type: str, opening_balance: float = 0) -> Account:
        account = Account(
            name=name,
            code=str(code),
            account_type=account_type,
            opening_balance=opening_balance,
        )
        self.db.add(account)
        self.db.commit()
        self.db.refresh(account)
        return account

    def get(self, account_id: int) -> Optional[Account]:
        return self.db.query(Account).filter(Account.id == account_id).first()

    def get_by_ids(self, account_ids: List[int]) -> List[Account]:
        return self.db.query(Account).filter(Account.id.in_(account_ids)).all()

    def list(self) -> List[Account]:
        return self.db.query(Account).order_by(Account.code).all()

    def list_with_balances(self) -> List[dict]:
        """Opening balance plus net journal movement (debit − credit)."""
        accounts = self.list()
        out: List[dict] = []
        for acc in accounts:
            debit_sum = (
                self.db.query(func.coalesce(func.sum(JournalEntry.debit), 0))
                .filter(JournalEntry.account_id == acc.id)
                .scalar()
            )
            credit_sum = (
                self.db.query(func.coalesce(func.sum(JournalEntry.credit), 0))
                .filter(JournalEntry.account_id == acc.id)
                .scalar()
            )
            opening = float(acc.opening_balance or 0)
            net = float(debit_sum or 0) - float(credit_sum or 0)
            
            # Use instance property for decryption
            name = acc.name 
            
            out.append(
                {
                    "id": acc.id,
                    "name": name,
                    "code": acc.code,
                    "account_type": acc.account_type,
                    "opening_balance": opening,
                    "balance": round(opening + net, 2),
                }
            )
        return out
