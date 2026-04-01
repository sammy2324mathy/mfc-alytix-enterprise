"""Notifications API — cross-module notification center."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from src.core.database import get_db
from src.models.db_models import NotificationDB

router = APIRouter()


class Notification(BaseModel):
    notification_id: str
    type: str
    title: str
    message: str
    module: str
    created_at: str
    read: bool = False
    action_url: Optional[str] = None


@router.post("/", response_model=Notification, status_code=status.HTTP_201_CREATED)
def create_notification(payload: Notification, db: Session = Depends(get_db)):
    """Create a new notification."""
    existing = db.query(NotificationDB).filter_by(notification_id=payload.notification_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Notification ID already exists")
    row = NotificationDB(
        notification_id=payload.notification_id,
        type=payload.type,
        title=payload.title,
        message=payload.message,
        module=payload.module,
        read=payload.read,
        action_url=payload.action_url,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_schema(row)


@router.get("/", response_model=List[Notification])
def list_notifications(unread_only: bool = False, db: Session = Depends(get_db)):
    """Return all notifications."""
    query = db.query(NotificationDB)
    if unread_only:
        query = query.filter_by(read=False)
    rows = query.order_by(NotificationDB.created_at.desc()).all()
    return [_to_schema(r) for r in rows]


@router.get("/{notification_id}", response_model=Notification)
def get_notification(notification_id: str, db: Session = Depends(get_db)):
    """Return a specific notification."""
    row = db.query(NotificationDB).filter_by(notification_id=notification_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Notification not found")
    return _to_schema(row)


@router.put("/{notification_id}/read")
def mark_read(notification_id: str, db: Session = Depends(get_db)):
    """Mark a notification as read."""
    row = db.query(NotificationDB).filter_by(notification_id=notification_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Notification not found")
    row.read = True
    db.commit()
    return {"status": "marked_read"}


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(notification_id: str, db: Session = Depends(get_db)):
    """Delete a notification."""
    row = db.query(NotificationDB).filter_by(notification_id=notification_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(row)
    db.commit()


@router.get("/count/unread")
def unread_count(db: Session = Depends(get_db)):
    """Return count of unread notifications."""
    count = db.query(NotificationDB).filter_by(read=False).count()
    return {"unread": count}


def _to_schema(row: NotificationDB) -> Notification:
    return Notification(
        notification_id=row.notification_id,
        type=row.type,
        title=row.title,
        message=row.message or "",
        module=row.module or "",
        created_at=row.created_at.isoformat() if row.created_at else "",
        read=row.read,
        action_url=row.action_url,
    )
