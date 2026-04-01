from decimal import Decimal
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from src.infrastructure.models import TaxReturn, TaxConfig, Transaction

class TaxService:
    def __init__(self, db: Session):
        self.db = db

    def get_tax_returns(self) -> List[TaxReturn]:
        return self.db.query(TaxReturn).order_by(TaxReturn.due_date.desc()).all()

    def generate_vat_return(self, period: str) -> TaxReturn:
        # Simplified: calculate VAT from transactions (assuming 20% flat for this demo)
        # In a real system, we'd filter by tax tags on ledger entries
        transactions = self.db.query(Transaction).all()
        output_vat = sum(t.amount * Decimal('0.20') for t in transactions if t.amount > 0)
        input_vat = sum(abs(t.amount) * Decimal('0.20') for t in transactions if t.amount < 0)
        net_payable = output_vat - input_vat

        tax_return = TaxReturn(
            return_id=f"VAT-{period}-{datetime.now().strftime('%H%M')}",
            tax_type="VAT / GST",
            period=period,
            due_date=datetime.now() + timedelta(days=30),
            tax_liability=net_payable,
            status="DRAFT",
            prepared_by="System Automator"
        )
        self.db.add(tax_return)
        self.db.commit()
        self.db.refresh(tax_return)
        return tax_return

    def update_return_status(self, return_id: int, status: str) -> Optional[TaxReturn]:
        tax_return = self.db.query(TaxReturn).get(return_id)
        if tax_return:
            tax_return.status = status
            if status == "FILED":
                tax_return.filing_date = datetime.utcnow()
            self.db.commit()
            self.db.refresh(tax_return)
        return tax_return

    def get_vat_summary(self) -> List[Dict]:
        # Return mock summary for chart
        return [
            {"period": "Jul", "outputVAT": 42000, "inputVAT": 28000, "net": 14000},
            {"period": "Aug", "outputVAT": 51000, "inputVAT": 35000, "net": 16000},
            {"period": "Sep", "outputVAT": 48000, "inputVAT": 31000, "net": 17000},
            {"period": "Oct", "outputVAT": 55000, "inputVAT": 38000, "net": 17000},
            {"period": "Nov", "outputVAT": 58000, "inputVAT": 40000, "net": 18000},
        ]