import logging
import uuid

from fastapi import APIRouter

from src.api.schemas.chat_schema import ChatRequest, ChatResponse
from src.agents.financial_agent import FinancialAgent

router = APIRouter()
agent = FinancialAgent()

FALLBACK_REPLY = (
    "The AI assistant could not reach the language model or supporting services (for example Redis). "
    "This is a degraded response so the UI still works: double-check OPENAI_API_KEY, Redis, and "
    "network settings, then retry."
)


@router.post("/", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    session_id = payload.session_id or str(uuid.uuid4())

    role_map = {
        "accountant": "You are a senior accounting AI. Provide answers focusing on ledgers and accounting principles.",
        "actuary": "You are a senior actuarial AI. Provide statistical and probabilistic analyses.",
        "risk": "You are a quantitative risk analyst AI focusing on portfolio variances and VaR metrics.",
    }
    system_prompt = role_map.get(payload.agent.lower(), "You are a helpful financial AI assistant.")

    try:
        reply = await agent.process_query(session_id=session_id, query=payload.message, system_prompt=system_prompt)
        return ChatResponse(agent=payload.agent, reply=reply, session_id=session_id)
    except Exception as exc:
        logging.exception("AI chat degraded: %s", exc)
        return ChatResponse(agent=payload.agent, reply=FALLBACK_REPLY, session_id=session_id)
