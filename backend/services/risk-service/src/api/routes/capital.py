"""Capital Allocation API — economic capital by business unit and solvency metrics."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.api.schemas.risk_schemas import CapitalAllocation, SolvencyMetrics
from src.core.database import get_db
from src.models.db_models import CapitalAllocationDB
from shared.auth import get_current_user_claims

router = APIRouter(dependencies=[Depends(get_current_user_claims)])


@router.post("/allocation", response_model=CapitalAllocation, status_code=status.HTTP_201_CREATED)
def create_allocation(payload: CapitalAllocation, db: Session = Depends(get_db)):
    """Create a capital allocation entry for a business unit."""
    existing = db.query(CapitalAllocationDB).filter_by(business_unit=payload.business_unit).first()
    if existing:
        raise HTTPException(status_code=409, detail="Business unit already exists")
    row = CapitalAllocationDB(
        business_unit=payload.business_unit,
        required_capital=payload.required_capital,
        available_capital=payload.available_capital,
        utilization_pct=payload.utilization_pct,
        risk_category=payload.risk_category,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _row_to_schema(row)


@router.get("/allocation", response_model=List[CapitalAllocation])
def get_capital_allocation(db: Session = Depends(get_db)):
    """Return economic capital allocation by business unit."""
    rows = db.query(CapitalAllocationDB).order_by(CapitalAllocationDB.business_unit).all()
    return [_row_to_schema(r) for r in rows]


@router.put("/allocation/{business_unit}", response_model=CapitalAllocation)
def update_allocation(business_unit: str, payload: CapitalAllocation, db: Session = Depends(get_db)):
    """Update capital allocation for a business unit."""
    row = db.query(CapitalAllocationDB).filter_by(business_unit=business_unit).first()
    if not row:
        raise HTTPException(status_code=404, detail="Business unit not found")
    row.required_capital = payload.required_capital
    row.available_capital = payload.available_capital
    row.utilization_pct = payload.utilization_pct
    row.risk_category = payload.risk_category
    db.commit()
    db.refresh(row)
    return _row_to_schema(row)


@router.get("/solvency", response_model=SolvencyMetrics)
def get_solvency(db: Session = Depends(get_db)):
    """Return aggregate solvency metrics."""
    rows = db.query(CapitalAllocationDB).all()
    if not rows:
        return SolvencyMetrics(
            total_required=0, total_available=0,
            solvency_ratio=0, regulatory_minimum=100.0, surplus=0,
        )
    total_required = sum(r.required_capital for r in rows)
    total_available = sum(r.available_capital for r in rows)
    return SolvencyMetrics(
        total_required=total_required,
        total_available=total_available,
        solvency_ratio=round(total_available / total_required * 100, 1) if total_required else 0,
        regulatory_minimum=100.0,
        surplus=total_available - total_required,
    )


def _row_to_schema(row: CapitalAllocationDB) -> CapitalAllocation:
    return CapitalAllocation(
        business_unit=row.business_unit,
        required_capital=row.required_capital,
        available_capital=row.available_capital,
        utilization_pct=row.utilization_pct,
        risk_category=row.risk_category,
    )
