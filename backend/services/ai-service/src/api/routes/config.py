"""AI Model Configuration API — LLM settings, agent registry, and experiment tracking."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from src.core.database import get_db
from src.models.db_models import AgentConfigDB, ExperimentDB

router = APIRouter()


class AgentConfig(BaseModel):
    agent_id: str
    name: str
    description: str
    model: str
    temperature: float
    max_tokens: int
    status: str
    specialization: str


class Experiment(BaseModel):
    experiment_id: str
    name: str
    model_a: str
    model_b: str
    metric: str
    winner: Optional[str]
    status: str


@router.post("/agents", response_model=AgentConfig, status_code=status.HTTP_201_CREATED)
def create_agent(payload: AgentConfig, db: Session = Depends(get_db)):
    """Create a new agent configuration."""
    existing = db.query(AgentConfigDB).filter_by(agent_id=payload.agent_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Agent ID already exists")
    row = AgentConfigDB(
        agent_id=payload.agent_id,
        name=payload.name,
        description=payload.description,
        model=payload.model,
        temperature=payload.temperature,
        max_tokens=payload.max_tokens,
        status=payload.status,
        specialization=payload.specialization,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_agent_schema(row)


@router.get("/agents", response_model=List[AgentConfig])
def list_agents(db: Session = Depends(get_db)):
    """Return all agent configurations."""
    rows = db.query(AgentConfigDB).order_by(AgentConfigDB.created_at.desc()).all()
    return [_to_agent_schema(r) for r in rows]


@router.get("/agents/{agent_id}")
def get_agent(agent_id: str, db: Session = Depends(get_db)):
    """Return a specific agent configuration."""
    row = db.query(AgentConfigDB).filter_by(agent_id=agent_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Agent not found")
    return _to_agent_schema(row)


@router.put("/agents/{agent_id}/temperature")
def update_temperature(agent_id: str, temperature: float, db: Session = Depends(get_db)):
    """Update agent temperature setting."""
    row = db.query(AgentConfigDB).filter_by(agent_id=agent_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Agent not found")
    row.temperature = temperature
    db.commit()
    db.refresh(row)
    return {"status": "updated", "agent": _to_agent_schema(row)}


@router.delete("/agents/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_agent(agent_id: str, db: Session = Depends(get_db)):
    """Delete an agent configuration."""
    row = db.query(AgentConfigDB).filter_by(agent_id=agent_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(row)
    db.commit()


@router.post("/experiments", response_model=Experiment, status_code=status.HTTP_201_CREATED)
def create_experiment(payload: Experiment, db: Session = Depends(get_db)):
    """Create a new experiment."""
    existing = db.query(ExperimentDB).filter_by(experiment_id=payload.experiment_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Experiment ID already exists")
    row = ExperimentDB(
        experiment_id=payload.experiment_id,
        name=payload.name,
        model_a=payload.model_a,
        model_b=payload.model_b,
        metric=payload.metric,
        winner=payload.winner,
        status=payload.status,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_experiment_schema(row)


@router.get("/experiments", response_model=List[Experiment])
def list_experiments(db: Session = Depends(get_db)):
    """Return all experiments."""
    rows = db.query(ExperimentDB).order_by(ExperimentDB.created_at.desc()).all()
    return [_to_experiment_schema(r) for r in rows]


@router.get("/settings")
def global_settings():
    """Return global AI settings."""
    return {
        "default_model": "gpt-4o",
        "embedding_model": "text-embedding-3-small",
        "vector_store": "ChromaDB",
        "redis_url": "redis://localhost:6379",
        "max_context_window": 128000,
        "rate_limit_rpm": 60,
    }


def _to_agent_schema(row: AgentConfigDB) -> AgentConfig:
    return AgentConfig(
        agent_id=row.agent_id,
        name=row.name,
        description=row.description or "",
        model=row.model or "gpt-4o",
        temperature=row.temperature or 0.3,
        max_tokens=row.max_tokens or 2048,
        status=row.status or "active",
        specialization=row.specialization or "general",
    )


def _to_experiment_schema(row: ExperimentDB) -> Experiment:
    return Experiment(
        experiment_id=row.experiment_id,
        name=row.name,
        model_a=row.model_a or "",
        model_b=row.model_b or "",
        metric=row.metric or "",
        winner=row.winner,
        status=row.status or "running",
    )
