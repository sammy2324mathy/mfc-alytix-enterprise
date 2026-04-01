from datetime import datetime
from typing import Dict

from domain.value_objects import DateRange
from infrastructure.repositories import (
    LedgerRepository,
    TransactionRepository,
)


class ClosePeriodUseCase:
    """
    Use Case: Close Accounting Period

    Responsibilities:
    - Validate no open/unposted transactions
    - Lock transactions within period
    - Generate closing summary
    """

    def __init__(
        self,
        ledger_repo: LedgerRepository,
        transaction_repo: TransactionRepository,
    ):
        self.ledger_repo = ledger_repo
        self.transaction_repo = transaction_repo

    # -------------------------------
    # Execute Use Case
    # -------------------------------
    def execute(self, start_date: datetime, end_date: datetime) -> Dict:
        period = DateRange(start_date, end_date)

        # 1. Validate transactions
        unposted = self.transaction_repo.get_unposted_transactions(period)

        if unposted:
            raise ValueError("Cannot close period: unposted transactions exist")

        # 2. Fetch transactions
        transactions = self.transaction_repo.get_by_date_range(period)

        # 3. Lock transactions
        for tx in transactions:
            tx.lock()

        self.transaction_repo.save_all(transactions)

        # 4. Generate trial balance snapshot
        trial_balance = self.ledger_repo.generate_trial_balance(period)

        # 5. Mark period as closed
        self.ledger_repo.mark_period_closed(period)

        return {
            "status": "closed",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "total_transactions": len(transactions),
            "trial_balance": trial_balance,
        }