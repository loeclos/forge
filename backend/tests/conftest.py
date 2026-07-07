import os
import sys
from pathlib import Path

# `core.config.Settings` requires TAVILY_API_KEY (a plain str) at import time.
# Provide a dummy value so importing app modules does not fail in environments
# where the real key is not configured.
os.environ.setdefault("TAVILY_API_KEY", "test-tavily-key")

# Ensure the application package root (backend/app) is importable so that
# intra-app imports such as `from core.config import settings` resolve the
# same way they do when the app is launched with `uvicorn app.main:app`.
APP_DIR = Path(__file__).resolve().parent.parent / "app"
if str(APP_DIR) not in sys.path:
    sys.path.insert(0, str(APP_DIR))
