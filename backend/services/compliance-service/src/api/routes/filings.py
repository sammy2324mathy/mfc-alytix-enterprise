from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io
from typing import List

from src.api.schemas.compliance_schemas import Filing, FilingStatus, FilingSubmitRequest
from shared.auth import get_current_user_claims
from src.core.database import get_db
from src.models.db_models import FilingDB

router = APIRouter(dependencies=[Depends(get_current_user_claims)])


@router.post("/", response_model=Filing, status_code=status.HTTP_201_CREATED)
def create_filing(payload: Filing, db: Session = Depends(get_db)):
    """Create a new regulatory filing."""
    existing = db.query(FilingDB).filter_by(filing_id=payload.filing_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Filing ID already exists")
    row = FilingDB(
        filing_id=payload.filing_id,
        regulation_id=payload.regulation_id,
        regulation_name=payload.regulation_name,
        filing_type=payload.filing_type,
        period=payload.period,
        deadline=payload.deadline,
        status=payload.status.value if hasattr(payload.status, "value") else str(payload.status),
        submitted_by=payload.submitted_by,
        submitted_at=payload.submitted_at,
        approved_by=payload.approved_by,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_schema(row)


@router.get("/", response_model=List[Filing])
def list_filings(db: Session = Depends(get_db)):
    """Return all regulatory filings."""
    rows = db.query(FilingDB).order_by(FilingDB.filing_id).all()
    return [_to_schema(r) for r in rows]


@router.get("/{filing_id}", response_model=Filing)
def get_filing(filing_id: str, db: Session = Depends(get_db)):
    """Return a specific filing."""
    row = db.query(FilingDB).filter_by(filing_id=filing_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Filing not found")
    return _to_schema(row)


@router.post("/{filing_id}/submit")
def submit_filing(filing_id: str, req: FilingSubmitRequest, db: Session = Depends(get_db)):
    """Submit a filing for approval."""
    row = db.query(FilingDB).filter_by(filing_id=filing_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Filing not found")
    row.status = "submitted"
    row.submitted_by = req.submitted_by
    from datetime import datetime
    row.submitted_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(row)
    return {"status": "submitted", "filing": _to_schema(row)}


@router.put("/{filing_id}/approve")
def approve_filing(filing_id: str, approved_by: str, db: Session = Depends(get_db)):
    """CCO approves a submitted filing."""
    row = db.query(FilingDB).filter_by(filing_id=filing_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Filing not found")
    row.status = "approved"
    row.approved_by = approved_by
    db.commit()
    db.refresh(row)
    return {"status": "approved", "filing": _to_schema(row)}


@router.post("/{filing_id}/reject")
def reject_filing(filing_id: str, reason: str = Query("Returned for revision"), db: Session = Depends(get_db)):
    """CCO rejects/returns a filing for revision."""
    row = db.query(FilingDB).filter_by(filing_id=filing_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Filing not found")
    row.status = "rejected"
    db.commit()
    db.refresh(row)
    return {"status": "rejected", "reason": reason, "filing": _to_schema(row)}


@router.get("/export")
def export_filings(
    format: str = Query("csv", regex="^(csv)$"),
    db: Session = Depends(get_db)
):
    """Export the compliance filing history in CSV format."""
    from shared.utils.exporter import CSVExporter
    
    rows = db.query(FilingDB).order_by(FilingDB.filing_id).all()
    data = [_to_schema(r).dict() for r in rows]
    
    csv_content = CSVExporter.generate_csv(data)
    
    return StreamingResponse(
        io.StringIO(csv_content),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=compliance_filings.csv"}
    )


def _to_schema(row: FilingDB) -> Filing:
    return Filing(
        filing_id=row.filing_id,
        regulation_id=row.regulation_id,
        regulation_name=row.regulation_name or "",
        filing_type=row.filing_type or "",
        period=row.period or "",
        deadline=row.deadline or "",
        status=row.status,
        submitted_by=row.submitted_by,
        submitted_at=row.submitted_at,
        approved_by=row.approved_by,
    )
