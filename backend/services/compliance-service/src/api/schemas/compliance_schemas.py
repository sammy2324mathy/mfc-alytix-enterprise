"""Pydantic schemas for Compliance Service endpoints."""

from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from datetime import datetime


class ComplianceStatus(str, Enum):
    active = "active"
    under_review = "under_review"
    archived = "archived"


class FilingStatus(str, Enum):
    draft = "draft"
    submitted = "submitted"
    approved = "approved"
    rejected = "rejected"


class Regulation(BaseModel):
    regulation_id: str
    name: str
    jurisdiction: str
    category: str  # e.g. insurance, financial, data_protection
    effective_date: str
    description: str
    compliance_status: ComplianceStatus = ComplianceStatus.active
    last_review: str


class Policy(BaseModel):
    policy_id: str
    name: str
    version: str
    owner: str
    department: str
    status: ComplianceStatus
    last_updated: str
    review_cycle_months: int = 12
    description: str


class PolicyCreateRequest(BaseModel):
    name: str
    owner: str
    department: str
    description: str
    review_cycle_months: int = 12


class PolicyUpdate(BaseModel):
    name: Optional[str] = None
    owner: Optional[str] = None
    department: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ComplianceStatus] = None
    review_cycle_months: Optional[int] = None


class Filing(BaseModel):
    filing_id: str
    regulation_id: str
    regulation_name: str
    filing_type: str
    period: str
    deadline: str
    status: FilingStatus
    submitted_by: Optional[str] = None
    submitted_at: Optional[str] = None
    approved_by: Optional[str] = None


class FilingSubmitRequest(BaseModel):
    filing_id: str
    submitted_by: str
    data: dict = Field(default_factory=dict)


class SignoffRequest(BaseModel):
    filing_id: str
    approved_by: str
    comments: str = ""


class SignoffRecord(BaseModel):
    signoff_id: str
    filing_id: str
    approved_by: str
    approved_at: str
    comments: str
    status: str


class AuditEntry(BaseModel):
    event_type: str
    module: str
    detail: str
    user: str
    signature: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AuditLog(AuditEntry):
    audit_id: str


class RuleCreate(BaseModel):
    rule_id: str
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    severity: str = "medium"


class Rule(RuleCreate):
    enabled: bool = True
