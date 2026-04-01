import uuid
from datetime import datetime, timedelta
from typing import Any, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from src.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_token(
    subject: str,
    expires_minutes: int,
    token_type: str = "access",
    extra: Optional[dict[str, Any]] = None,
) -> str:
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    payload: dict[str, Any] = {
        "sub": subject,
        "exp": expire,
        "type": token_type,
        "jti": str(uuid.uuid4()),
        "iat": datetime.utcnow(),
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def decode_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except JWTError as exc:
        raise ValueError("Invalid token") from exc
