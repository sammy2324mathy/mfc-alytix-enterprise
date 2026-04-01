"""Regulatory Framework API — IFRS, SAM, FAIS, and other regulatory compliance tracking."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.api.schemas.compliance_schemas import Regulation
from src.core.database import get_db
from src.models.db_models import RegulationDB
from shared.auth import get_current_user_claims

router = APIRouter(dependencies=[Depends(get_current_user_claims)])


@router.post("/", response_model=Regulation, status_code=status.HTTP_201_CREATED)
def create_regulation(payload: Regulation, db: Session = Depends(get_db)):
    """Create a new regulatory framework entry."""
    existing = db.query(RegulationDB).filter_by(regulation_id=payload.regulation_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Regulation ID already exists")
    row = RegulationDB(
        regulation_id=payload.regulation_id,
        name=payload.name,
        jurisdiction=payload.jurisdiction,
        category=payload.category,
        effective_date=payload.effective_date,
        description=payload.description,
        compliance_status=payload.compliance_status,
        last_review=payload.last_review,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_schema(row)


@router.get("/", response_model=List[Regulation])
def list_regulations(db: Session = Depends(get_db)):
    """Return all tracked regulatory frameworks."""
    rows = db.query(RegulationDB).order_by(RegulationDB.regulation_id).all()
    return [_to_schema(r) for r in rows]


@router.get("/{regulation_id}", response_model=Regulation)
def get_regulation(regulation_id: str, db: Session = Depends(get_db)):
    """Return a specific regulation by ID."""
    row = db.query(RegulationDB).filter_by(regulation_id=regulation_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Regulation not found")
    return _to_schema(row)


@router.put("/{regulation_id}", response_model=Regulation)
def update_regulation(regulation_id: str, payload: Regulation, db: Session = Depends(get_db)):
    """Update a regulatory framework entry."""
    row = db.query(RegulationDB).filter_by(regulation_id=regulation_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Regulation not found")
    row.name = payload.name
    row.jurisdiction = payload.jurisdiction
    row.category = payload.category
    row.effective_date = payload.effective_date
    row.description = payload.description
    row.compliance_status = payload.compliance_status
    row.last_review = payload.last_review
    db.commit()
    db.refresh(row)
    return _to_schema(row)


def _to_schema(row: RegulationDB) -> Regulation:
    return Regulation(
        regulation_id=row.regulation_id,
        name=row.name,
        jurisdiction=row.jurisdiction,
        category=row.category,
        effective_date=row.effective_date,
        description=row.description,
        compliance_status=row.compliance_status,
        last_review=row.last_review,
    )
