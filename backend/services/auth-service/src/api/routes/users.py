from fastapi import APIRouter, Depends

from src.api.deps import get_db, get_current_user
from src.repositories.user_repository import UserRepository
from src.schemas.user_schema import UserRead


router = APIRouter()


@router.get("/", response_model=list[UserRead])
def list_users(db=Depends(get_db), current_user=Depends(get_current_user)):
    return UserRepository(db).list()

@router.get("/me", response_model=UserRead)
def get_me(current_user=Depends(get_current_user)):
    """Return the current authenticated user's profile."""
    return current_user
