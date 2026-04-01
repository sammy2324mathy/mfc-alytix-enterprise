from pydantic import BaseModel, ConfigDict, Field, field_validator


class JournalLine(BaseModel):
    account_id: int
    debit: float = 0
    credit: float = 0

    @field_validator("debit", "credit")
    @classmethod
    def non_negative(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Amounts must be non-negative")
        return v


class TransactionCreate(BaseModel):
    description: str
    lines: list[JournalLine] = Field(..., min_length=2)


class TransactionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    description: str
