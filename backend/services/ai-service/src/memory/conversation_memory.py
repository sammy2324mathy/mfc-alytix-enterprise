import uuid
from typing import List, Dict, DefaultDict
from collections import defaultdict


class InMemoryConversationStore:
    def __init__(self):
        self.store: DefaultDict[str, List[Dict[str, str]]] = defaultdict(list)

    def new_session(self) -> str:
        sid = str(uuid.uuid4())
        self.store[sid] = []
        return sid

    def get(self, session_id: str) -> List[Dict[str, str]]:
        return self.store.get(session_id, [])

    def append(self, session_id: str, role: str, content: str):
        self.store[session_id].append({"role": role, "content": content})
