from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship
from src.core.database import Base

# Import from shared
from security import EncryptionService

encryption = EncryptionService()

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), unique=True, nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    currency = Column(String(10), default="USD")
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    accounts = relationship("Account", back_populates="company")

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    _name = Column("name", String(255), unique=True, nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    account_type = Column("type", String(50), nullable=False)
    opening_balance = Column(Numeric(18, 2), nullable=False, default=0)
    status = Column(String(20), default="active") # active, closed, inactive

    company = relationship("Company", back_populates="accounts")

    @property
    def name(self):
        return encryption.decrypt(self._name)

    @name.setter
    def name(self, value):
        self._name = encryption.encrypt(value)


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    _name = Column("name", String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    _email = Column("email", String(255))
    _phone = Column("phone", String(50))
    _address = Column("address", String(500))
    payment_terms_days = Column(Integer, default=30)
    credit_limit = Column(Numeric(18, 2), default=0)
    balance = Column(Numeric(18, 2), default=0)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def name(self): return encryption.decrypt(self._name)
    @name.setter
    def name(self, value): self._name = encryption.encrypt(value)
    
    @property
    def email(self): return encryption.decrypt(self._email) if self._email else None
    @email.setter
    def email(self, value): self._email = encryption.encrypt(value) if value else None

    @property
    def address(self): return encryption.decrypt(self._address) if self._address else None
    @address.setter
    def address(self, value): self._address = encryption.encrypt(value) if value else None


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    _name = Column("name", String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    _email = Column("email", String(255))
    _phone = Column("phone", String(50))
    _address = Column("address", String(500))
    credit_limit = Column(Numeric(18, 2), default=10000)
    payment_terms_days = Column(Integer, default=30)
    balance = Column(Numeric(18, 2), default=0)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def name(self): return encryption.decrypt(self._name)
    @name.setter
    def name(self, value): self._name = encryption.encrypt(value)

    @property
    def email(self): return encryption.decrypt(self._email) if self._email else None
    @email.setter
    def email(self, value): self._email = encryption.encrypt(value) if value else None


class BankAccount(Base):
    __tablename__ = "bank_accounts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    _account_name = Column("account_name", String(255), nullable=False)
    _bank_name = Column("bank_name", String(255), nullable=False)
    _account_number = Column("account_number", String(255), nullable=False, unique=True)
    currency = Column(String(10), default="USD")
    _iban = Column("iban", String(255))
    _swift_bic = Column("swift_bic", String(255))
    balance = Column(Numeric(18, 2), default=0)
    gl_account_id = Column(Integer, ForeignKey("accounts.id"))
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def account_name(self): return encryption.decrypt(self._account_name)
    @account_name.setter
    def account_name(self, value): self._account_name = encryption.encrypt(value)

    @property
    def account_number(self): return encryption.decrypt(self._account_number)
    @account_number.setter
    def account_number(self, value): self._account_number = encryption.encrypt(value)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    _description = Column("description", String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    transaction_type = Column(String(50)) # invoice, payment, journal, etc.
    reference = Column(String(100)) # invoice number, check number, etc.

    @property
    def description(self):
        return encryption.decrypt(self._description)

    @description.setter
    def description(self, value):
        self._description = encryption.encrypt(value)

    entries = relationship("JournalEntry", back_populates="transaction", cascade="all, delete-orphan")


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_id = Column(Integer, ForeignKey("transactions.id", ondelete="CASCADE"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False)
    debit = Column(Numeric(18, 2), nullable=False, default=0)
    credit = Column(Numeric(18, 2), nullable=False, default=0)

    transaction = relationship("Transaction", back_populates="entries")
    account = relationship("Account")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    sku = Column(String(100), unique=True)
    category = Column(String(100))
    unit = Column(String(20), default="unit")
    current_cost = Column(Numeric(18, 4), default=0)
    sales_price = Column(Numeric(18, 4), default=0)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)


class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    location = Column(String(500))
    status = Column(String(20), default="active")


class StockLevel(Base):
    __tablename__ = "stock_levels"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    quantity = Column(Numeric(18, 4), default=0)
    
    product = relationship("Product")
    warehouse = relationship("Warehouse")


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    order_number = Column(String(50), unique=True, nullable=False)
    status = Column(String(20), default="DRAFT") # DRAFT, OPEN, RECEIVED, CLOSED
    total_amount = Column(Numeric(18, 2), default=0)
    expected_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("PurchaseOrderItem", back_populates="order", cascade="all, delete-orphan")


class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    purchase_order_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity_ordered = Column(Numeric(18, 4), nullable=False)
    quantity_received = Column(Numeric(18, 4), default=0)
    unit_price = Column(Numeric(18, 4), nullable=False)

    order = relationship("PurchaseOrder", back_populates="items")
    product = relationship("Product")


class StockTransaction(Base):
    __tablename__ = "stock_transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    transaction_type = Column(String(20)) # IN, OUT, TRANSFER, ADJUST
    quantity = Column(Numeric(18, 4), nullable=False)
    reference = Column(String(100)) # PO Number, GRN ID, etc.
    created_at = Column(DateTime, default=datetime.utcnow)


class BOM(Base):
    __tablename__ = "boms"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, unique=True)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product")
    items = relationship("BOMItem", back_populates="bom", cascade="all, delete-orphan")


class BOMItem(Base):
    __tablename__ = "bom_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bom_id = Column(Integer, ForeignKey("boms.id"), nullable=False)
    component_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Numeric(18, 4), nullable=False)

    bom = relationship("BOM", back_populates="items")
    component = relationship("Product")


class WorkOrder(Base):
    __tablename__ = "work_orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Numeric(18, 4), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    status = Column(String(20), default="PLANNED") # PLANNED, IN_PROGRESS, COMPLETED
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product")


class FixedAsset(Base):
    __tablename__ = "fixed_assets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    category = Column(String(50))
    purchase_date = Column(DateTime, nullable=False)
    purchase_price = Column(Numeric(18, 2), nullable=False)
    salvage_value = Column(Numeric(18, 2), default=0)
    useful_life_years = Column(Integer, nullable=False)
    depreciation_method = Column(String(50), default="Straight-Line") # Straight-Line, Declining-Balance
    current_book_value = Column(Numeric(18, 2))
    status = Column(String(20), default="ACTIVE") # ACTIVE, DISPOSED, REVALUED

    depreciation_entries = relationship("DepreciationEntry", back_populates="asset")


class DepreciationEntry(Base):
    __tablename__ = "depreciation_entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    asset_id = Column(Integer, ForeignKey("fixed_assets.id"), nullable=False)
    period_date = Column(DateTime, nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    book_value_after = Column(Numeric(18, 2), nullable=False)

    asset = relationship("FixedAsset", back_populates="depreciation_entries")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(String(20), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True)
    department = Column(String(50))
    job_title = Column(String(100))
    hire_date = Column(DateTime)
    base_salary = Column(Numeric(18, 2))
    bank_account_info = Column(String(255))
    status = Column(String(20), default="ACTIVE") # ACTIVE, INACTIVE, LEAVE

    payroll_entries = relationship("PayrollEntry", back_populates="employee")


class PayrollEntry(Base):
    __tablename__ = "payroll_entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    gross_pay = Column(Numeric(18, 2), nullable=False)
    tax_withheld = Column(Numeric(18, 2), default=0)
    net_pay = Column(Numeric(18, 2), nullable=False)
    status = Column(String(20), default="DRAFT") # DRAFT, APPROVED, PAID

    employee = relationship("Employee", back_populates="payroll_entries")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    client = Column(String(200))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    budget = Column(Numeric(18, 2))
    status = Column(String(20), default="ACTIVE") # ACTIVE, COMPLETED, ON_HOLD
    actual_cost = Column(Numeric(18, 2), default=0)

    costs = relationship("ProjectCost", back_populates="project")


class ProjectCost(Base):
    __tablename__ = "project_costs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    cost_type = Column(String(50)) # LABOR, MATERIAL, OVERHEAD
    entry_date = Column(DateTime, default=datetime.utcnow)
    description = Column(String(255))

    project = relationship("Project", back_populates="costs")


class TaxReturn(Base):
    __tablename__ = "tax_returns"

    id = Column(Integer, primary_key=True, autoincrement=True)
    return_id = Column(String(50), unique=True, nullable=False)
    tax_type = Column(String(50), nullable=False) # VAT, CIT, PAYE
    period = Column(String(50), nullable=False)
    due_date = Column(DateTime, nullable=False)
    tax_liability = Column(Numeric(18, 2), default=0)
    status = Column(String(20), default="DRAFT") # DRAFT, READY, FILED
    prepared_by = Column(String(100))
    filing_date = Column(DateTime)


class TaxConfig(Base):
    __tablename__ = "tax_configs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    tax_type = Column(String(50), nullable=False)
    rate = Column(Numeric(5, 4), nullable=False) # e.g. 0.20 for 20%
    jurisdiction = Column(String(50), default="FEDERAL")


# ─────────── Budgeting & Forecasting ───────────

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    fiscal_year = Column(Integer, nullable=False)
    status = Column(String(20), default="DRAFT")  # DRAFT, APPROVED, CLOSED
    total_amount = Column(Numeric(18, 2), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_by = Column(String(100))
    approved_at = Column(DateTime)

    lines = relationship("BudgetLine", back_populates="budget", cascade="all, delete-orphan")


class BudgetLine(Base):
    __tablename__ = "budget_lines"

    id = Column(Integer, primary_key=True, autoincrement=True)
    budget_id = Column(Integer, ForeignKey("budgets.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    period = Column(String(20), nullable=False)  # e.g. "2026-01", "2026-Q1"
    budgeted_amount = Column(Numeric(18, 2), nullable=False, default=0)
    actual_amount = Column(Numeric(18, 2), default=0)
    notes = Column(String(500))

    budget = relationship("Budget", back_populates="lines")
    account = relationship("Account")


class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    base_budget_id = Column(Integer, ForeignKey("budgets.id"))
    forecast_date = Column(DateTime, default=datetime.utcnow)
    period = Column(String(20), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    forecast_amount = Column(Numeric(18, 2), nullable=False)
    assumptions = Column(String(1000))

    account = relationship("Account")


# ─────────── Cost Accounting ───────────

class CostCenter(Base):
    __tablename__ = "cost_centers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(200), nullable=False)
    department = Column(String(100))
    manager = Column(String(100))
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    allocations = relationship("CostAllocation", back_populates="cost_center", cascade="all, delete-orphan")


class CostAllocation(Base):
    __tablename__ = "cost_allocations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cost_center_id = Column(Integer, ForeignKey("cost_centers.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    allocation_type = Column(String(50))  # DIRECT, OVERHEAD, SHARED
    period = Column(String(20), nullable=False)
    description = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)

    cost_center = relationship("CostCenter", back_populates="allocations")
    account = relationship("Account")


# ─────────── Period Closing ───────────

class PeriodClose(Base):
    __tablename__ = "period_closes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    period = Column(String(20), unique=True, nullable=False)  # e.g. "2026-01"
    close_type = Column(String(20), nullable=False)  # MONTH, QUARTER, YEAR
    status = Column(String(20), default="OPEN")  # OPEN, CLOSING, CLOSED
    closed_by = Column(String(100))
    closed_at = Column(DateTime)
    retained_earnings_entry_id = Column(Integer, ForeignKey("transactions.id"))
    created_at = Column(DateTime, default=datetime.utcnow)


# ─────────── Insurance & Assurance ───────────

class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"

    id = Column(Integer, primary_key=True, autoincrement=True)
    policy_number = Column(String(50), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    product_type = Column(String(50), nullable=False)  # LIFE, ENDOWMENT, WHOLE_LIFE, TERM, FUNERAL, GROUP_LIFE, ANNUITY, HEALTH, DISABILITY
    plan_name = Column(String(200), nullable=False)
    sum_assured = Column(Numeric(18, 2), nullable=False)
    annual_premium = Column(Numeric(18, 2), nullable=False)
    premium_frequency = Column(String(20), default="MONTHLY")  # MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL, SINGLE
    currency = Column(String(10), default="USD")
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime)  # null for whole-life
    maturity_date = Column(DateTime)
    term_years = Column(Integer)
    status = Column(String(30), default="PROPOSAL")  # PROPOSAL, UNDERWRITING, ACTIVE, PAID_UP, LAPSED, SURRENDERED, MATURED, CANCELLED, CLAIM_PENDING, CLAIM_SETTLED, REINSTATED
    lapse_date = Column(DateTime)
    grace_period_days = Column(Integer, default=30)
    waiting_period_days = Column(Integer, default=90)
    underwriting_status = Column(String(30), default="PENDING")  # PENDING, APPROVED, DECLINED, REFERRED
    underwriting_notes = Column(String(1000))
    agent_code = Column(String(50))
    branch_code = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("Customer")
    beneficiaries = relationship("Beneficiary", back_populates="policy", cascade="all, delete-orphan")
    premiums = relationship("PremiumSchedule", back_populates="policy", cascade="all, delete-orphan")
    claims = relationship("InsuranceClaim", back_populates="policy", cascade="all, delete-orphan")


class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    policy_id = Column(Integer, ForeignKey("insurance_policies.id"), nullable=False)
    _full_name = Column("full_name", String(255), nullable=False)
    relationship_type = Column(String(50), nullable=False)  # SPOUSE, CHILD, PARENT, SIBLING, OTHER
    _id_number = Column("id_number", String(255))
    _phone = Column("phone", String(255))
    allocation_percent = Column(Numeric(5, 2), nullable=False, default=100)
    is_primary = Column(String(5), default="yes")  # yes, no
    created_at = Column(DateTime, default=datetime.utcnow)

    policy = relationship("InsurancePolicy", back_populates="beneficiaries")

    @property
    def full_name(self): return encryption.decrypt(self._full_name)
    @full_name.setter
    def full_name(self, value): self._full_name = encryption.encrypt(value)

    @property
    def id_number(self): return encryption.decrypt(self._id_number) if self._id_number else None
    @id_number.setter
    def id_number(self, value): self._id_number = encryption.encrypt(value) if value else None

    @property
    def phone(self): return encryption.decrypt(self._phone) if self._phone else None
    @phone.setter
    def phone(self, value): self._phone = encryption.encrypt(value) if value else None


class PremiumSchedule(Base):
    __tablename__ = "premium_schedules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    policy_id = Column(Integer, ForeignKey("insurance_policies.id"), nullable=False)
    due_date = Column(DateTime, nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    status = Column(String(20), default="DUE")  # DUE, PAID, OVERDUE, WAIVED, GRACE
    paid_date = Column(DateTime)
    paid_amount = Column(Numeric(18, 2))
    payment_reference = Column(String(100))
    payment_method = Column(String(30))  # CARD, BANK_TRANSFER, CASH, DEBIT_ORDER, MOBILE
    created_at = Column(DateTime, default=datetime.utcnow)

    policy = relationship("InsurancePolicy", back_populates="premiums")


class InsuranceClaim(Base):
    __tablename__ = "insurance_claims"

    id = Column(Integer, primary_key=True, autoincrement=True)
    claim_number = Column(String(50), unique=True, nullable=False)
    policy_id = Column(Integer, ForeignKey("insurance_policies.id"), nullable=False)
    claim_type = Column(String(50), nullable=False)  # DEATH, MATURITY, DISABILITY, HOSPITAL, RETRENCHMENT, FUNERAL, CRITICAL_ILLNESS
    claim_date = Column(DateTime, nullable=False)
    reported_date = Column(DateTime, default=datetime.utcnow)
    amount_claimed = Column(Numeric(18, 2), nullable=False)
    amount_approved = Column(Numeric(18, 2))
    amount_paid = Column(Numeric(18, 2))
    status = Column(String(30), default="SUBMITTED")  # SUBMITTED, UNDER_REVIEW, APPROVED, DECLINED, PAID, CONTESTED
    assessor_notes = Column(String(2000))
    decline_reason = Column(String(500))
    settlement_date = Column(DateTime)
    documents_received = Column(String(5), default="no")  # yes, no
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    policy = relationship("InsurancePolicy", back_populates="claims")


# ─────────── Audit Trail ───────────

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    entity_type = Column(String(50), nullable=False)  # Account, Transaction, etc.
    entity_id = Column(Integer, nullable=False)
    action = Column(String(20), nullable=False)  # CREATE, UPDATE, DELETE
    field_name = Column(String(100))
    old_value = Column(String(1000))
    new_value = Column(String(1000))
    performed_by = Column(String(100))
    performed_at = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(45))
