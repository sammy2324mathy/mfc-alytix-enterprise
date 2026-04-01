"""Risk Appetite Framework API — board-approved limits vs actuals."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.api.schemas.risk_schemas import RiskLimit, RiskLimitUpdate
from shared.auth import get_current_user_claims
from src.core.database import get_db
from src.models.db_models import RiskAppetiteLimitDB

router = APIRouter(dependencies=[Depends(get_current_user_claims)])


@router.post("/framework", response_model=RiskLimit, status_code=status.HTTP_201_CREATED)
def create_limit(payload: RiskLimit, db: Session = Depends(get_db)):
    """Create a new risk appetite limit."""
    existing = db.query(RiskAppetiteLimitDB).filter_by(limit_id=payload.limit_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Limit ID already exists")
    row = RiskAppetiteLimitDB(
        limit_id=payload.limit_id,
        category=payload.category,
        metric=payload.metric,
        board_limit=payload.board_limit,
        current_value=payload.current_value,
        utilization_pct=payload.utilization_pct,
        status=payload.status,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _row_to_schema(row)


@router.get("/framework", response_model=List[RiskLimit])
def get_risk_appetite(db: Session = Depends(get_db)):
    """Return the board-approved risk appetite framework with current utilization."""
    rows = db.query(RiskAppetiteLimitDB).order_by(RiskAppetiteLimitDB.limit_id).all()
    return [_row_to_schema(r) for r in rows]


@router.put("/limits")
def update_limit(req: RiskLimitUpdate, db: Session = Depends(get_db)):
    """Update a risk appetite limit (CRO/Board approval required)."""
    row = db.query(RiskAppetiteLimitDB).filter_by(limit_id=req.limit_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Limit not found")
    row.board_limit = req.new_board_limit
    if row.current_value and req.new_board_limit:
        row.utilization_pct = round(row.current_value / req.new_board_limit * 100, 1)
        row.status = "within" if row.utilization_pct < 85 else ("warning" if row.utilization_pct < 100 else "breach")
    db.commit()
    db.refresh(row)
    return {"status": "updated", "limit": _row_to_schema(row)}


def _row_to_schema(row: RiskAppetiteLimitDB) -> RiskLimit:
    return RiskLimit(
        limit_id=row.limit_id,
        category=row.category,
        metric=row.metric,
        board_limit=row.board_limit,
        current_value=row.current_value,
        utilization_pct=row.utilization_pct,
        status=row.status,
    )
