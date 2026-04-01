from fastapi.testclient import TestClient

from main import app
from src.core.database import Base, engine

client = TestClient(app)


def setup_module():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_register_and_login_flow():
    register_payload = {"email": "user@example.com", "password": "Secret123!"}
    r = client.post("/auth/register", json=register_payload)
    assert r.status_code == 201, r.text
    assert r.json()["email"] == register_payload["email"]

    login = client.post("/auth/login", json=register_payload)
    assert login.status_code == 200
    tokens = login.json()
    assert "access_token" in tokens

    me = client.get("/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"})
    assert me.status_code == 200
    assert me.json()["email"] == register_payload["email"]
