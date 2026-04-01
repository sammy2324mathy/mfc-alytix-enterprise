from collections import defaultdict
from typing import List, Dict


class TrialBalance:
    """
    Aggregate that calculates a trial balance from ledger entries.
    Ensures total debits == total credits.
    """

    def __init__(self, ledger_entries: List[Dict]):
        """
        ledger_entries format:
        [
            {
                "account_id": int,
                "account_name": str,
                "type": "debit" | "credit",
                "amount": float
            }
        ]
        """
        self.ledger_entries = ledger_entries

    def generate(self) -> Dict:
        account_balances = defaultdict(lambda: {"debit": 0.0, "credit": 0.0})

        # Aggregate entries
        for entry in self.ledger_entries:
            account_id = entry["account_id"]
            account_name = entry.get("account_name", f"Account {account_id}")
            entry_type = entry["type"]
            amount = float(entry["amount"])

            if account_id not in account_balances:
                account_balances[account_id]["name"] = account_name

            account_balances[account_id][entry_type] += amount

        # Build report
        report = []
        total_debit = 0.0
        total_credit = 0.0

        for account_id, data in account_balances.items():
            debit = round(data["debit"], 2)
            credit = round(data["credit"], 2)

            total_debit += debit
            total_credit += credit

            report.append({
                "account_id": account_id,
                "account_name": data.get("name"),
                "debit": debit,
                "credit": credit
            })

        # Validate balance
        is_balanced = round(total_debit, 2) == round(total_credit, 2)

        return {
            "accounts": report,
            "total_debit": round(total_debit, 2),
            "total_credit": round(total_credit, 2),
            "is_balanced": is_balanced
        }

    def validate(self) -> bool:
        """
        Ensures accounting equation holds.
        """
        result = self.generate()
        return result["is_balanced"]