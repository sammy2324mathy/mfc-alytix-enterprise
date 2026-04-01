from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.application.services.accounting_service import AccountingService
from src.core.database import get_session
from src.schemas.transaction_schema import TransactionCreate, TransactionRead

router = APIRouter()


@router.post("/", response_model=TransactionRead, status_code=201)
def post_transaction(payload: TransactionCreate, db: Session = Depends(get_session)):
    lines = [line.model_dump() for line in payload.lines]
    tx = AccountingService(db).post_transaction(description=payload.description, lines=lines)
    return tx


@router.get("/", response_model=list[TransactionRead])
def list_transactions(db: Session = Depends(get_session)):
    return AccountingService(db).transactions.list()
