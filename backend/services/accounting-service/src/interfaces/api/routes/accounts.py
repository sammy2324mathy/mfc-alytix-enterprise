from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import csv
import io
from sqlalchemy.orm import Session

from src.application.services.accounting_service import AccountingService
from src.core.database import get_session
from src.schemas.account_schema import AccountCreate, AccountRead

router = APIRouter()


@router.post("/", response_model=AccountRead, status_code=201)
def create_account(payload: AccountCreate, db: Session = Depends(get_session)):
    account = AccountingService(db).create_account(
        name=payload.name,
        code=payload.code,
        account_type=payload.account_type,
        opening_balance=payload.opening_balance,
    )
    return AccountRead(
        id=account.id,
        name=account.name,
        code=account.code,
        account_type=account.account_type,
        opening_balance=float(account.opening_balance or 0),
        balance=float(account.opening_balance or 0),
    )


@router.get("/", response_model=list[AccountRead])
def list_accounts(db: Session = Depends(get_session)):
    return AccountingService(db).list_accounts_with_balances()


@router.post("/upload")
async def upload_accounts(file: UploadFile = File(...), db: Session = Depends(get_session)):
    """Bulk create accounts from a CSV file."""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    content = await file.read()
    stream = io.StringIO(content.decode('utf-8'))
    reader = csv.DictReader(stream)
    
    service = AccountingService(db)
    created = 0
    for row in reader:
        try:
            service.create_account(
                name=row['name'],
                code=row['code'],
                account_type=row['account_type'],
                opening_balance=float(row.get('opening_balance', 0))
            )
            created += 1
        except Exception as e:
            # Skip errors for now to ensure partial success
            continue
            
    return {"status": "success", "created": created}
