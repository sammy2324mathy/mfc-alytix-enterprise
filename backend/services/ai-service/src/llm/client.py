import os
import httpx
from typing import List, Dict, Any

class LLMClient:
    def __init__(self):
        # Default to OpenAI standard endpoints but configurable
        self.api_key = os.getenv("LLM_API_KEY", "dummy_key")
        self.base_url = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
        self.model = os.getenv("LLM_MODEL", "gpt-4-turbo")

    async def chat_completion(self, messages: List[Dict[str, str]], tools: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Sends an asynchronous chat completion request to the LLM API.
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.0
        }
        if tools:
            payload["tools"] = tools
            payload["tool_choice"] = "auto"
            
        async with httpx.AsyncClient() as client:
            # Using try-except to mock response if not authenticated during local tests
            try:
                response = await client.post(f"{self.base_url}/chat/completions", json=payload, headers=headers, timeout=30.0)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError:
                # Return a safe fallback mock during CI/CD testing if API keys are missing
                if self.api_key == "dummy_key":
                    return {
                        "choices": [{
                            "message": {
                                "role": "assistant",
                                "content": "I am a financial AI agent. My connection securely operates via LLMClient, but my configured API key is currently a dummy key."
                            }
                        }]
                    }
                raise
