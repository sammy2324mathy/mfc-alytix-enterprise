from sqlalchemy import Column, String, Float, Text, JSON, Integer, DateTime, func

from src.core.database import Base


class StressScenarioDB(Base):
    __tablename__ = "risk_stress_scenarios"

    scenario_id = Column(String(32), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    category = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)
    probability = Column(Float)
    impact_pct = Column(Float)
    parameters = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CapitalAllocationDB(Base):
    __tablename__ = "risk_capital_allocations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    business_unit = Column(String(200), unique=True, nullable=False)
    required_capital = Column(Float, nullable=False)
    available_capital = Column(Float, nullable=False)
    utilization_pct = Column(Float)
    risk_category = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class RiskAppetiteLimitDB(Base):
    __tablename__ = "risk_appetite_limits"

    limit_id = Column(String(32), primary_key=True, index=True)
    category = Column(String(100), nullable=False)
    metric = Column(String(200), nullable=False)
    board_limit = Column(Float, nullable=False)
    current_value = Column(Float)
    utilization_pct = Column(Float)
    status = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
