"""Projects API — cross-module workspace projects."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any

from src.core.database import get_db
from src.models.db_models import ProjectDB

router = APIRouter()


class ProjectCreate(BaseModel):
    name: str
    description: str
    owner: str


class Project(BaseModel):
    project_id: str
    name: str
    description: str
    owner: str
    status: str


@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(req: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new project."""
    import uuid
    project_id = str(uuid.uuid4())
    row = ProjectDB(
        project_id=project_id,
        name=req.name,
        description=req.description,
        owner=req.owner,
        status="active",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_schema(row)


@router.get("/", response_model=List[Project])
def get_projects(db: Session = Depends(get_db)):
    """Return all projects."""
    rows = db.query(ProjectDB).order_by(ProjectDB.created_at.desc()).all()
    return [_to_schema(r) for r in rows]


@router.get("/{project_id}", response_model=Project)
def get_project(project_id: str, db: Session = Depends(get_db)):
    """Return a specific project."""
    row = db.query(ProjectDB).filter_by(project_id=project_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    return _to_schema(row)


@router.put("/{project_id}", response_model=Project)
def update_project(project_id: str, req: ProjectCreate, db: Session = Depends(get_db)):
    """Update a project."""
    row = db.query(ProjectDB).filter_by(project_id=project_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    row.name = req.name
    row.description = req.description
    row.owner = req.owner
    db.commit()
    db.refresh(row)
    return _to_schema(row)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: str, db: Session = Depends(get_db)):
    """Delete a project."""
    row = db.query(ProjectDB).filter_by(project_id=project_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(row)
    db.commit()


def _to_schema(row: ProjectDB) -> Project:
    return Project(
        project_id=row.project_id,
        name=row.name,
        description=row.description or "",
        owner=row.owner or "",
        status=row.status or "active",
    )
