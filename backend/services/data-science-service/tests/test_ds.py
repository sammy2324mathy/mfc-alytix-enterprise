from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_features():
    r = client.post("/ds/features/", params={"name": "revenue_growth", "description": "YoY revenue growth"})
    assert r.status_code == 200
    r2 = client.get("/ds/features/")
    assert r2.status_code == 200
