from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import List
from uuid import uuid4


# -------------------------------
# Invoice Line Item
# -------------------------------
@dataclass
class InvoiceItem:
    description: str
    quantity: int
    unit_price: float

    def __post_init__(self):
        if self.quantity <= 0:
            raise ValueError("Quantity must be greater than zero")

        if self.unit_price < 0:
            raise ValueError("Unit price cannot be negative")

    def total(self) -> float:
        return self.quantity * self.unit_price


# -------------------------------
# Invoice Entity
# -------------------------------
@dataclass
class Invoice:
    customer_id: int
    items: List[InvoiceItem]

    id: str = field(default_factory=lambda: str(uuid4()))
    created_at: datetime = field(default_factory=datetime.utcnow)
    due_date: datetime = field(default_factory=lambda: datetime.utcnow() + timedelta(days=30))
    status: str = "pending"  # pending, paid, overdue, cancelled
    tax_rate: float = 0.0  # e.g., 0.15 for 15%

    def __post_init__(self):
        self._validate()

    # -------------------------------
    # Validation
    # -------------------------------
    def _validate(self):
        if not self.items:
            raise ValueError("Invoice must contain at least one item")

        if self.tax_rate < 0:
            raise ValueError("Tax rate cannot be negative")

    # -------------------------------
    # Subtotal
    # -------------------------------
    def subtotal(self) -> float:
        return sum(item.total() for item in self.items)

    # -------------------------------
    # Tax Calculation
    # -------------------------------
    def tax_amount(self) -> float:
        return self.subtotal() * self.tax_rate

    # -------------------------------
    # Total Amount
    # -------------------------------
    def total_amount(self) -> float:
        return self.subtotal() + self.tax_amount()

    # -------------------------------
    # Status Management
    # -------------------------------
    def mark_as_paid(self):
        if self.status == "paid":
            raise ValueError("Invoice already paid")

        self.status = "paid"

    def mark_as_cancelled(self):
        if self.status == "paid":
            raise ValueError("Cannot cancel a paid invoice")

        self.status = "cancelled"

    def update_status(self):
        if self.status == "pending" and datetime.utcnow() > self.due_date:
            self.status = "overdue"

    # -------------------------------
    # Serialize
    # -------------------------------
    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "created_at": self.created_at,
            "due_date": self.due_date,
            "status": self.status,
            "items": [
                {
                    "description": item.description,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "total": item.total()
                }
                for item in self.items
            ],
            "subtotal": round(self.subtotal(), 2),
            "tax_rate": self.tax_rate,
            "tax": round(self.tax_amount(), 2),
            "total": round(self.total_amount(), 2)
        }