"""Data Pipelines API — ETL pipeline catalog and execution."""

from fastapi import APIRouter
from typing import List

from src.api.schemas.ds_schemas import Pipeline, PipelineStatus

router = APIRouter()

PIPELINES: List[Pipeline] = [
    Pipeline(pipeline_id="PL-001", name="Policy Master ETL", source="Core Insurance DB", schedule="Every 2 hours", record_count=1_840_000, status=PipelineStatus.healthy, last_run="14 min ago"),
    Pipeline(pipeline_id="PL-002", name="Claims Ingestion", source="Claims API + CSV Upload", schedule="Hourly", record_count=421_000, status=PipelineStatus.healthy, last_run="32 min ago"),
    Pipeline(pipeline_id="PL-003", name="Customer 360 Builder", source="CRM + Policy + Claims", schedule="Daily 02:00", record_count=892_000, status=PipelineStatus.healthy, last_run="5 hours ago"),
    Pipeline(pipeline_id="PL-004", name="Premium Transactions", source="Finance Ledger", schedule="Every 4 hours", record_count=2_100_000, status=PipelineStatus.healthy, last_run="1 hour ago"),
    Pipeline(pipeline_id="PL-005", name="External Market Data", source="Bloomberg API", schedule="Daily 06:00", record_count=45_000, status=PipelineStatus.warning, last_run="18 hours ago"),
    Pipeline(pipeline_id="PL-006", name="Fraud Feature Store", source="Derived Features", schedule="Every 30 min", record_count=3_200_000, status=PipelineStatus.healthy, last_run="8 min ago"),
]


@router.get("/", response_model=List[Pipeline])
def list_pipelines():
    return PIPELINES


@router.post("/{pipeline_id}/run")
def run_pipeline(pipeline_id: str):
    for p in PIPELINES:
        if p.pipeline_id == pipeline_id:
            p.last_run = "Just now"
            return {"status": "triggered", "pipeline": p}
    return {"error": "Pipeline not found"}


@router.get("/{pipeline_id}/status")
def pipeline_status(pipeline_id: str):
    for p in PIPELINES:
        if p.pipeline_id == pipeline_id:
            return {"pipeline_id": p.pipeline_id, "status": p.status, "last_run": p.last_run, "records": p.record_count}
    return {"error": "Pipeline not found"}
