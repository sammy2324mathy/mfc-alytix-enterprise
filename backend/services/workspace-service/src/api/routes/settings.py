"""User Settings API — per-user preferences and display configuration."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any

from src.core.database import get_db
from src.models.db_models import UserSettingsDB

router = APIRouter()


class UserSettings(BaseModel):
    user_id: str
    theme: str = "light"
    language: str = "en"
    timezone: str = "Africa/Johannesburg"
    notifications_enabled: bool = True
    dashboard_layout: str = "default"
    default_module: str = "dashboard"


@router.get("/{user_id}", response_model=UserSettings)
def get_settings(user_id: str, db: Session = Depends(get_db)):
    """Get user settings or return defaults."""
    row = db.query(UserSettingsDB).filter_by(user_id=user_id).first()
    if not row:
        return UserSettings(user_id=user_id)
    return _to_schema(row)


@router.put("/{user_id}")
def update_settings(user_id: str, settings: UserSettings, db: Session = Depends(get_db)):
    """Update user settings."""
    row = db.query(UserSettingsDB).filter_by(user_id=user_id).first()
    if not row:
        row = UserSettingsDB(user_id=user_id)
        db.add(row)
    row.theme = settings.theme
    row.language = settings.language
    row.timezone = settings.timezone
    row.notifications_enabled = settings.notifications_enabled
    row.dashboard_layout = settings.dashboard_layout
    row.default_module = settings.default_module
    db.commit()
    db.refresh(row)
    return {"status": "saved", "settings": _to_schema(row)}


@router.get("/{user_id}/preferences")
def get_preferences(user_id: str, db: Session = Depends(get_db)):
    """Get user preferences with available options."""
    row = db.query(UserSettingsDB).filter_by(user_id=user_id).first()
    s = _to_schema(row) if row else UserSettings(user_id=user_id)
    return {
        "user_id": s.user_id,
        "theme": s.theme,
        "language": s.language,
        "timezone": s.timezone,
        "notifications_enabled": s.notifications_enabled,
        "available_themes": ["light", "dark", "system"],
        "available_languages": ["en", "af", "zu"],
    }


def _to_schema(row: UserSettingsDB) -> UserSettings:
    return UserSettings(
        user_id=row.user_id,
        theme=row.theme or "light",
        language=row.language or "en",
        timezone=row.timezone or "Africa/Johannesburg",
        notifications_enabled=row.notifications_enabled if row.notifications_enabled is not None else True,
        dashboard_layout=row.dashboard_layout or "default",
        default_module=row.default_module or "dashboard",
    )
