from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_premium():
    r = client.post("/actuarial/pricing/premium", json={"base_rate": 100, "age": 40, "smoker": False})
    assert r.status_code == 200
    assert "premium" in r.json()


def test_kaplan_meier():
    r = client.post("/actuarial/survival/kaplan-meier", json={"durations": [1, 2, 3], "events": [1, 0, 1]})
    assert r.status_code == 200
    data = r.json()
    assert "survival_curve" in data and len(data["survival_curve"]) == 3
