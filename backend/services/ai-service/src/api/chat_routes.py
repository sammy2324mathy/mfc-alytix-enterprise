from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.agents.financial_agent import FinancialAgent

router = APIRouter()

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    session_id: str
    response: str
    
agent = FinancialAgent()

@router.post("/", response_model=ChatResponse)
async def chat_with_agent(req: ChatRequest):
    try:
        reply = await agent.process_query(session_id=req.session_id, query=req.message)
        return ChatResponse(session_id=req.session_id, response=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
