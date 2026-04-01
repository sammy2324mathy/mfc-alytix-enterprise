from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_projects():
    r = client.post("/workspace/projects/", params={"name": "Standard Project"})
    assert r.status_code == 200
    r2 = client.get("/workspace/projects/")
    assert r2.status_code == 200
