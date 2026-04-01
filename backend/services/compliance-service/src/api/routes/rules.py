"""Compliance Rules API — rule definitions and configuration."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from src.api.schemas.compliance_schemas import Rule, RuleCreate
from shared.auth import get_current_user_claims

from src.core.database import get_db
from src.models.db_models import ComplianceRuleDB

router = APIRouter(dependencies=[Depends(get_current_user_claims)])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_rule(rule: RuleCreate, db: Session = Depends(get_db)):
    """Create a new compliance rule."""
    existing = db.query(ComplianceRuleDB).filter_by(rule_id=rule.rule_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Rule ID already exists")
    row = ComplianceRuleDB(
        rule_id=rule.rule_id,
        name=rule.name,
        description=rule.description,
        category=rule.category,
        severity=rule.severity,
        enabled=True,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"rule_id": row.rule_id, "name": row.name, "enabled": row.enabled}


@router.get("/")
def list_rules(db: Session = Depends(get_db)):
    """Return all compliance rules."""
    rows = db.query(ComplianceRuleDB).order_by(ComplianceRuleDB.rule_id).all()
    return [{"rule_id": r.rule_id, "name": r.name, "category": r.category, "severity": r.severity, "enabled": r.enabled} for r in rows]


@router.get("/{rule_id}")
def get_rule(rule_id: str, db: Session = Depends(get_db)):
    """Return a specific compliance rule."""
    row = db.query(ComplianceRuleDB).filter_by(rule_id=rule_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Rule not found")
    return {"rule_id": row.rule_id, "name": row.name, "description": row.description, "category": row.category, "severity": row.severity, "enabled": row.enabled}


@router.put("/{rule_id}")
def update_rule(rule_id: str, name: Optional[str] = None, description: Optional[str] = None, category: Optional[str] = None, severity: Optional[str] = None, enabled: Optional[bool] = None, db: Session = Depends(get_db)):
    """Update a compliance rule."""
    row = db.query(ComplianceRuleDB).filter_by(rule_id=rule_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Rule not found")
    if name is not None:
        row.name = name
    if description is not None:
        row.description = description
    if category is not None:
        row.category = category
    if severity is not None:
        row.severity = severity
    if enabled is not None:
        row.enabled = enabled
    db.commit()
    db.refresh(row)
    return {"rule_id": row.rule_id, "name": row.name, "enabled": row.enabled}


@router.delete("/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rule(rule_id: str, db: Session = Depends(get_db)):
    """Delete a compliance rule."""
    row = db.query(ComplianceRuleDB).filter_by(rule_id=rule_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Rule not found")
    db.delete(row)
    db.commit()
