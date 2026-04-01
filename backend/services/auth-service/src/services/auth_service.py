from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.core.security import verify_password
from src.models.user import User
from src.repositories.user_repository import UserRepository
from src.repositories.role_repository import RoleRepository


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.users = UserRepository(db)
        self.roles = RoleRepository(db)

    def register(self, email: str, password: str, role_ids: Optional[list[int]] = None) -> User:
        if self.users.get_by_email(email):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        user = self.users.create(email=email, password=password)
        if role_ids:
            user.roles = self.roles.get_by_ids(role_ids)
            self.db.commit()
            self.db.refresh(user)
        return user

    def authenticate(self, email: str, password: str) -> User:
        user = self.users.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive account")
        return user
