from typing import List, Optional

from pydantic import BaseModel, EmailStr


class RoleRead(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class UserRead(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    roles: List[RoleRead] = []

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role_ids: Optional[list[int]] = None
