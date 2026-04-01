from pydantic import BaseModel, constr


class ChatRequest(BaseModel):
    message: constr(min_length=1)
    agent: str = "accountant"
    session_id: str | None = None


class ChatResponse(BaseModel):
    agent: str
    reply: str
    session_id: str
