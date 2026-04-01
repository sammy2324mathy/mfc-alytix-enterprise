"""Compliance Sign-off API — CCO/board approval registry."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from src.api.schemas.compliance_schemas import SignoffRequest, SignoffRecord
from shared.auth import get_current_user_claims
from src.core.database import get_db
from src.models.db_models import SignoffRecordDB

router = APIRouter(dependencies=[Depends(get_current_user_claims)])


@router.post("/", response_model=SignoffRecord, status_code=status.HTTP_201_CREATED)
def submit_signoff(req: SignoffRequest, db: Session = Depends(get_db)):
    """Record a CCO sign-off on a filing."""
    signoff_id = f"SO-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    row = SignoffRecordDB(
        signoff_id=signoff_id,
        filing_id=req.filing_id,
        approved_by=req.approved_by,
        approved_at=datetime.utcnow().isoformat(),
        comments=req.comments,
        status="approved",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_schema(row)


@router.get("/history", response_model=List[SignoffRecord])
def signoff_history(db: Session = Depends(get_db)):
    """Return all historical sign-off records."""
    rows = db.query(SignoffRecordDB).order_by(SignoffRecordDB.created_at.desc()).all()
    return [_to_schema(r) for r in rows]


@router.get("/{signoff_id}", response_model=SignoffRecord)
def get_signoff(signoff_id: str, db: Session = Depends(get_db)):
    """Return a specific sign-off record."""
    row = db.query(SignoffRecordDB).filter_by(signoff_id=signoff_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Sign-off record not found")
    return _to_schema(row)


@router.get("/pending/count")
def pending_signoffs(db: Session = Depends(get_db)):
    """Return count of filings awaiting sign-off."""
    # In production, this would query filings with submitted status but no sign-off
    count = db.query(SignoffRecordDB).filter_by(status="pending").count()
    return {"pending": count}


def _to_schema(row: SignoffRecordDB) -> SignoffRecord:
    return SignoffRecord(
        signoff_id=row.signoff_id,
        filing_id=row.filing_id,
        approved_by=row.approved_by,
        approved_at=row.approved_at or "",
        comments=row.comments or "",
        status=row.status,
    )
