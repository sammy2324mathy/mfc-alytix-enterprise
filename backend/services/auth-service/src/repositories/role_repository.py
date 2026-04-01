from typing import Optional, List
from sqlalchemy.orm import Session

from src.models.role import Role


class RoleRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_ids(self, ids: List[int]) -> List[Role]:
        return self.db.query(Role).filter(Role.id.in_(ids)).all()

    def get_or_create(self, name: str) -> Role:
        role = self.db.query(Role).filter(Role.name == name).first()
        if role:
            return role
        role = Role(name=name)
        self.db.add(role)
        self.db.commit()
        self.db.refresh(role)
        return role
