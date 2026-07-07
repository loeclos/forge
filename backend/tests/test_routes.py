import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from api.v1 import ollama_routes, util_routes
from core.config import settings


@pytest.fixture
def client():
    app = FastAPI()
    app.include_router(ollama_routes.router, prefix="/api/models")
    app.include_router(util_routes.router, prefix="/api/utils")
    return TestClient(app)


class TestUtilRoutes:
    def test_getcwd_returns_current_dir(self, client, monkeypatch):
        monkeypatch.setattr(settings, "CURRENT_DIR", "/tmp/workspace")
        resp = client.get("/api/utils/getcwd")
        assert resp.status_code == 200
        assert resp.json() == {"dir": "/tmp/workspace"}

    def test_change_cwd_to_existing_dir(self, client, tmp_path):
        resp = client.post("/api/utils/change_cwd", json={"path": str(tmp_path)})
        assert resp.status_code == 200
        assert str(tmp_path) in resp.json()["message"]
        assert str(settings.CURRENT_DIR) == str(tmp_path.resolve())


class TestOllamaRoutes:
    def test_get_current_model(self, client, monkeypatch):
        monkeypatch.setattr(settings, "MODEL", "qwen2.5:14b")
        resp = client.get("/api/models/current")
        assert resp.status_code == 200
        assert resp.json() == {"name": "qwen2.5:14b"}

    def test_get_models_formats_ollama_response(self, client, monkeypatch):
        class Details:
            parameter_size = "14B"

        class Model:
            model = "qwen2.5:14b"
            size = 9000000000
            details = Details()

        class ModelsList:
            models = [Model()]

        monkeypatch.setattr(ollama_routes, "get_all_models", lambda: ModelsList())
        resp = client.get("/api/models/all")
        assert resp.status_code == 200
        assert resp.json() == [
            {"name": "qwen2.5:14b", "size": 9000000000, "param_size": "14B"}
        ]

    def test_check_ollama_alive_true(self, client, monkeypatch):
        monkeypatch.setattr(ollama_routes.ollama, "ps", lambda: {"models": []})
        resp = client.get("/api/models/alive")
        assert resp.status_code == 200
        assert resp.json() is True

    def test_check_ollama_alive_false(self, client, monkeypatch):
        def boom():
            raise ConnectionError("down")

        monkeypatch.setattr(ollama_routes.ollama, "ps", boom)
        resp = client.get("/api/models/alive")
        assert resp.status_code == 200
        assert resp.json() is False
