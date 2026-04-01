from pydantic import BaseModel, Field

class MakehamGompertzRequest(BaseModel):
    alpha: float = Field(0.0001, ge=0, le=1, description="Makeham term factor (accidental death risk)")
    beta: float = Field(0.00005, ge=0, le=1, description="Gompertz parameter beta (exponential base risk)")
    c: float = Field(1.10, gt=0, le=2.0, description="Gompertz parameter c (rate of aging)")
    max_age: int = Field(120, ge=1, le=150, description="Maximum age to project mortality rate up to")

class MortalityResponse(BaseModel):
    age: int
    qx: float

class MakehamGompertzResponse(BaseModel):
    curve: list[MortalityResponse]
