import logging
import json
import sys
from datetime import datetime
from logging.handlers import RotatingFileHandler
from pathlib import Path
import os
from datetime import timedelta

# Custom JSON formatter for structured logs
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "module": record.module,
            "line": record.lineno,
            "message": record.getMessage(),
            "extra": getattr(record, "extra", {})
        }
        return json.dumps(log_entry)

def delete_old_logs(log_dir="logs", days=3):
    """Delete log files older than `days` days in `log_dir`."""
    cutoff = datetime.utcnow() - timedelta(days=days)
    log_path = Path(log_dir)
    if not log_path.exists():
        return
    for file in log_path.glob("*.log*"):
        try:
            mtime = datetime.utcfromtimestamp(file.stat().st_mtime)
            if mtime < cutoff:
                file.unlink()
        except Exception:
            pass

def setup_logging():
    # Create logs directory
    Path("logs").mkdir(exist_ok=True)

    # Delete old logs
    delete_old_logs("logs", days=3)
    
    # Root logger config
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "json": {
                "()": JsonFormatter,
                "format": "",
            },
            "standard": {
                "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",
                "formatter": "standard",
                "stream": sys.stdout,
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "DEBUG",
                "formatter": "json",
                "filename": "logs/app.log",
                "maxBytes": 5 * 1024 * 1024,  # 5MB
                "backupCount": 3,
            },
        },
        "root": {
            "level": "INFO",
            "handlers": ["console", "file"],
        },
        "loggers": {
            "app": {  # App-specific logger
                "level": "DEBUG",
                "handlers": ["console", "file"],
                "propagate": True,
            },
        },
    }
    
    import logging.config
    logging.config.dictConfig(logging_config)