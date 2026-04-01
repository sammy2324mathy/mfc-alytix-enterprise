from pydantic import BaseModel, Field
from typing import List

class AssetReturns(BaseModel):
    symbol: str
    returns: List[float]
    weight: float

class PortfolioRiskRequest(BaseModel):
    assets: List[AssetReturns]
    confidence_level: float = Field(default=0.95, ge=0.5, le=0.999)
    time_horizon_days: int = Field(default=1, ge=1)
    portfolio_value: float = Field(default=100000.0, gt=0)
    
class MonteCarloRequest(PortfolioRiskRequest):
    num_simulations: int = Field(default=10000, ge=100, le=100000)
