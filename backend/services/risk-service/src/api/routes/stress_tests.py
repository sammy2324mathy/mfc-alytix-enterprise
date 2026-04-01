"""Stress Testing API — scenario-based and reverse stress testing endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.api.schemas.risk_schemas import (
    StressScenario,
    StressTestRequest,
    StressTestResult,
)
from shared.auth import get_current_user_claims
from src.core.database import get_db
from src.models.db_models import StressScenarioDB

router = APIRouter(dependencies=[Depends(get_current_user_claims)])


@router.post("/scenarios", response_model=StressScenario, status_code=status.HTTP_201_CREATED)
def create_scenario(payload: StressScenario, db: Session = Depends(get_db)):
    """Create a new stress test scenario."""
    existing = db.query(StressScenarioDB).filter_by(scenario_id=payload.scenario_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Scenario ID already exists")
    row = StressScenarioDB(
        scenario_id=payload.scenario_id,
        name=payload.name,
        description=payload.description,
        category=payload.category,
        severity=payload.severity.value if hasattr(payload.severity, "value") else payload.severity,
        probability=payload.probability,
        impact_pct=payload.impact_pct,
        parameters=payload.parameters,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _row_to_schema(row)


@router.get("/scenarios", response_model=List[StressScenario])
def list_scenarios(db: Session = Depends(get_db)):
    """Return all available stress test scenarios."""
    rows = db.query(StressScenarioDB).order_by(StressScenarioDB.scenario_id).all()
    return [_row_to_schema(r) for r in rows]


@router.get("/scenarios/{scenario_id}", response_model=StressScenario)
def get_scenario(scenario_id: str, db: Session = Depends(get_db)):
    """Return a single scenario by ID."""
    row = db.query(StressScenarioDB).filter_by(scenario_id=scenario_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return _row_to_schema(row)


@router.delete("/scenarios/{scenario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scenario(scenario_id: str, db: Session = Depends(get_db)):
    """Delete a stress test scenario."""
    row = db.query(StressScenarioDB).filter_by(scenario_id=scenario_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Scenario not found")
    db.delete(row)
    db.commit()


@router.post("/run", response_model=List[StressTestResult])
def run_stress_test(req: StressTestRequest, db: Session = Depends(get_db)):
    """Execute stress tests against the portfolio."""
    query = db.query(StressScenarioDB)
    if req.scenarios:
        query = query.filter(StressScenarioDB.scenario_id.in_(req.scenarios))
    selected = query.all()

    results: List[StressTestResult] = []
    for s in selected:
        loss = req.portfolio_value * (s.impact_pct / 100.0)
        post_value = req.portfolio_value - loss
        breaches = s.impact_pct > 10.0
        results.append(StressTestResult(
            scenario_id=s.scenario_id,
            scenario_name=s.name,
            pre_stress_value=req.portfolio_value,
            post_stress_value=round(post_value, 2),
            loss=round(loss, 2),
            loss_pct=round(s.impact_pct, 2),
            breaches_limit=breaches,
        ))
    return results


def _row_to_schema(row: StressScenarioDB) -> StressScenario:
    return StressScenario(
        scenario_id=row.scenario_id,
        name=row.name,
        description=row.description,
        category=row.category,
        severity=row.severity,
        probability=row.probability,
        impact_pct=row.impact_pct,
        parameters=row.parameters or {},
    )
