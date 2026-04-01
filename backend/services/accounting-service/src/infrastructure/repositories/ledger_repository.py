from collections import defaultdict
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import func

from src.infrastructure.models import JournalEntry, Account


class LedgerRepository:
    def __init__(self, db: Session):
        self.db = db

    def trial_balance(self):
        rows = (
            self.db.query(
                Account.code,
                Account._name,
                func.sum(JournalEntry.debit).label("debit"),
                func.sum(JournalEntry.credit).label("credit"),
            )
            .join(JournalEntry, JournalEntry.account_id == Account.id)
            .group_by(Account.code, Account._name)
            .all()
        )
        return [
            {
                "account_code": r.code,
                "account_name": Account(code=r.code, _name=r._name).name, # Using the property on a temporary instance for decryption
                "debit": float(r.debit or 0),
                "credit": float(r.credit or 0),
            }
            for r in rows
        ]

    def income_statement(self):
        rows = (
            self.db.query(
                Account.account_type,
                Account.code,
                Account._name,
                func.sum(JournalEntry.credit).label("credit"),
                func.sum(JournalEntry.debit).label("debit")
            )
            .join(JournalEntry, JournalEntry.account_id == Account.id)
            .filter(Account.account_type.in_(["revenue", "expense"]))
            .group_by(Account.account_type, Account.code, Account._name)
            .all()
        )
        
        revenue_list = []
        expense_list = []
        net_income = 0.0
        
        for r in rows:
            # Using property for decryption
            name = Account(code=r.code, _name=r._name).name
            if r.account_type == "revenue":
                net = float((r.credit or 0) - (r.debit or 0))
                revenue_list.append({
                    "code": r.code, "name": name, "amount": net
                })
                net_income += net
            else:
                net = float((r.debit or 0) - (r.credit or 0))
                expense_list.append({
                    "code": r.code, "name": name, "amount": net
                })
                net_income -= net
                
        return {
            "revenue": revenue_list,
            "expense": expense_list,
            "net_income": net_income
        }

    def balance_sheet(self):
        rows = (
            self.db.query(
                Account.account_type,
                Account.code,
                Account._name,
                func.sum(JournalEntry.debit).label("debit"),
                func.sum(JournalEntry.credit).label("credit")
            )
            .join(JournalEntry, JournalEntry.account_id == Account.id)
            .filter(Account.account_type.in_(["asset", "liability", "equity"]))
            .group_by(Account.account_type, Account.code, Account._name)
            .all()
        )
        
        assets_list = []
        liabilities_list = []
        equity_list = []
        total_assets = 0.0
        total_liabilities = 0.0
        total_equity = 0.0
        
        for r in rows:
            name = Account(code=r.code, _name=r._name).name
            if r.account_type == "asset":
                net = float((r.debit or 0) - (r.credit or 0))
                assets_list.append({"code": r.code, "name": name, "amount": net})
                total_assets += net
            elif r.account_type == "liability":
                net = float((r.credit or 0) - (r.debit or 0))
                liabilities_list.append({"code": r.code, "name": name, "amount": net})
                total_liabilities += net
            elif r.account_type == "equity":
                net = float((r.credit or 0) - (r.debit or 0))
                equity_list.append({"code": r.code, "name": name, "amount": net})
                total_equity += net
                
        return {
            "assets": assets_list,
            "liabilities": liabilities_list,
            "equity": equity_list,
            "total_assets": total_assets,
            "total_liabilities": total_liabilities,
            "total_equity": total_equity
        }
