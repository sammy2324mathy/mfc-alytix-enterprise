from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_rules():
    r = client.get("/compliance/rules/")
    assert r.status_code == 200
