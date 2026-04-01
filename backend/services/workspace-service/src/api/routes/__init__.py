from fastapi import APIRouter
from .projects import router as projects_router
from .notifications import router as notifications_router
from .activity import router as activity_router
from .settings import router as settings_router

router = APIRouter()
router.include_router(projects_router, prefix="/projects", tags=["projects"])
router.include_router(notifications_router, prefix="/notifications", tags=["notifications"])
router.include_router(activity_router, prefix="/activity", tags=["activity"])
router.include_router(settings_router, prefix="/settings", tags=["settings"])
