import os
from typing import List, Dict
import httpx


class OpenAIClient:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1/chat/completions")
        self.model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")

    async def chat(self, messages: List[Dict[str, str]]) -> str:
        if not self.api_key:
            # Fallback stub
            return "LLM unavailable: set OPENAI_API_KEY."
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {"model": self.model, "messages": messages, "temperature": 0.2}
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(self.base_url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]
