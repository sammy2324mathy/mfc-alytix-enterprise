import time
from collections import defaultdict
from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException, Request, status

from src.api.deps import get_db, get_current_user
from src.schemas.auth_schema import LoginRequest, TokenResponse, RefreshRequest
from src.schemas.user_schema import UserCreate, UserRead
from src.services.auth_service import AuthService
from src.services.token_service import TokenService
from src.utils.validators import validate_password, validate_email

router = APIRouter()

# ── Brute-force protection ──
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_SECONDS = 300  # 5 minutes
_failed_attempts: Dict[str, List[float]] = defaultdict(list)


def _check_login_lockout(email: str) -> None:
    """Block login if too many recent failures for this email."""
    now = time.time()
    attempts = _failed_attempts[email]
    # Prune old entries
    _failed_attempts[email] = [t for t in attempts if now - t < LOCKOUT_SECONDS]
    if len(_failed_attempts[email]) >= MAX_FAILED_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Account temporarily locked. Try again in {LOCKOUT_SECONDS // 60} minutes.",
        )


def _record_failed_login(email: str) -> None:
    _failed_attempts[email].append(time.time())


def _clear_failed_login(email: str) -> None:
    _failed_attempts.pop(email, None)


@router.post("/register", response_model=UserRead, status_code=201)
def register(payload: UserCreate, db=Depends(get_db)):
    clean_email = validate_email(payload.email)
    validate_password(payload.password)
    user = AuthService(db).register(email=clean_email, password=payload.password, role_ids=payload.role_ids)
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db=Depends(get_db)):
    email = payload.email.lower().strip()
    _check_login_lockout(email)
    try:
        user = AuthService(db).authenticate(email=email, password=payload.password)
    except HTTPException:
        _record_failed_login(email)
        raise
    _clear_failed_login(email)
    role_names = [role.name for role in user.roles] if user.roles else []
    
    # If no roles established during dev, inject admin for structural testing
    if not role_names and email == "admin@mfc-alytix.com":
        role_names = ["admin"]
        
    access, refresh = TokenService().issue_tokens(user.id, roles=role_names)
    return TokenResponse(access_token=access, refresh_token=refresh)


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest):
    try:
        access, refresh_token = TokenService().rotate(payload.refresh_token)
        return TokenResponse(access_token=access, refresh_token=refresh_token)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token refresh failed"
        )


@router.get("/me", response_model=UserRead)
def me(current_user=Depends(get_current_user)):
    return current_user
