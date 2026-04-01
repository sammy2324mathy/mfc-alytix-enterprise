"""Compliance Policies API — internal policy management and lifecycle."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.api.schemas.compliance_schemas import Policy, PolicyUpdate
from shared.auth import get_current_user_claims
from src.core.database import get_db
from src.models.db_models import PolicyDB

router = APIRouter(dependencies=[Depends(get_current_user_claims)])


@router.post("/", response_model=Policy, status_code=status.HTTP_201_CREATED)
def create_policy(payload: Policy, db: Session = Depends(get_db)):
    """Create a new compliance policy."""
    existing = db.query(PolicyDB).filter_by(policy_id=payload.policy_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Policy ID already exists")
    row = PolicyDB(
        policy_id=payload.policy_id,
        name=payload.name,
        version=payload.version,
        owner=payload.owner,
        department=payload.department,
        status=payload.status.value if hasattr(payload.status, "value") else str(payload.status),
        last_updated=payload.last_updated,
        review_cycle_months=payload.review_cycle_months,
        description=payload.description,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_schema(row)


@router.get("/", response_model=List[Policy])
def list_policies(db: Session = Depends(get_db)):
    """Return all compliance policies."""
    rows = db.query(PolicyDB).order_by(PolicyDB.policy_id).all()
    return [_to_schema(r) for r in rows]


@router.get("/{policy_id}", response_model=Policy)
def get_policy(policy_id: str, db: Session = Depends(get_db)):
    """Return a specific policy."""
    row = db.query(PolicyDB).filter_by(policy_id=policy_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Policy not found")
    return _to_schema(row)


@router.put("/{policy_id}", response_model=Policy)
def update_policy(policy_id: str, payload: Policy, db: Session = Depends(get_db)):
    """Update an existing policy."""
    row = db.query(PolicyDB).filter_by(policy_id=policy_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Policy not found")
    row.name = payload.name
    row.version = payload.version
    row.owner = payload.owner
    row.department = payload.department
    row.status = payload.status.value if hasattr(payload.status, "value") else str(payload.status)
    row.last_updated = payload.last_updated
    row.review_cycle_months = payload.review_cycle_months
    row.description = payload.description
    db.commit()
    db.refresh(row)
    return _to_schema(row)


@router.delete("/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_policy(policy_id: str, db: Session = Depends(get_db)):
    """Delete a compliance policy."""
    row = db.query(PolicyDB).filter_by(policy_id=policy_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Policy not found")
    db.delete(row)
    db.commit()


def _to_schema(row: PolicyDB) -> Policy:
    return Policy(
        policy_id=row.policy_id,
        name=row.name,
        version=row.version,
        owner=row.owner,
        department=row.department,
        status=row.status,
        last_updated=row.last_updated or "",
        review_cycle_months=row.review_cycle_months or 12,
        description=row.description or "",
    )
