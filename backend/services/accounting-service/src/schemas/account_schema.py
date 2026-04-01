from pydantic import BaseModel, ConfigDict, Field


class AccountCreate(BaseModel):
    name: str
    code: str = Field(..., min_length=1)
    account_type: str
    opening_balance: float = 0


class AccountRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    code: str
    account_type: str
    opening_balance: float
    balance: float = 0.0
