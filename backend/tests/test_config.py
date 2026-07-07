from core.config import Settings


class TestSettings:
    def test_default_values(self):
        s = Settings(TAVILY_API_KEY="test-key")
        assert s.APP_NAME == "Forge"
        assert s.CURRENT_DIR == "./"
        assert s.DATABASE_URL.startswith("sqlite:///")
        assert s.MODEL

    def test_overrides_are_applied(self):
        s = Settings(APP_NAME="Custom", MODEL="llama3:8b", TAVILY_API_KEY="k")
        assert s.APP_NAME == "Custom"
        assert s.MODEL == "llama3:8b"
