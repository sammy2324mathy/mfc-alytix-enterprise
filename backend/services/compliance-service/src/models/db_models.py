from sqlalchemy import Column, String, Float, Text, Integer, Boolean, DateTime, JSON, func

from src.core.database import Base


class RegulationDB(Base):
    __tablename__ = "comp_regulations"

    regulation_id = Column(String(32), primary_key=True, index=True)
    name = Column(String(300), nullable=False)
    jurisdiction = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    effective_date = Column(String(20))
    description = Column(Text)
    compliance_status = Column(String(20), default="active")
    last_review = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class PolicyDB(Base):
    __tablename__ = "comp_policies"

    policy_id = Column(String(32), primary_key=True, index=True)
    name = Column(String(300), nullable=False)
    version = Column(String(20), default="1.0")
    owner = Column(String(200))
    department = Column(String(200))
    status = Column(String(20), default="active")
    last_updated = Column(String(20))
    review_cycle_months = Column(Integer, default=12)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class FilingDB(Base):
    __tablename__ = "comp_filings"

    filing_id = Column(String(32), primary_key=True, index=True)
    regulation_id = Column(String(32), nullable=False)
    regulation_name = Column(String(300))
    filing_type = Column(String(100))
    period = Column(String(50))
    deadline = Column(String(20))
    status = Column(String(20), default="draft")
    submitted_by = Column(String(200))
    submitted_at = Column(String(30))
    approved_by = Column(String(200))
    data = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class SignoffRecordDB(Base):
    __tablename__ = "comp_signoff_records"

    signoff_id = Column(String(32), primary_key=True, index=True)
    filing_id = Column(String(32), nullable=False, index=True)
    approved_by = Column(String(200), nullable=False)
    approved_at = Column(String(30))
    comments = Column(Text, default="")
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ComplianceRuleDB(Base):
    __tablename__ = "comp_rules"

    rule_id = Column(String(32), primary_key=True, index=True)
    name = Column(String(300), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    severity = Column(String(20), default="medium")
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class AuditLogDB(Base):
    __tablename__ = "comp_audit_log"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_type = Column(String(100), nullable=False)
    module = Column(String(100))
    user = Column(String(200))
    detail = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
