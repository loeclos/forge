import json
import logging
import time

from config.logging import JsonFormatter, delete_old_logs


class TestJsonFormatter:
    def _make_record(self, msg="hello", level=logging.INFO):
        return logging.LogRecord(
            name="app",
            level=level,
            pathname="/some/module.py",
            lineno=42,
            msg=msg,
            args=(),
            exc_info=None,
        )

    def test_format_returns_valid_json(self):
        formatted = JsonFormatter().format(self._make_record())
        parsed = json.loads(formatted)
        assert isinstance(parsed, dict)

    def test_format_includes_expected_fields(self):
        parsed = json.loads(JsonFormatter().format(self._make_record("a message")))
        assert parsed["level"] == "INFO"
        assert parsed["logger"] == "app"
        assert parsed["line"] == 42
        assert parsed["message"] == "a message"
        assert "timestamp" in parsed

    def test_format_interpolates_message_args(self):
        record = logging.LogRecord(
            name="app",
            level=logging.WARNING,
            pathname="/some/module.py",
            lineno=1,
            msg="value is %s",
            args=("x",),
            exc_info=None,
        )
        parsed = json.loads(JsonFormatter().format(record))
        assert parsed["message"] == "value is x"
        assert parsed["level"] == "WARNING"


class TestDeleteOldLogs:
    def test_deletes_files_older_than_cutoff(self, tmp_path):
        old = tmp_path / "old.log"
        old.write_text("old")
        old_time = time.time() - 10 * 86400
        os_utime_set(old, old_time)

        delete_old_logs(str(tmp_path), days=3)
        assert not old.exists()

    def test_keeps_recent_files(self, tmp_path):
        recent = tmp_path / "recent.log"
        recent.write_text("recent")
        delete_old_logs(str(tmp_path), days=3)
        assert recent.exists()

    def test_deletes_rotated_log_files(self, tmp_path):
        rotated = tmp_path / "app.log.1"
        rotated.write_text("rotated")
        os_utime_set(rotated, time.time() - 10 * 86400)
        delete_old_logs(str(tmp_path), days=3)
        assert not rotated.exists()

    def test_missing_directory_is_noop(self, tmp_path):
        missing = tmp_path / "nope"
        # Should not raise even though directory does not exist.
        delete_old_logs(str(missing), days=3)


def os_utime_set(path, mtime):
    import os

    os.utime(path, (mtime, mtime))
