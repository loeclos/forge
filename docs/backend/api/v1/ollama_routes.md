# ollama_routes.py Documentation

## File Overview

API routes for managing Ollama models. Provides endpoints to list models, get the current model, change models, download new models, and check Ollama service status.

**Location:** `backend/app/api/v1/ollama_routes.py`

## Imports

```python
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import ollama
from app.services.ollama_services import get_all_models
from pydantic import BaseModel
from app.core.config import settings
import json
import logging
```

## Router

### `router`

FastAPI router instance for model management routes.

**Type:** `APIRouter`

**Registration:** Registered in `app/main.py` with prefix `/api/models`

---

## Request Models

### `ChangeModelRequest`

Pydantic model for change model requests.

**Fields:**
- `model_name` (str): Name of the model to set as current

**Usage:**
```python
request = ChangeModelRequest(model_name="llama2:7b")
```

---

## Functions

### `download_model(model_name)`

Generator function that yields Server-Sent Events (SSE) formatted data for model download progress.

**Signature:**
```python
def download_model(model_name: str):
```

**Parameters:**
- `model_name` (str): Name of the model to download

**Yields:**
- `str`: SSE-formatted string with download progress data

**Format:**
```
data: {"completed": 100, "total": 1000}\n\n
```

**Behavior:**
- Calls `ollama.pull()` with streaming enabled
- Iterates over download progress updates
- Formats each progress update as JSON
- Yields SSE-formatted strings
- Logs progress at DEBUG level

**Example:**
```python
for chunk in download_model("qwen2.5:14b"):
    # Process SSE chunk
    print(chunk)
```

**Related Functions:**
- `download_new_model()` - Endpoint that uses this generator

---

### `download_new_model(model_name)`

Downloads a model from Ollama servers with streaming progress updates.

**Endpoint:** `POST /api/models/download/{model_name}`

**Path Parameters:**
- `model_name` (str): Name of the model to download

**Returns:**
- `StreamingResponse`: SSE stream with download progress
- `HTTPException`: If Ollama is not running or model doesn't exist

**Response Format:**
Server-Sent Events stream:
```
data: {"completed": 100, "total": 1000}\n\n
data: {"completed": 200, "total": 1000}\n\n
...
```

**Status Codes:**
- `200 OK`: Download started successfully
- `500 Internal Server Error`: 
  - Ollama not installed or not running
  - Model does not exist on Ollama servers

**Behavior:**
- Logs download attempt at INFO level
- Creates a StreamingResponse using `download_model()` generator
- Sets media type to `application/json`
- Handles `ConnectionError` from Ollama
- Handles `ollama.ResponseError` for non-existent models

**Example Request:**
```bash
curl -X POST http://127.0.0.1:8000/api/models/download/qwen2.5:14b
```

**Related Functions:**
- `download_model()` - Generator that provides progress updates

---

### `get_models()`

Retrieves a list of all available Ollama models installed on the system.

**Endpoint:** `GET /api/models/all`

**Returns:**
- `list[dict]`: List of model dictionaries
- `HTTPException`: If Ollama is not running

**Response Format:**
```json
[
  {
    "name": "qwen2.5:14b",
    "size": 10000000000,
    "param_size": "14B"
  },
  {
    "name": "llama2:7b",
    "size": 5000000000,
    "param_size": "7B"
  }
]
```

**Status Codes:**
- `200 OK`: Successfully retrieved models
- `500 Internal Server Error`: Ollama not installed or not running

**Behavior:**
- Logs fetch attempt at INFO level
- Calls `get_all_models()` service function
- Formats model data into dictionaries with:
  - `name`: Model name
  - `size`: Model size in bytes
  - `param_size`: Parameter size (e.g., "14B")
- Logs each found model at DEBUG level
- Returns formatted list
- Handles `ConnectionError` from Ollama

**Example Request:**
```bash
curl http://127.0.0.1:8000/api/models/all
```

**Related Functions:**
- `get_all_models()` - Service function in `ollama_services.py`

---

### `get_current_model()`

Gets the currently active model from application settings.

**Endpoint:** `GET /api/models/current`

**Returns:**
- `dict`: Dictionary with current model name

**Response Format:**
```json
{
  "name": "qwen2.5:14b"
}
```

**Status Codes:**
- `200 OK`: Always returns successfully

**Behavior:**
- Logs current model at INFO level
- Reads model from `settings.MODEL`
- Returns formatted dictionary

**Example Request:**
```bash
curl http://127.0.0.1:8000/api/models/current
```

**Related Files:**
- `app/core/config.py` - Settings configuration

---

### `check_ollama_running()`

Checks if Ollama service is running and accessible.

**Endpoint:** `GET /api/models/alive`

**Returns:**
- `bool`: `True` if Ollama is running, `False` otherwise

**Status Codes:**
- `200 OK`: Always returns (true or false)

**Behavior:**
- Attempts to call `ollama.ps()` to check service status
- Returns `True` if successful
- Returns `False` if `ConnectionError` is raised
- Logs status at INFO or ERROR level

**Example Request:**
```bash
curl http://127.0.0.1:8000/api/models/alive
```

**Example Response:**
```json
true
```

**Related Functions:**
- `ollama.ps()` - Ollama Python client function

---

### `change_current_model(new_model)`

Changes the active model in application settings to a different installed model.

**Endpoint:** `POST /api/models/change`

**Request Body:**
```json
{
  "model_name": "llama2:7b"
}
```

**Parameters:**
- `new_model` (ChangeModelRequest): Request containing the model name

**Returns:**
- `dict`: Success message
- `HTTPException`: If model not found or Ollama not running

**Response Format:**
```json
{
  "message": "Success! model set to llama2:7b"
}
```

**Status Codes:**
- `200 OK`: Model successfully changed
- `404 Not Found`: Model not found among installed models
- `500 Internal Server Error`: Ollama not installed or not running

**Behavior:**
- Logs change attempt at INFO level
- Gets list of all installed models
- Searches for the requested model in the list
- If found, updates `settings.MODEL`
- Logs successful change at INFO level
- Returns success message
- If not found, logs warning and returns 404
- Handles `ConnectionError` from Ollama

**Note:** There's a bug in the current implementation - it accesses `all_models['models']` but `get_all_models()` returns a different structure. This should be fixed.

**Example Request:**
```bash
curl -X POST http://127.0.0.1:8000/api/models/change \
  -H "Content-Type: application/json" \
  -d '{"model_name": "llama2:7b"}'
```

**Related Functions:**
- `get_all_models()` - Service function to get model list
- `settings.MODEL` - Configuration setting to update

---

## Error Handling

All endpoints handle the following errors:

### ConnectionError

Raised when Ollama is not installed or not running.

**Response:**
```json
{
  "detail": "Ollama either not installed or not running."
}
```

**Status Code:** `500 Internal Server Error`

### ollama.ResponseError

Raised when a requested model doesn't exist on Ollama servers.

**Response:**
```json
{
  "detail": "The model you tried to download does not exist."
}
```

**Status Code:** `500 Internal Server Error`

---

## Related Files

- `app/services/ollama_services.py` - Ollama service functions
- `app/core/config.py` - Application settings
- `app/main.py` - Router registration

## Notes

1. **Streaming Responses:** The download endpoint uses Server-Sent Events (SSE) for real-time progress updates.

2. **Model Validation:** The change model endpoint validates that the model exists before changing settings.

3. **Error Handling:** All endpoints properly handle Ollama connection errors and provide user-friendly error messages.

4. **Logging:** All operations are logged at appropriate levels for debugging and monitoring.

5. **Bug Note:** The `change_current_model()` function has a potential bug where it accesses `all_models['models']` but `get_all_models()` may return a different structure. This should be verified and fixed.

