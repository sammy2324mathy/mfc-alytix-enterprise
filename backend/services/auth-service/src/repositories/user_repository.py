from typing import Optional, List
from sqlalchemy.orm import Session

from src.models.user import User
from src.core.security import hash_password


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def list(self) -> List[User]:
        return self.db.query(User).all()

    def create(self, email: str, password: str) -> User:
        user = User(email=email, hashed_password=hash_password(password))
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
