import os

import pytest

from tools import file_tools
from tools.file_tools import (
    get_current_dir,
    is_path_allowed,
    list_files_in_dir,
    read_file,
    write_file,
)


class TestIsPathAllowed:
    def test_file_directly_inside_allowed_dir(self, tmp_path):
        target = tmp_path / "index.html"
        target.write_text("hi")
        assert is_path_allowed(str(target), str(tmp_path)) is True

    def test_file_in_subdirectory_is_allowed(self, tmp_path):
        sub = tmp_path / "sub"
        sub.mkdir()
        target = sub / "file.txt"
        assert is_path_allowed(str(target), str(tmp_path)) is True

    def test_path_equal_to_base_is_allowed(self, tmp_path):
        assert is_path_allowed(str(tmp_path), str(tmp_path)) is True

    def test_parent_traversal_is_rejected(self, tmp_path):
        base = tmp_path / "app"
        base.mkdir()
        escaping = base / ".." / "secret.txt"
        assert is_path_allowed(str(escaping), str(base)) is False

    def test_sibling_prefix_dir_is_rejected(self, tmp_path):
        base = tmp_path / "user"
        base.mkdir()
        sibling = tmp_path / "user2"
        sibling.mkdir()
        target = sibling / "file.txt"
        assert is_path_allowed(str(target), str(base)) is False

    def test_missing_base_dir_returns_false(self, tmp_path):
        missing_base = tmp_path / "does-not-exist"
        target = missing_base / "file.txt"
        assert is_path_allowed(str(target), str(missing_base)) is False


@pytest.fixture
def allowed_dir(tmp_path, monkeypatch):
    monkeypatch.setattr(file_tools.settings, "CURRENT_DIR", str(tmp_path))
    return tmp_path


class TestWriteFile:
    def test_write_creates_file_with_content(self, allowed_dir):
        target = allowed_dir / "out.txt"
        write_file(str(target), "hello world")
        assert target.read_text() == "hello world"

    def test_append_mode_adds_to_existing_content(self, allowed_dir):
        target = allowed_dir / "log.txt"
        write_file(str(target), "a", "w")
        write_file(str(target), "b", "a")
        assert target.read_text() == "ab"

    def test_exclusive_mode_raises_if_file_exists(self, allowed_dir):
        target = allowed_dir / "exists.txt"
        target.write_text("already here")
        with pytest.raises(FileExistsError):
            write_file(str(target), "x", "x")

    def test_write_outside_allowed_dir_raises(self, allowed_dir, tmp_path):
        outside = tmp_path.parent / "escape.txt"
        with pytest.raises(RuntimeError):
            write_file(str(outside), "nope")
        assert not outside.exists()


class TestReadFile:
    def test_read_returns_file_contents(self, allowed_dir):
        target = allowed_dir / "note.txt"
        target.write_text("some text")
        assert read_file(str(target)) == "some text"

    def test_read_binary_returns_bytes(self, allowed_dir):
        target = allowed_dir / "data.bin"
        target.write_bytes(b"\x00\x01\x02")
        assert read_file(str(target), "rb") == b"\x00\x01\x02"

    def test_read_missing_file_raises(self, allowed_dir):
        target = allowed_dir / "missing.txt"
        with pytest.raises(RuntimeError):
            read_file(str(target))

    def test_read_outside_allowed_dir_raises(self, allowed_dir, tmp_path):
        outside = tmp_path.parent / "secret.txt"
        outside.write_text("secret")
        with pytest.raises(RuntimeError):
            read_file(str(outside))


class TestListFilesInDir:
    def test_lists_entries_of_allowed_dir(self, allowed_dir):
        (allowed_dir / "a.txt").write_text("a")
        (allowed_dir / "b.txt").write_text("b")
        assert sorted(list_files_in_dir(str(allowed_dir))) == ["a.txt", "b.txt"]

    def test_list_outside_allowed_dir_raises(self, allowed_dir, tmp_path):
        outside = tmp_path.parent
        with pytest.raises(RuntimeError):
            list_files_in_dir(str(outside))


class TestGetCurrentDir:
    def test_returns_configured_current_dir(self, monkeypatch):
        monkeypatch.setattr(file_tools.settings, "CURRENT_DIR", "/some/dir")
        assert get_current_dir() == "/some/dir"
