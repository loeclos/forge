# database.py Documentation

## File Overview

`database.py` configures the SQLAlchemy database connection and session management for the application. It sets up the database engine, session factory, and declarative base for ORM models.

**Location:** `backend/app/database.py`

## Imports

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
```

## Constants

### `SQLITE_FILE_NAME`

Path to the SQLite database file.

**Type:** `str`

**Value:** `"./db/database.db"`

**Note:** This is a relative path that resolves to `backend/app/db/database.db` when the application runs.

---

### `SQLALCHEMY_DATABASE_URL`

SQLAlchemy database connection URL.

**Type:** `str`

**Value:** `f"sqlite:///{SQLITE_FILE_NAME}"`

**Format:** SQLite connection string format: `sqlite:///<path>`

**Example:** `"sqlite:///./db/database.db"`

---

## Database Engine

### `engine`

SQLAlchemy database engine instance.

**Type:** `Engine`

**Creation:**
```python
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}  # Only for SQLite
)
```

**Configuration:**
- **URL:** Uses `SQLALCHEMY_DATABASE_URL` (SQLite)
- **`check_same_thread: False`:** Required for SQLite to allow connections from multiple threads. This is necessary for FastAPI's async nature.

**Usage:**
- Used by `Base.metadata.create_all()` to create tables
- Used by `SessionLocal` to create database sessions
- Can be used directly for raw SQL queries if needed

**Note:** The `check_same_thread=False` parameter is SQLite-specific and should not be used with other database backends.

---

## Session Factory

### `SessionLocal`

SQLAlchemy sessionmaker factory for creating database sessions.

**Type:** `sessionmaker`

**Creation:**
```python
SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine
)
```

**Configuration:**
- **`autocommit=False`:** Transactions must be explicitly committed
- **`autoflush=False`:** Changes are not automatically flushed to the database
- **`bind=engine`:** Uses the configured database engine

**Usage:**
```python
# In FastAPI routes (via dependency injection)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Direct usage
db = SessionLocal()
try:
    # Use db session
    pass
finally:
    db.close()
```

**Best Practice:** Always close sessions after use to prevent connection leaks.

---

## Declarative Base

### `Base`

SQLAlchemy declarative base class for defining ORM models.

**Type:** `DeclarativeMeta`

**Creation:**
```python
Base = declarative_base()
```

**Usage:**
```python
from app.database import Base
from sqlalchemy import Column, Integer, String

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
```

**Table Creation:**
```python
# Create all tables defined by models
Base.metadata.create_all(bind=engine)
```

**Note:** Currently, the application doesn't define custom models in this file. Models would be defined in separate files and imported where needed.

---

## Database File Location

The database file is created at:
```
backend/app/db/database.db
```

**Important:** Ensure the `db` directory exists before running the application. The directory is typically created automatically, but you can create it manually:

```bash
mkdir -p backend/app/db
```

---

## Usage Examples

### Creating Tables

```python
from app.database import Base, engine

# Create all tables
Base.metadata.create_all(bind=engine)
```

### Using Sessions in Routes

```python
from fastapi import Depends
from app.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/items")
def get_items(db: Session = Depends(get_db)):
    # Use db session
    items = db.query(Item).all()
    return items
```

### Direct Session Usage

```python
from app.database import SessionLocal

db = SessionLocal()
try:
    # Perform database operations
    result = db.query(SomeModel).all()
    db.commit()
except Exception:
    db.rollback()
    raise
finally:
    db.close()
```

---

## Related Files

- `app/main.py` - Uses `engine`, `Base`, and `SessionLocal` for application setup
- `app/services/agno_services.py` - Uses separate database for chat history

## Notes

1. **SQLite Specific:** The configuration is optimized for SQLite. For other databases (PostgreSQL, MySQL), the connection string and parameters would differ.

2. **Thread Safety:** The `check_same_thread=False` parameter allows SQLite to work with FastAPI's async/threading model.

3. **Multiple Databases:** The application uses a separate database (`chat_history.db`) for chat history managed by the Agno library. This is configured in `app/services/agno_services.py`.

4. **No Models Defined:** This file only provides the database infrastructure. Actual ORM models would be defined in separate model files.

5. **File Path:** The database file path is relative to the application's working directory when the app runs.

