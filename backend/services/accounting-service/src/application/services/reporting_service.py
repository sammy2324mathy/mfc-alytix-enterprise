from sqlalchemy.orm import Session # pyright: ignore[reportMissingImports]
from sqlalchemy import func
from decimal import Decimal

from src.infrastructure.repositories.ledger_repository import LedgerRepository
from src.infrastructure.models import Account, JournalEntry, Transaction, Supplier, Customer


class ReportingService:
    def __init__(self, db: Session):
        self.ledger = LedgerRepository(db)
        self.db = db

    def trial_balance(self):
        return self.ledger.trial_balance()

    def income_statement(self):
        return self.ledger.income_statement()

    def balance_sheet(self):
        return self.ledger.balance_sheet()

    def cash_flow_statement(self):
        """Indirect-method cash flow statement derived from GL."""
        income = self.ledger.income_statement()
        net_income = income.get("net_income", 0.0)

        # Operating: net income + non-cash items (depreciation)
        depreciation = self._sum_by_name_pattern("Depreciation")
        working_capital_change = self._working_capital_changes()

        operating = net_income + depreciation + working_capital_change

        # Investing: fixed-asset purchases (debit on asset accounts with "Equipment"/"Property")
        investing = self._sum_by_type_and_pattern("asset", ["Equipment", "Property", "Vehicle", "Fixed"])

        # Financing: changes in equity & long-term liabilities
        financing = self._sum_by_type_and_pattern("equity", []) + self._sum_by_type_and_pattern("liability", ["Loan", "Bond", "Mortgage"])

        net_change = operating - abs(investing) + financing

        return {
            "operating_activities": {
                "net_income": round(net_income, 2),
                "depreciation": round(depreciation, 2),
                "working_capital_change": round(working_capital_change, 2),
                "total": round(operating, 2),
            },
            "investing_activities": {
                "capital_expenditure": round(investing, 2),
                "total": round(-abs(investing), 2),
            },
            "financing_activities": {
                "total": round(financing, 2),
            },
            "net_change_in_cash": round(net_change, 2),
        }

    def financial_ratios(self):
        """Key financial ratios computed from GL balances."""
        bs = self.ledger.balance_sheet()
        pnl = self.ledger.income_statement()

        total_assets = bs.get("total_assets", 0) or 1
        total_liabilities = bs.get("total_liabilities", 0)
        total_equity = bs.get("total_equity", 0) or 1
        net_income = pnl.get("net_income", 0)
        total_revenue = sum(r.get("amount", 0) for r in pnl.get("revenue", []))
        total_expenses = sum(r.get("amount", 0) for r in pnl.get("expense", []))

        # Current assets/liabilities (simplified: assets & liabilities excl fixed)
        current_assets = self._sum_current("asset")
        current_liabilities = self._sum_current("liability") or 1

        return {
            "liquidity": {
                "current_ratio": round(current_assets / current_liabilities, 4),
                "quick_ratio": round(current_assets / current_liabilities, 4),
            },
            "profitability": {
                "gross_margin_pct": round(
                    (total_revenue - total_expenses) / total_revenue * 100, 2
                ) if total_revenue else 0,
                "net_margin_pct": round(net_income / total_revenue * 100, 2) if total_revenue else 0,
                "return_on_assets_pct": round(net_income / total_assets * 100, 2),
                "return_on_equity_pct": round(net_income / total_equity * 100, 2),
            },
            "leverage": {
                "debt_to_equity": round(total_liabilities / total_equity, 4) if total_equity else 0,
                "debt_to_assets": round(total_liabilities / total_assets, 4),
            },
            "summary": {
                "total_assets": round(total_assets, 2),
                "total_liabilities": round(total_liabilities, 2),
                "total_equity": round(total_equity, 2),
                "net_income": round(net_income, 2),
                "total_revenue": round(total_revenue, 2),
            },
        }

    def ap_aging(self):
        """Creditors aging analysis."""
        return self._aging_analysis(Supplier)

    def ar_aging(self):
        """Debtors aging analysis."""
        return self._aging_analysis(Customer)

    # ─── helpers ───

    def _aging_analysis(self, entity_model):
        from datetime import datetime, timedelta
        now = datetime.utcnow()
        buckets = {
            "current": (0, 30),
            "31_60": (31, 60),
            "61_90": (61, 90),
            "over_90": (91, 9999),
        }
        entities = self.db.query(entity_model).filter(entity_model.status == "active").all()
        rows = []
        for e in entities:
            balance = float(e.balance or 0)
            if balance == 0:
                continue
            age_days = (now - (e.created_at or now)).days
            bucket = "current"
            for name, (lo, hi) in buckets.items():
                if lo <= age_days <= hi:
                    bucket = name
                    break
            rows.append({
                "id": e.id,
                "name": e.name,
                "code": e.code,
                "balance": balance,
                "age_days": age_days,
                "bucket": bucket,
            })
        summary = {b: sum(r["balance"] for r in rows if r["bucket"] == b) for b in buckets}
        return {"items": rows, "summary": summary, "total": sum(summary.values())}

    def _working_capital_changes(self) -> float:
        """Estimate working capital changes from current asset/liability movements."""
        current_assets = self._sum_current("asset")
        current_liabilities = self._sum_current("liability")
        return current_liabilities - current_assets

    def _sum_by_name_pattern(self, pattern: str) -> float:
        rows = (
            self.db.query(func.sum(JournalEntry.debit) - func.sum(JournalEntry.credit))
            .join(Account, Account.id == JournalEntry.account_id)
            .filter(Account._name.contains(pattern))
            .scalar()
        )
        return float(rows or 0)

    def _sum_by_type_and_pattern(self, acct_type: str, patterns: list) -> float:
        q = (
            self.db.query(func.sum(JournalEntry.debit) - func.sum(JournalEntry.credit))
            .join(Account, Account.id == JournalEntry.account_id)
            .filter(Account.account_type == acct_type)
        )
        if patterns:
            from sqlalchemy import or_
            q = q.filter(or_(*[Account._name.contains(p) for p in patterns]))
        return float(q.scalar() or 0)

    def _sum_current(self, acct_type: str) -> float:
        """Sum balances for 'current' accounts (exclude fixed/long-term keywords)."""
        from sqlalchemy import and_, not_
        exclude = ["Fixed", "Equipment", "Property", "Vehicle", "Loan", "Bond", "Mortgage"]
        q = (
            self.db.query(func.sum(JournalEntry.debit) - func.sum(JournalEntry.credit))
            .join(Account, Account.id == JournalEntry.account_id)
            .filter(Account.account_type == acct_type)
        )
        for kw in exclude:
            q = q.filter(not_(Account._name.contains(kw)))
        return abs(float(q.scalar() or 0))
