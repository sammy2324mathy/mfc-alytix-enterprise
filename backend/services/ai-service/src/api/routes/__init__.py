from fastapi import APIRouter
from .chat import router as chat_router
from .knowledge import router as knowledge_router
from .config import router as config_router

router = APIRouter()
router.include_router(chat_router, prefix="/chat", tags=["chat"])
router.include_router(knowledge_router, prefix="/knowledge", tags=["knowledge"])
router.include_router(config_router, prefix="/config", tags=["config"])
