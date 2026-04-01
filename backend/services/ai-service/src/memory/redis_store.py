import json
import logging
import os
from collections import defaultdict
from typing import List, Dict

logger = logging.getLogger("ai-service.memory")


class _InMemoryFallback:
    """Simple in-memory chat store used when Redis is unavailable."""

    def __init__(self):
        self._store: Dict[str, List[str]] = defaultdict(list)

    async def lrange(self, key: str, start: int, end: int):
        items = self._store.get(key, [])
        if end == -1:
            return items[start:]
        return items[start : end + 1]

    async def rpush(self, key: str, value: str):
        self._store[key].append(value)

    async def expire(self, key: str, ttl: int):
        pass  # no-op for in-memory


class RedisMemoryStore:
    def __init__(self):
        redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
        try:
            import redis.asyncio as aioredis
            self.client = aioredis.from_url(redis_url, decode_responses=True)
            logger.info("Redis memory store configured at %s", redis_url)
        except Exception as exc:
            logger.warning("Redis unavailable (%s), falling back to in-memory store", exc)
            self.client = _InMemoryFallback()
        self.ttl = 3600 * 24  # 24 hour retention

    async def get_chat_history(self, session_id: str) -> List[Dict[str, str]]:
        key = f"chat_history:{session_id}"
        try:
            messages_json = await self.client.lrange(key, 0, -1)
            return [json.loads(msg) for msg in messages_json]
        except Exception:
            return []

    async def append_message(self, session_id: str, role: str, content: str):
        key = f"chat_history:{session_id}"
        msg = json.dumps({"role": role, "content": content})
        try:
            await self.client.rpush(key, msg)
            await self.client.expire(key, self.ttl)
        except Exception:
            pass
