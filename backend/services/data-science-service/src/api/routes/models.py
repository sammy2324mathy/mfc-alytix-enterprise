from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, List

from src.core.database import get_db
from src.models.db_models import ModelRegistryDB

router = APIRouter()


class ModelRegistration(BaseModel):
    model_name: str
    version: str
    metadata: Dict[str, Any]


@router.post("/register")
def register_model(req: ModelRegistration, db: Session = Depends(get_db)):
    import uuid
    model_id = str(uuid.uuid4())[:8]
    row = ModelRegistryDB(
        model_id=model_id,
        model_name=req.model_name,
        version=req.version,
        metadata_json=req.metadata,
        status="registered",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"message": "Model registered successfully", "model_id": model_id}


@router.get("/")
def list_models(db: Session = Depends(get_db)):
    rows = db.query(ModelRegistryDB).order_by(ModelRegistryDB.created_at.desc()).all()
    return [
        {
            "model_id": r.model_id,
            "model_name": r.model_name,
            "version": r.version,
            "metadata": r.metadata_json,
            "status": r.status,
            "created_at": r.created_at,
        }
        for r in rows
    ]


@router.get("/{model_id}")
def get_model(model_id: str, db: Session = Depends(get_db)):
    row = db.query(ModelRegistryDB).filter_by(model_id=model_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Model not found")
    return {
        "model_id": row.model_id,
        "model_name": row.model_name,
        "version": row.version,
        "metadata": row.metadata_json,
        "status": row.status,
        "created_at": row.created_at,
    }


@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_model(model_id: str, db: Session = Depends(get_db)):
    row = db.query(ModelRegistryDB).filter_by(model_id=model_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Model not found")
    db.delete(row)
    db.commit()
