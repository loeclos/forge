# main.py Documentation

## File Overview

`main.py` is the entry point of the FastAPI application. It initializes the FastAPI app, sets up database connections, configures logging, and registers all API routes.

**Location:** `backend/app/main.py`

## Imports

```python
from typing import Annotated, Literal
from fastapi import Depends, FastAPI, HTTPException, Query
from app.database import SessionLocal, engine, Base
from contextlib import asynccontextmanager
import logging
import os
from app.api.v1 import ollama_routes, chat_routes, util_routes
from app.config.logging import setup_logging
```

## Functions

### `get_db()`

Database dependency function for FastAPI routes. Provides a database session that is automatically closed after use.

**Signature:**
```python
def get_db():
```

**Returns:**
- Generator that yields a SQLAlchemy database session

**Usage:**
```python
@router.get("/example")
def example_route(db: Session = Depends(get_db)):
    # Use db session here
    pass
```

**Behavior:**
- Creates a new database session using `SessionLocal`
- Logs session creation at DEBUG level
- Yields the session to the route handler
- Automatically closes the session in a finally block
- Logs session closure at DEBUG level

**Related Files:**
- `app/database.py` - Database configuration

---

### `init_db()`

Asynchronous function to initialize the database by creating all tables.

**Signature:**
```python
async def init_db():
```

**Returns:**
- None

**Behavior:**
- Creates all database tables defined in SQLAlchemy models
- Uses `Base.metadata.create_all()` with the database engine
- Logs table creation at INFO level

**Note:** This function is defined but not currently used in the lifespan context manager.

**Related Files:**
- `app/database.py` - Database engine and Base

---

### `shutdown_db()`

Asynchronous function to close database connections on application shutdown.

**Signature:**
```python
async def shutdown_db():
```

**Returns:**
- None

**Behavior:**
- Disposes of the database engine connection pool
- Logs connection closure at INFO level

**Note:** This function is defined but not currently used in the lifespan context manager.

**Related Files:**
- `app/database.py` - Database engine

---

### `create_db_and_tables()`

Synchronous function to create database tables. This is the function actually used in the application lifespan.

**Signature:**
```python
def create_db_and_tables():
```

**Returns:**
- None

**Behavior:**
- Creates all database tables synchronously
- Uses `Base.metadata.create_all()` with the database engine
- Logs table creation at INFO level

**Related Files:**
- `app/database.py` - Database engine and Base

---

### `is_path_in_current_script_dir(target_path)`

Checks if a given file path is within the same directory as the current Python script. Used for security validation before file operations.

**Signature:**
```python
def is_path_in_current_script_dir(target_path: str) -> bool:
```

**Parameters:**
- `target_path` (str): The file path to check

**Returns:**
- `bool`: `True` if the path is in the same directory as the script, `False` otherwise

**Behavior:**
- Gets the absolute path of the current script's directory
- Converts the target path to an absolute path
- Compares the parent directories
- Logs the check result at DEBUG level

**Example:**
```python
if is_path_in_current_script_dir("./config.json"):
    # Safe to write
    write_file("config.json", "data")
```

**Security Note:** This function helps prevent writing files outside the application directory, which is a security best practice.

---

### `write_file(filename, value, write_type)`

Writes content to a file, but only if the file is in the same directory as the script. This is a security measure to prevent writing to arbitrary locations.

**Signature:**
```python
def write_file(
    filename: str, 
    value: str = '', 
    write_type: Literal['w', 'a', 'x', 'wt'] = 'wt'
) -> None:
```

**Parameters:**
- `filename` (str): Name of the file to write
- `value` (str, optional): Content to write to the file. Default: `''`
- `write_type` (Literal['w', 'a', 'x', 'wt'], optional): File write mode. Default: `'wt'`

**Returns:**
- None

**Raises:**
- `RuntimeError`: If the file path is outside the current script directory

**Behavior:**
- Validates the file path using `is_path_in_current_script_dir()`
- Raises `RuntimeError` if path validation fails
- Opens the file in the specified mode
- Writes the value to the file
- Logs the file write operation at INFO level

**Example:**
```python
write_file("config.txt", "setting=value", "w")
```

**Security Note:** This function enforces that files can only be written within the application directory.

---

### `lifespan(app)`

Async context manager that handles application startup and shutdown lifecycle events.

**Signature:**
```python
@asynccontextmanager
async def lifespan(app: FastAPI):
```

**Parameters:**
- `app` (FastAPI): The FastAPI application instance

**Returns:**
- Async context manager

**Behavior:**
- **On Startup:**
  - Logs application startup at INFO level
  - Calls `create_db_and_tables()` to initialize the database
- **On Shutdown:**
  - Logs application shutdown at INFO level
  - Note: Database disposal is not currently called (see `shutdown_db()`)

**Usage:**
The lifespan context manager is passed to the FastAPI app constructor:
```python
app = FastAPI(lifespan=lifespan)
```

**Related Functions:**
- `create_db_and_tables()` - Called on startup
- `shutdown_db()` - Defined but not currently used

---

## Application Setup

### Logging Initialization

```python
setup_logging()
logger = logging.getLogger("app")
```

Logging is configured before the application starts. See `app/config/logging.py` for details.

### FastAPI Application

```python
app = FastAPI(lifespan=lifespan)
```

The FastAPI application is created with the lifespan context manager for startup/shutdown handling.

### Route Registration

```python
app.include_router(ollama_routes.router, prefix='/api/models')
app.include_router(chat_routes.router, prefix='/api/chat')
app.include_router(util_routes.router, prefix='/api/utils')
```

All API routes are registered with their respective prefixes:
- Model management: `/api/models/*`
- Chat functionality: `/api/chat/*`
- Utilities: `/api/utils/*`

## Related Files

- `app/database.py` - Database configuration
- `app/config/logging.py` - Logging setup
- `app/api/v1/ollama_routes.py` - Model routes
- `app/api/v1/chat_routes.py` - Chat routes
- `app/api/v1/util_routes.py` - Utility routes

## Notes

1. **Duplicate Functions:** There are duplicate definitions of `init_db()`, `shutdown_db()`, and `lifespan()` in the file. The second definitions override the first ones. The active implementation uses synchronous database operations.

2. **Security:** The `write_file()` function includes security checks to prevent writing files outside the application directory.

3. **Database Lifecycle:** The database is initialized synchronously on startup. The async `init_db()` and `shutdown_db()` functions are defined but not used.

4. **Logging:** All operations are logged at appropriate levels (DEBUG, INFO, ERROR) for observability.

