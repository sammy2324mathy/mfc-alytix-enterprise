from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_monte_carlo():
    res = client.post(
        "/risk/simulations/monte-carlo",
        json={"paths": 20, "horizon": 5, "seed": 1, "mu": 0.05, "sigma": 0.2},
    )
    assert res.status_code == 200
    data = res.json()
    assert "mean_terminal" in data


def test_var_es():
    returns = [0.01, -0.02, 0.015, -0.03, 0.005]
    var = client.post("/risk/metrics/var", json={"returns": returns, "confidence": 0.95})
    es = client.post("/risk/metrics/expected-shortfall", json={"returns": returns, "confidence": 0.95})
    assert var.status_code == 200
    assert es.status_code == 200
