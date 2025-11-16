import logging
import os
from pathlib import Path
from app.core.config import settings
from typing import Literal

logger = logging.getLogger(__name__)


def is_path_allowed(requested: str, allowed_dir: str) -> bool:
    """
    Return True if `requested` is inside `allowed_dir` (or equal to it).

    Parameters
    ----------
    - requested   : str or Path   – the file/path the user asked for
    - allowed_dir : str or Path   – the root directory that is permitted

    Examples
    --------
    >>> is_path_allowed("/var/www/app/index.html", "/var/www/app")
    True
    >>> is_path_allowed("/var/www/app/../secret.txt", "/var/www/app")
    False
    >>> is_path_allowed("/var/www/app/sub/file.txt", "/var/www/app")
    True
    """
    # 1. Convert to Path objects
    req = Path(requested)
    base = Path(allowed_dir)

    # 2. Resolve *both* paths:
    #    • expands ~, removes . and ..
    #    • follows symlinks (use .absolute() if you want to keep them)
    try:
        req_res = req.resolve(strict=False)      # strict=False → ok if file does not exist
        base_res = base.resolve(strict=True)     # base must exist
    except Exception:
        return False

    # 3. Normalise to strings with a trailing separator – this prevents
    #    "/home/user" from matching "/home/user2"
    base_str = str(base_res) + os.sep
    req_str  = str(req_res)

    # 4. Check prefix
    return req_str == str(base_res) or req_str.startswith(base_str)

def write_file(filename: str, value: str = '', write_type: Literal['w', 'a', 'x', 'wt'] = 'wt'):
    """
    Write content to a file with specified mode.

    This function writes data to a file after validating that the target path
    is within the allowed directory. It supports multiple write modes and logs
    all write operations.

    Args:
        filename (str): The path to the file to write. Must be within CURRENT_DIR
            or a RuntimeError will be raised.
        value (str, optional): The content to write to the file. Defaults to empty string.
        write_type (Literal['w', 'a', 'x', 'wt'], optional): The file write mode.
            - 'w': Write mode (truncate if exists)
            - 'a': Append mode (add to end of file)
            - 'x': Exclusive creation (fails if file exists)
            - 'wt': Write mode text (default)
            Defaults to 'wt'.

    Returns:
        None

    Raises:
        RuntimeError: If the filename path is outside the allowed CURRENT_DIR.
        FileExistsError: If write_type is 'x' and the file already exists.
        IOError: If the file cannot be written due to permission or I/O errors.

    Side Effects:
        - Logs info message on successful write
        - Logs error message if path validation fails
        - Creates or modifies the specified file

    Example:
        write_file('data.txt', 'Hello World')  # Write to file
        write_file('log.txt', 'New entry\\n', 'a')  # Append to file
    """
    if not is_path_allowed(filename, settings.CURRENT_DIR):
        logger.error(f"Attempted to write to file outside current directory: {filename}")
        raise RuntimeError('Cannot write to files that are not in the current directory.')
    with open(file=filename, mode=write_type) as file:
        file.write(value)
    logger.info(f"File '{filename}' written with mode '{write_type}'.")

def read_file(filename: str, read_type: Literal['r', 'rb'] = 'r'):
    """
    Read the contents of a file that is located within the configured current directory.

    Parameters
    ----------
    filename : str
        Path to the target file to read. Must be located inside the application's
        allowed current directory (checked via is_path_allowed against settings.CURRENT_DIR).
    read_type : Literal['r', 'rb'], optional
        Mode used to open the file:
        - 'r'  : read text and return a str (default)
        - 'rb' : read binary and return bytes

    Returns
    -------
    str | bytes
        The contents of the file. Type depends on read_type ('r' -> str, 'rb' -> bytes).

    Raises
    ------
    RuntimeError
        If the requested filename is outside the allowed current directory.
    RuntimeError
        If the path does not point to an existing regular file.

    Behavior and side effects
    -------------------------
    - Validates that the path is allowed (prevents directory traversal / access outside
      the configured workspace).
    - Verifies that the path exists and is a regular file.
    - Opens the file with the requested mode, reads its entire contents, logs success,
      and returns the contents.
    - Logs errors before raising RuntimeError for disallowed paths or missing files.

    Notes for AI agent use
    ----------------------
    intent:
        Safely and reliably obtain the full contents of a file that must reside within
        the application's configured current directory. Protects against reading files
        outside the permitted workspace.
    prerequisites:
        - settings.CURRENT_DIR must be defined.
        - is_path_allowed(path, settings.CURRENT_DIR) must correctly determine allowed paths.
        - The caller must have read permissions for the file.
    expected_errors_and_messages:
        - "Attempted to read file outside current directory: {filename}" (logged) -> RuntimeError
        - "{filename} is not a file. Have you created it?" (logged) -> RuntimeError
    examples:
        >>> read_file('/project/current_dir/notes.txt')
        'Hello world\\n'
        >>> read_file('/project/current_dir/image.png', 'rb')[:4]
        b'\\x89PNG'
    security_considerations:
        - This function enforces a directory whitelist; do not bypass is_path_allowed.
        - Do not pass user-supplied unvalidated paths directly without appropriate checks.
    """
    if not is_path_allowed(filename, settings.CURRENT_DIR):
        logger.error(f"Attempted to read file outside current directory: {filename}")
        raise RuntimeError('Cannot write to files that are not in the current directory.')
    if not os.path.isfile(filename):
        logger.error(f'{filename} is not a file.')
        raise RuntimeError(f'{filename} is not a file. Have you created it?')
    with open(file=filename, mode=read_type) as file:
        file_contents = file.read()
        logger.info(f'Read {filename} successfully.')
        return file_contents

def list_files_in_dir(dir: str):
    """
    List files in a directory, enforcing a security boundary.

    Parameters
    ----------
    dir : str
        Path of the directory to list.

    Returns
    -------
    list[str]
        A list of directory entries (filenames and subdirectory names) as returned by os.listdir.

    Raises
    ------
    RuntimeError
        If the provided path is not allowed (i.e., is outside settings.CURRENT_DIR). An error is also logged via logger before raising.

    Behavior / Side effects
    -----------------------
    - Calls is_path_allowed(dir, settings.CURRENT_DIR) to verify the path is permitted.
    - If the path is not allowed, logs an error and raises RuntimeError with a message refusing access.
    - If allowed, delegates to os.listdir(dir) and returns the result.

    Dependencies
    ------------
    - is_path_allowed(path, base) -> bool must be implemented and imported.
    - settings.CURRENT_DIR must be defined and imported.
    - logger must be configured for error logging.
    - os must be imported.

    Agent metadata (machine-readable; for automated orchestration)
    ----------------------------------------------------------------
    {
      "name": "list_files_in_dir",
      "description": "Return directory entries for a path restricted to the current project directory.",
      "inputs": {
        "dir": "string (path)"
      },
      "outputs": {
        "result": "list of strings"
      },
      "preconditions": [
        "is_path_allowed(dir, settings.CURRENT_DIR) == True"
      ],
      "errors": [
        {
          "type": "RuntimeError",
          "condition": "path not allowed",
          "message": "Cannot write to files that are not in the current directory."
        }
      ],
      "permissions": "read-only within settings.CURRENT_DIR",
      "notes": [
        "Do not attempt to list paths outside the allowed directory; the function will refuse and log the attempt."
      ]
    }
    """
    if not is_path_allowed(dir, settings.CURRENT_DIR):
        logger.error(f"Attempted to read file structure outside current directory: {dir}")
        raise RuntimeError('Cannot write to files that are not in the current directory.')
    else:
        return os.listdir(dir)
    
def get_current_dir():
    return settings.CURRENT_DIR