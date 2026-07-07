import pytest

from services import ollama_services


class TestCheckOllamaRunning:
    def test_returns_true_when_ps_succeeds(self, monkeypatch):
        monkeypatch.setattr(ollama_services.ollama, "ps", lambda: {"models": []})
        assert ollama_services.check_ollama_running() is True

    def test_returns_false_on_connection_error(self, monkeypatch):
        def boom():
            raise ConnectionError("not running")

        monkeypatch.setattr(ollama_services.ollama, "ps", boom)
        assert ollama_services.check_ollama_running() is False


class TestGetAllModels:
    def test_returns_ollama_list_result(self, monkeypatch):
        sentinel = {"models": [{"model": "qwen2.5:14b"}]}
        monkeypatch.setattr(ollama_services.ollama, "list", lambda: sentinel)
        assert ollama_services.get_all_models() is sentinel

    def test_reraises_connection_error(self, monkeypatch):
        def boom():
            raise ConnectionError("not running")

        monkeypatch.setattr(ollama_services.ollama, "list", boom)
        with pytest.raises(ConnectionError):
            ollama_services.get_all_models()
