from fastapi.testclient import TestClient

from main import app
from src.core.database import Base, engine

client = TestClient(app)


def setup_module():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_account_flow():
    # create account A
    a = client.post(
        "/accounting/accounts/",
        json={"name": "Cash", "code": "1000", "type": "asset", "opening_balance": 0},
    )
    assert a.status_code == 201, a.text
    cash_id = a.json()["id"]

    b = client.post(
        "/accounting/accounts/",
        json={"name": "Revenue", "code": "4000", "type": "revenue", "opening_balance": 0},
    )
    assert b.status_code == 201
    revenue_id = b.json()["id"]

    tx = client.post(
        "/accounting/transactions/",
        json={
            "description": "Sale",
            "lines": [
                {"account_id": cash_id, "debit": 100, "credit": 0},
                {"account_id": revenue_id, "debit": 0, "credit": 100},
            ],
        },
    )
    assert tx.status_code == 201, tx.text

    tb = client.get("/accounting/reports/trial-balance")
    assert tb.status_code == 200
    body = tb.json()
    assert len(body) == 2
