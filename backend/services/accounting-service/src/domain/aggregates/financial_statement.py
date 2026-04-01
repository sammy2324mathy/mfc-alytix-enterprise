from typing import List, Dict
from collections import defaultdict


class FinancialStatement:
    """
    Aggregate that generates financial statements from ledger entries.
    Includes:
    - Income Statement
    - Balance Sheet
    - Cash Flow (basic)
    """

    def __init__(self, ledger_entries: List[Dict]):
        self.ledger_entries = ledger_entries

    # -------------------------------
    # Income Statement
    # -------------------------------
    def generate_income_statement(self) -> Dict:
        revenue = 0.0
        expenses = 0.0

        for entry in self.ledger_entries:
            account_type = entry.get("account_type")
            amount = float(entry["amount"])

            if account_type == "revenue":
                revenue += amount
            elif account_type == "expense":
                expenses += amount

        net_income = revenue - expenses

        return {
            "revenue": round(revenue, 2),
            "expenses": round(expenses, 2),
            "net_income": round(net_income, 2)
        }

    # -------------------------------
    # Balance Sheet
    # -------------------------------
    def generate_balance_sheet(self) -> Dict:
        assets = 0.0
        liabilities = 0.0
        equity = 0.0

        for entry in self.ledger_entries:
            account_type = entry.get("account_type")
            amount = float(entry["amount"])
            entry_type = entry.get("type")

            # Debit increases assets, credit decreases (simplified)
            if account_type == "asset":
                assets += amount if entry_type == "debit" else -amount

            elif account_type == "liability":
                liabilities += amount if entry_type == "credit" else -amount

            elif account_type == "equity":
                equity += amount if entry_type == "credit" else -amount

        return {
            "assets": round(assets, 2),
            "liabilities": round(liabilities, 2),
            "equity": round(equity, 2),
            "is_balanced": round(assets, 2) == round(liabilities + equity, 2)
        }

    # -------------------------------
    # Cash Flow Statement (basic)
    # -------------------------------
    def generate_cash_flow(self) -> Dict:
        operating = 0.0
        investing = 0.0
        financing = 0.0

        for entry in self.ledger_entries:
            category = entry.get("category", "operating")
            amount = float(entry["amount"])
            entry_type = entry.get("type")

            value = amount if entry_type == "debit" else -amount

            if category == "operating":
                operating += value
            elif category == "investing":
                investing += value
            elif category == "financing":
                financing += value

        net_cash_flow = operating + investing + financing

        return {
            "operating": round(operating, 2),
            "investing": round(investing, 2),
            "financing": round(financing, 2),
            "net_cash_flow": round(net_cash_flow, 2)
        }

    # -------------------------------
    # Full Financial Report
    # -------------------------------
    def generate_full_statement(self) -> Dict:
        income_statement = self.generate_income_statement()
        balance_sheet = self.generate_balance_sheet()
        cash_flow = self.generate_cash_flow()

        return {
            "income_statement": income_statement,
            "balance_sheet": balance_sheet,
            "cash_flow": cash_flow
        }