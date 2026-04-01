"""Activity Feed API — cross-departmental audit trail."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from src.core.database import get_db
from src.models.db_models import ActivityDB

router = APIRouter()


class ActivityEntry(BaseModel):
    activity_id: str
    user: str
    role: str
    action: str
    module: str
    details: str
    timestamp: str


@router.post("/", response_model=ActivityEntry, status_code=status.HTTP_201_CREATED)
def create_activity(payload: ActivityEntry, db: Session = Depends(get_db)):
    """Create a new activity entry."""
    existing = db.query(ActivityDB).filter_by(activity_id=payload.activity_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Activity ID already exists")
    row = ActivityDB(
        activity_id=payload.activity_id,
        user=payload.user,
        role=payload.role,
        action=payload.action,
        module=payload.module,
        details=payload.details,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_schema(row)


@router.get("/", response_model=List[ActivityEntry])
def list_activity(module: str = None, limit: int = 20, db: Session = Depends(get_db)):
    """Return activity feed with optional module filter."""
    query = db.query(ActivityDB)
    if module:
        query = query.filter(ActivityDB.module.ilike(module))
    rows = query.order_by(ActivityDB.created_at.desc()).limit(limit).all()
    return [_to_schema(r) for r in rows]


@router.get("/{activity_id}", response_model=ActivityEntry)
def get_activity(activity_id: str, db: Session = Depends(get_db)):
    """Return a specific activity entry."""
    row = db.query(ActivityDB).filter_by(activity_id=activity_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Activity not found")
    return _to_schema(row)


@router.get("/by-user/{user}", response_model=List[ActivityEntry])
def activity_by_user(user: str, limit: int = 20, db: Session = Depends(get_db)):
    """Return activity for a specific user."""
    rows = db.query(ActivityDB).filter_by(user=user).order_by(ActivityDB.created_at.desc()).limit(limit).all()
    return [_to_schema(r) for r in rows]


def _to_schema(row: ActivityDB) -> ActivityEntry:
    return ActivityEntry(
        activity_id=row.activity_id,
        user=row.user,
        role=row.role or "",
        action=row.action or "",
        module=row.module or "",
        details=row.details or "",
        timestamp=row.created_at.isoformat() if row.created_at else "",
    )
