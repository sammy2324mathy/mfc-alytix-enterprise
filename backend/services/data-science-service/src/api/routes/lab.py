from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
import random
import time
from pydantic import BaseModel

router = APIRouter()

class CodeExecutionRequest(BaseModel):
    code: str
    environment: str = "pytorch-2.1"

class TrainingStep(BaseModel):
    epoch: int
    loss: float
    val_loss: float
    accuracy: float

class TrainingResponse(BaseModel):
    job_id: str
    status: str
    metrics: List[TrainingStep]
    logs: List[str]

@router.post("/execute", response_model=TrainingResponse)
def execute_lab_code(req: CodeExecutionRequest):
    """
    Simulate the execution of ML code in the lab.
    Returns realistic training telemetry.
    """
    job_id = f"JOB-{random.randint(1000, 9999)}"
    
    # Generate realistic training data
    metrics = []
    base_loss = 2.0
    base_acc = 0.5
    
    for i in range(1, 21):
        loss = (base_loss / (i**0.5)) + random.uniform(-0.05, 0.05)
        val_loss = loss * 1.1 + random.uniform(0, 0.1)
        acc = min(0.99, base_acc + (0.45 * (1 - 1/i)) + random.uniform(-0.01, 0.01))
        
        metrics.append(TrainingStep(
            epoch=i,
            loss=round(loss, 4),
            val_loss=round(val_loss, 4),
            accuracy=round(acc, 4)
        ))

    logs = [
        f"[SYSTEM] Job {job_id} initialized on GPU-A100-PROD-01",
        "[CUDA] Memory allocated: 4.2GB / 40GB",
        "[ENV] PyTorch runtime version 2.1.0+cu121",
        "[IO] Loading dataset CLAIMS_MASTER_ENVELOPE...",
        f"[OK] Dataset loaded: 1.8M shards ready.",
        "[TRAIN] Starting backpropagation ensemble...",
        f"[OK] Training complete. Final Accuracy: {metrics[-1].accuracy}",
        f"[SAVE] Model weights exported to registry: ENSEMBLE-{job_id}"
    ]

    return TrainingResponse(
        job_id=job_id,
        status="completed",
        metrics=metrics,
        logs=logs
    )

@router.get("/files")
def get_lab_files():
    """Return realistic workspace files for the Data Science Lab."""
    return [
        {"id": "1", "name": "claims_ensemble_v2.py", "type": "python", "status": "stable", "size": "4.2 KB"},
        {"id": "2", "name": "fraud_detection_weights.bin", "type": "binary", "status": "legacy", "size": "156 MB"},
        {"id": "3", "name": "training_history.json", "type": "json", "status": "synced", "size": "12 KB"},
        {"id": "4", "name": "deployment_config.yaml", "type": "yaml", "status": "modified", "size": "1.1 KB"},
        {"id": "5", "name": "feature_importance.csv", "type": "csv", "status": "stable", "size": "890 KB"},
    ]

@router.get("/metrics/radar")
def get_radar_metrics():
    """Return realistic model quality radar data."""
    return [
        {"subject": "Historical Accuracy", "A": 120, "B": 110, "fullMark": 150},
        {"subject": "Compute Efficiency", "A": 98, "B": 130, "fullMark": 150},
        {"subject": "Data Density", "A": 86, "B": 130, "fullMark": 150},
        {"subject": "Model Entropy", "A": 99, "B": 100, "fullMark": 150},
        {"subject": "Predictive Lift", "A": 85, "B": 90, "fullMark": 150},
        {"subject": "Latency (ms)", "A": 65, "B": 85, "fullMark": 150},
    ]
