# util_routes.py Documentation

## File Overview

Utility API routes providing helper endpoints for the application.

**Location:** `backend/app/api/v1/util_routes.py`

## Imports

```python
from fastapi import APIRouter, HTTPException
import os
import logging
```

## Router

### `router`

FastAPI router instance for utility routes.

**Type:** `APIRouter`

**Registration:** Registered in `app/main.py` with prefix `/api/utils`

---

## Functions

### `get_current_folder()`

Retrieves the current working directory of the backend server process.

**Endpoint:** `GET /api/utils/getcwd`

**Returns:**
- `dict`: Dictionary containing the current directory path
- `HTTPException`: If directory retrieval fails

**Response Format:**
```json
{
  "dir": "/path/to/backend/app"
}
```

**Status Codes:**
- `200 OK`: Successfully retrieved directory
- `500 Internal Server Error`: Failed to retrieve directory

**Behavior:**
- Calls `os.getcwd()` to get current working directory
- Logs the retrieved directory at INFO level
- Returns directory in JSON format
- Catches any exceptions and logs error
- Raises HTTPException with error details on failure

**Example Request:**
```bash
curl http://127.0.0.1:8000/api/utils/getcwd
```

**Example Response:**
```json
{
  "dir": "F:\\Desktop\\Projects\\forge\\backend\\app"
}
```

**Use Case:**
This endpoint is used by the frontend to display the current working directory to the user, typically shown in a security prompt asking if they trust files in that directory.

**Related Functions:**
- `os.getcwd()` - Python standard library function

---

## Error Handling

### General Exceptions

Any exception during directory retrieval.

**Response:**
```json
{
  "detail": "Failed to retrieve current directory. Error: <error message>"
}
```

**Status Code:** `500 Internal Server Error`

**Behavior:**
- Logs the error at ERROR level
- Raises HTTPException with descriptive error message
- Includes the original error message in the response

---

## Related Files

- `app/main.py` - Router registration
- `frontend/source/commands/app.tsx` - Frontend component that uses this endpoint

## Notes

1. **Security Consideration:** This endpoint exposes the server's current working directory. In production, consider if this information should be restricted.

2. **Use Case:** Primarily used by the frontend security question component to show users which directory the application is operating in.

3. **Error Handling:** Comprehensive error handling ensures the API always returns a proper response, even if directory retrieval fails.

4. **Logging:** All operations are logged for debugging and monitoring purposes.

5. **Simple Endpoint:** This is a straightforward utility endpoint with minimal complexity, serving as a helper for the frontend application.

