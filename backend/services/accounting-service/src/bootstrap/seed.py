"""Initialize standard chart of accounts and balanced entries for a new insurance organization."""

from sqlalchemy.orm import Session

from src.infrastructure.models import Account, JournalEntry, Transaction


def seed_if_empty(db: Session) -> None:
    # Production-ready seeding check
    import os
    if os.getenv("ENV_SEED_DATABASE") != "true":
        return

    if db.query(Account).count() > 0:
        return

    accounts_data = [
        ("Cash and Cash Equivalents", "1000", "asset", 0),
        ("Premiums Receivable", "1200", "asset", 0),
        ("Claims Payable", "2100", "liability", 0),
        ("IBNR Reserve", "2150", "liability", 0),
        ("Policyholder Equity", "3000", "equity", 0),
        ("Gross Written Premium", "4000", "revenue", 0),
        ("Claims Incurred", "5100", "expense", 0),
    ]
    for name, code, atype, opening in accounts_data:
        db.add(Account(name=name, code=code, account_type=atype, opening_balance=opening))
    db.flush()

    by_code = {a.code: a for a in db.query(Account).all()}

    tx = Transaction(description="Initial: premium receipt and revenue recognition")
    db.add(tx)
    db.flush()

    # Balanced entry 1: DR Cash, CR Revenue
    db.add(
        JournalEntry(
            transaction_id=tx.id,
            account_id=by_code["1000"].id,
            debit=125_000.00,
            credit=0,
        )
    )
    db.add(
        JournalEntry(
            transaction_id=tx.id,
            account_id=by_code["4000"].id,
            debit=0,
            credit=125_000.00,
        )
    )

    tx2 = Transaction(description="Initial: claims expense accrual and liability provisioning")
    db.add(tx2)
    db.flush()

    db.add(
        JournalEntry(
            transaction_id=tx2.id,
            account_id=by_code["5100"].id,
            debit=45_000.00,
            credit=0,
        )
    )
    db.add(
        JournalEntry(
            transaction_id=tx2.id,
            account_id=by_code["2100"].id,
            debit=0,
            credit=45_000.00,
        )
    )

    db.commit()
