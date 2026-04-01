from fastapi import APIRouter
from pydantic import BaseModel
from src.calculators.premiums import PremiumCalculator

router = APIRouter()

class TermLifeRequest(BaseModel):
    age: int
    death_benefit: float
    interest_rate: float
    term_years: int

@router.post("/premium/term-life")
def calculate_premium(req: TermLifeRequest):
    premium = PremiumCalculator.calculate_term_life_premium(
        age=req.age, 
        death_benefit=req.death_benefit, 
        interest_rate=req.interest_rate, 
        term_years=req.term_years
    )
    return {"calculated_annual_premium": premium, "currency": "USD"}
