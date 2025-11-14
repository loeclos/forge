# logging.py Documentation

## File Overview

Logging configuration for the Forge backend application. Sets up structured JSON logging to files and standard output to console.

**Location:** `backend/app/config/logging.py`

## Imports

```python
import logging
import json
import sys
from datetime import datetime
from logging.handlers import RotatingFileHandler
from pathlib import Path
import os
from datetime import timedelta
```

## Classes

### `JsonFormatter`

Custom logging formatter that outputs log entries as JSON for structured logging.

**Base Class:** `logging.Formatter`

**Definition:**
```python
class JsonFormatter(logging.Formatter):
    def format(self, record):
        # Implementation
```

#### Methods

##### `format(record)`

Formats a log record as a JSON string.

**Signature:**
```python
def format(self, record: logging.LogRecord) -> str:
```

**Parameters:**
- `record` (logging.LogRecord): The log record to format

**Returns:**
- `str`: JSON-formatted log entry string

**Behavior:**
- Creates a dictionary with log entry fields:
  - `timestamp`: UTC timestamp in ISO format
  - `level`: Log level name (DEBUG, INFO, WARNING, ERROR, CRITICAL)
  - `logger`: Logger name
  - `module`: Module name where log was created
  - `line`: Line number where log was created
  - `message`: Log message
  - `extra`: Additional extra fields from record (if any)
- Converts dictionary to JSON string
- Returns JSON string

**Output Format:**
```json
{
  "timestamp": "2024-01-15T10:30:45.123456",
  "level": "INFO",
  "logger": "app",
  "module": "main",
  "line": 42,
  "message": "Application started",
  "extra": {}
}
```

**Usage:**
This formatter is automatically used by the file handler for structured logging.

---

## Functions

### `delete_old_logs(log_dir, days)`

Deletes log files older than a specified number of days to prevent disk space issues.

**Signature:**
```python
def delete_old_logs(log_dir: str = "logs", days: int = 3) -> None:
```

**Parameters:**
- `log_dir` (str, optional): Directory containing log files. Default: `"logs"`
- `days` (int, optional): Number of days to keep logs. Default: `3`

**Returns:**
- `None`

**Behavior:**
- Calculates cutoff date (current time - days)
- Converts `log_dir` to Path object
- Checks if directory exists (returns early if not)
- Iterates over all `.log*` files in directory
- Gets file modification time
- Deletes files older than cutoff date
- Silently handles exceptions (file access errors, etc.)

**Example:**
```python
# Delete logs older than 7 days
delete_old_logs("logs", days=7)
```

**Error Handling:**
- Silently catches and ignores exceptions
- Continues processing other files if one fails
- Prevents log cleanup from crashing the application

**Related Functions:**
- `setup_logging()` - Calls this function during setup

---

### `setup_logging()`

Main function to configure logging for the application. Sets up both console and file handlers with appropriate formatters.

**Signature:**
```python
def setup_logging() -> None:
```

**Returns:**
- `None`

**Behavior:**
1. **Creates logs directory:**
   - Creates `logs/` directory if it doesn't exist
   - Uses `Path("logs").mkdir(exist_ok=True)`

2. **Deletes old logs:**
   - Calls `delete_old_logs("logs", days=3)` to clean up old files

3. **Configures logging:**
   - Sets up logging configuration dictionary
   - Defines formatters (JSON and standard)
   - Configures handlers (console and file)
   - Sets logger levels

4. **Applies configuration:**
   - Uses `logging.config.dictConfig()` to apply settings

**Logging Configuration:**

**Formatters:**
- **JSON Formatter:**
  - Uses `JsonFormatter` class
  - Outputs structured JSON logs
  
- **Standard Formatter:**
  - Format: `"%(asctime)s [%(levelname)s] %(name)s: %(message)s"`
  - Human-readable format

**Handlers:**
- **Console Handler:**
  - Class: `logging.StreamHandler`
  - Level: `INFO`
  - Formatter: Standard formatter
  - Stream: `sys.stdout`
  
- **File Handler:**
  - Class: `RotatingFileHandler`
  - Level: `DEBUG`
  - Formatter: JSON formatter
  - File: `logs/app.log`
  - Max size: 5MB (`5 * 1024 * 1024`)
  - Backup count: 3 files
  - Rotation: Automatically rotates when file reaches max size

**Loggers:**
- **Root Logger:**
  - Level: `INFO`
  - Handlers: Console and File
  - Propagates to child loggers
  
- **App Logger:**
  - Name: `"app"`
  - Level: `DEBUG`
  - Handlers: Console and File
  - Propagates: `True`

**Usage:**
```python
from app.config.logging import setup_logging

# Call at application startup (before other imports that use logging)
setup_logging()

# Now logging is configured
import logging
logger = logging.getLogger("app")
logger.info("Application started")
```

**Log File Location:**
```
backend/app/logs/app.log
```

**Log Rotation:**
- When `app.log` reaches 5MB, it's rotated
- Old logs are renamed: `app.log.1`, `app.log.2`, `app.log.3`
- New `app.log` is created
- Oldest backup is deleted when limit is reached

**Example Log Output:**

**Console (Standard Format):**
```
2024-01-15 10:30:45,123 [INFO] app: Application started
2024-01-15 10:30:46,456 [DEBUG] app.api.v1.chat_routes: Processing chat request
```

**File (JSON Format):**
```json
{"timestamp": "2024-01-15T10:30:45.123456", "level": "INFO", "logger": "app", "module": "main", "line": 42, "message": "Application started", "extra": {}}
{"timestamp": "2024-01-15T10:30:46.456789", "level": "DEBUG", "logger": "app.api.v1.chat_routes", "module": "chat_routes", "line": 58, "message": "Processing chat request", "extra": {}}
```

---

## Usage Examples

### Basic Logging

```python
import logging
from app.config.logging import setup_logging

# Setup logging (call once at startup)
setup_logging()

# Get logger
logger = logging.getLogger("app")

# Log messages
logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
logger.critical("Critical message")
```

### Module-Specific Logging

```python
import logging

# Get logger for specific module
logger = logging.getLogger(__name__)

# Log with context
logger.info(f"Processing request for session: {session_id}")
logger.error(f"Failed to connect to Ollama: {error}")
```

### Structured Logging (Extra Fields)

```python
logger.info("User action", extra={
    "user_id": "12345",
    "action": "login",
    "ip_address": "192.168.1.1"
})
```

---

## Related Files

- `app/main.py` - Calls `setup_logging()` at startup

## Notes

1. **Structured Logging:** JSON format in files enables easy parsing and analysis with log aggregation tools.

2. **Log Rotation:** Automatic rotation prevents log files from growing too large and filling disk space.

3. **Old Log Cleanup:** Automatic deletion of old logs prevents disk space issues over time.

4. **Dual Output:** Console output is human-readable, file output is machine-readable (JSON).

5. **Log Levels:** 
   - Console: INFO and above (less verbose)
   - File: DEBUG and above (more verbose for debugging)

6. **Logger Hierarchy:** The "app" logger inherits from root logger but has its own level configuration.

7. **Error Handling:** Log cleanup errors are silently handled to prevent logging setup failures.

8. **Timestamp Format:** Uses UTC timestamps in ISO format for consistency and timezone independence.

