from datetime import datetime, timedelta
from typing import Dict

import redis
from fastapi import HTTPException, status

from src.core.config import settings
from src.core.security import create_token, decode_token


class InMemoryStore:
    def __init__(self):
        self.store: Dict[str, tuple[int, datetime]] = {}

    def setex(self, key: str, seconds: int, value: int):
        self.store[key] = (value, datetime.utcnow() + timedelta(seconds=seconds))

    def get(self, key: str):
        val = self.store.get(key)
        if not val:
            return None
        value, expires = val
        if datetime.utcnow() > expires:
            self.store.pop(key, None)
            return None
        return value

    def delete(self, key: str):
        self.store.pop(key, None)


class TokenService:
    def __init__(self) -> None:
        try:
            self.client = redis.from_url(settings.redis_url, decode_responses=True)
            # Test connection once
            self.client.ping()
        except Exception:
            self.client = InMemoryStore()

    def issue_tokens(self, user_id: int, roles: list[str] = None):
        roles = roles or []
        access_token = create_token(
            subject=str(user_id),
            expires_minutes=settings.jwt_expires_minutes,
            token_type="access",
            extra={"roles": roles}
        )
        refresh_token = create_token(
            subject=str(user_id),
            expires_minutes=settings.jwt_refresh_expires_minutes,
            token_type="refresh",
            extra={"roles": roles}
        )
        self.client.setex(f"refresh:{refresh_token}", settings.jwt_refresh_expires_minutes * 60, user_id)
        return access_token, refresh_token

    def rotate(self, refresh_token: str):
        if not refresh_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token provided")
            
        stored = self.client.get(f"refresh:{refresh_token}")
        if not stored:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")
            
        try:
            payload = decode_token(refresh_token)
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed refresh token")
            
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
            
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
            
        roles = payload.get("roles", [])
        self.client.delete(f"refresh:{refresh_token}")
        return self.issue_tokens(int(user_id), roles=roles)
