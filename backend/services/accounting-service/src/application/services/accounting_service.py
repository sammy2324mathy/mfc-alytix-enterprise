from typing import List
from fastapi import HTTPException, status # pyright: ignore[reportMissingImports]
from sqlalchemy.orm import Session # pyright: ignore[reportMissingImports]

from src.infrastructure.repositories.account_repository import AccountRepository
from src.infrastructure.repositories.transaction_repository import TransactionRepository


class AccountingService:
    def __init__(self, db: Session):
        self.accounts = AccountRepository(db)
        self.transactions = TransactionRepository(db)
        self.db = db

    def create_account(self, name: str, code: str, account_type: str, opening_balance: float = 0):
        return self.accounts.create(name=name, code=code, account_type=account_type, opening_balance=opening_balance)

    def list_accounts_with_balances(self) -> List[dict]:
        return self.accounts.list_with_balances()

    def post_transaction(self, description: str, lines: List[dict]):
        # Input sanitisation
        description = (description or "").strip()
        if not description or len(description) > 500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description is required and must be under 500 characters",
            )

        debit_total = sum(float(l.get("debit", 0)) for l in lines)
        credit_total = sum(float(l.get("credit", 0)) for l in lines)
        if round(debit_total, 2) != round(credit_total, 2):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Debits and credits must balance",
            )
        if debit_total == 0 and credit_total == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Transaction must have non-zero amounts",
            )

        # Verify all referenced accounts exist
        account_ids = {l["account_id"] for l in lines}
        existing = self.accounts.get_by_ids(list(account_ids))
        if len(existing) != len(account_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more account IDs do not exist",
            )

        return self.transactions.create(description=description, lines=lines)
