from datetime import datetime


class PostTransactionUseCase:
    def __init__(self, account_repo, transaction_repo, ledger_repo):
        self.account_repo = account_repo
        self.transaction_repo = transaction_repo
        self.ledger_repo = ledger_repo

    def execute(self, debit_account_id: int, credit_account_id: int, amount: float):
        if amount <= 0:
            raise ValueError("Amount must be greater than zero")

        # Fetch accounts
        debit_account = self.account_repo.get_by_id(debit_account_id)
        credit_account = self.account_repo.get_by_id(credit_account_id)

        if not debit_account or not credit_account:
            raise ValueError("Invalid account IDs")

        # Create transaction
        transaction = {
            "amount": amount,
            "timestamp": datetime.utcnow()
        }

        transaction_id = self.transaction_repo.create(transaction)

        # Ledger entries (double entry)
        self.ledger_repo.create_entry({
            "transaction_id": transaction_id,
            "account_id": debit_account_id,
            "type": "debit",
            "amount": amount
        })

        self.ledger_repo.create_entry({
            "transaction_id": transaction_id,
            "account_id": credit_account_id,
            "type": "credit",
            "amount": amount
        })

        return {
            "status": "success",
            "transaction_id": transaction_id,
            "message": "Transaction posted successfully"
        }