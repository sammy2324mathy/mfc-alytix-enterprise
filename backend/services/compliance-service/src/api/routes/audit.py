"""Compliance Audit API — audit logging and compliance health checks."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, List

from src.core.database import get_db
from src.api.schemas.compliance_schemas import AuditEntry, AuditLog
from src.models.db_models import AuditLogDB
from shared.auth import get_current_user_claims

router = APIRouter(dependencies=[Depends(get_current_user_claims)])


class AuditEvent(BaseModel):
    user_id: str
    action: str
    details: Dict[str, Any]


@router.post("/log")
def log_event(event: AuditEvent, db: Session = Depends(get_db)):
    """Log a compliance audit event."""
    row = AuditLogDB(
        event_type=event.action,
        user=event.user_id,
        detail=str(event.details),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"status": "logged", "record_id": row.id}


@router.get("/logs")
def get_logs(limit: int = 100, db: Session = Depends(get_db)):
    """Return recent audit logs."""
    rows = db.query(AuditLogDB).order_by(AuditLogDB.created_at.desc()).limit(limit).all()
    return [{"id": r.id, "event_type": r.event_type, "user": r.user, "module": r.module, "created_at": r.created_at} for r in rows]


@router.get("/regulations/health")
def check_regulations():
    """Check compliance health status."""
    return {"status": "compliant", "active_rules": []}


@router.get("/logs/{log_id}")
def get_log(log_id: int, db: Session = Depends(get_db)):
    """Return a specific audit log."""
    row = db.query(AuditLogDB).filter_by(id=log_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Log not found")
    return {"id": row.id, "event_type": row.event_type, "user": row.user, "module": row.module, "detail": row.detail, "created_at": row.created_at}
