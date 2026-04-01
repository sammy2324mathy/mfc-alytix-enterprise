from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_chat_accountant():
    r = client.post("/ai/chat/", json={"message": "Post trial balance", "agent": "accountant"})
    assert r.status_code == 200
    body = r.json()
    assert body["agent"] == "accountant"
    assert "trial balance" in body["reply"].lower()
