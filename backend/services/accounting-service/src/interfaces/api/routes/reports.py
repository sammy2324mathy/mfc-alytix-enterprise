from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io

from src.application.services.reporting_service import ReportingService
from src.core.database import get_session

router = APIRouter()


@router.get("/trial-balance")
def trial_balance(db: Session = Depends(get_session)):
    return ReportingService(db).trial_balance()


@router.get("/income-statement")
def income_statement(db: Session = Depends(get_session)):
    return ReportingService(db).income_statement()


@router.get("/balance-sheet")
def balance_sheet(db: Session = Depends(get_session)):
    return ReportingService(db).balance_sheet()


@router.get("/cash-flow")
def cash_flow_statement(db: Session = Depends(get_session)):
    return ReportingService(db).cash_flow_statement()


@router.get("/financial-ratios")
def financial_ratios(db: Session = Depends(get_session)):
    return ReportingService(db).financial_ratios()


@router.get("/ap-aging")
def ap_aging(db: Session = Depends(get_session)):
    return ReportingService(db).ap_aging()


@router.get("/ar-aging")
def ar_aging(db: Session = Depends(get_session)):
    return ReportingService(db).ar_aging()


@router.get("/export/{report_type}")
def export_report(
    report_type: str,
    format: str = Query("csv", regex="^(csv)$"),
    db: Session = Depends(get_session)
):
    """Export a financial report in the specified format."""
    from shared.utils.exporter import CSVExporter
    
    service = ReportingService(db)
    data = []
    filename = f"{report_type}_{format}.csv"
    
    if report_type == "trial-balance":
        data = service.trial_balance()
    elif report_type == "income-statement":
        data = service.income_statement()
    elif report_type == "balance-sheet":
        data = service.balance_sheet()
    else:
        raise HTTPException(status_code=400, detail="Invalid report type for export")
        
    csv_content = CSVExporter.generate_csv(data)
    
    return StreamingResponse(
        io.StringIO(csv_content),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
