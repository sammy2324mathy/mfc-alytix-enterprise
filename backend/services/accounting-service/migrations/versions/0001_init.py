"""init accounting schema"""

from alembic import op
import sqlalchemy as sa

revision = "0001_init"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "accounts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False, unique=True),
        sa.Column("code", sa.String(length=50), nullable=False, unique=True),
        sa.Column("type", sa.String(length=50), nullable=False),
        sa.Column("opening_balance", sa.Numeric(18, 2), server_default="0"),
    )

    op.create_table(
        "transactions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("description", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("CURRENT_TIMESTAMP")),
    )

    op.create_table(
        "journal_entries",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("transaction_id", sa.Integer(), sa.ForeignKey("transactions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("account_id", sa.Integer(), sa.ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("debit", sa.Numeric(18, 2), server_default="0"),
        sa.Column("credit", sa.Numeric(18, 2), server_default="0"),
    )

    op.create_table(
        "ledger_entries",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("account_id", sa.Integer(), sa.ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("balance", sa.Numeric(18, 2), server_default="0"),
    )

    op.create_table(
        "invoices",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("number", sa.String(length=50), nullable=False, unique=True),
        sa.Column("amount", sa.Numeric(18, 2), nullable=False),
    )


def downgrade():
    op.drop_table("invoices")
    op.drop_table("ledger_entries")
    op.drop_table("journal_entries")
    op.drop_table("transactions")
    op.drop_table("accounts")
