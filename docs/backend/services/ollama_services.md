# ollama_services.py Documentation

## File Overview

Service functions for interacting with the Ollama Python client. Provides wrapper functions for common Ollama operations.

**Location:** `backend/app/services/ollama_services.py`

## Imports

```python
import ollama
```

## Functions

### `check_ollama_running()`

Checks if the Ollama service is running and accessible by attempting to list running processes.

**Signature:**
```python
def check_ollama_running() -> bool:
```

**Returns:**
- `bool`: `True` if Ollama is running and accessible, `False` otherwise

**Behavior:**
- Calls `ollama.ps()` to check if Ollama service is responding
- Returns `True` if the call succeeds
- Returns `False` if a `ConnectionError` is raised
- Does not log errors (caller should handle logging)

**Raises:**
- Does not raise exceptions; returns `False` on connection errors

**Usage:**
```python
from app.services.ollama_services import check_ollama_running

if check_ollama_running():
    print("Ollama is running")
else:
    print("Ollama is not running")
```

**Example:**
```python
# In a route handler
if not check_ollama_running():
    raise HTTPException(
        status_code=500, 
        detail="Ollama either not installed or not running."
    )
```

**Related Functions:**
- `ollama.ps()` - Ollama Python client function

**Used By:**
- `app/api/v1/chat_routes.py` - Before processing chat requests
- `app/api/v1/ollama_routes.py` - For status endpoint

---

### `get_all_models()`

Retrieves a list of all models installed in Ollama.

**Signature:**
```python
def get_all_models():
```

**Returns:**
- `ollama.ListResponse`: Response object containing list of models

**Raises:**
- `ConnectionError`: If Ollama is not installed or not running

**Behavior:**
- Calls `ollama.list()` to get all installed models
- Returns the response object directly
- Raises `ConnectionError` if Ollama is not accessible
- Does not format or transform the response

**Response Structure:**
The returned object has a `models` attribute containing a list of model objects. Each model object has:
- `model` (str): Model name
- `size` (int): Model size in bytes
- `details.parameter_size` (str): Parameter size (e.g., "14B")

**Usage:**
```python
from app.services.ollama_services import get_all_models

try:
    models_response = get_all_models()
    for model in models_response.models:
        print(f"Model: {model.model}, Size: {model.size}")
except ConnectionError:
    print("Ollama is not running")
```

**Example in Route:**
```python
models_list = get_all_models()
for model in models_list.models:
    formatted_models_list.append({
        'name': model.model,
        'size': model.size,
        'param_size': model.details.parameter_size
    })
```

**Related Functions:**
- `ollama.list()` - Ollama Python client function

**Used By:**
- `app/api/v1/ollama_routes.py` - For listing models and changing models

---

## Error Handling

### ConnectionError

Both functions may encounter `ConnectionError` when:
- Ollama is not installed
- Ollama service is not running
- Ollama service is not accessible on the default port

**Handling:**
- `check_ollama_running()`: Returns `False` (does not raise)
- `get_all_models()`: Raises `ConnectionError` (caller must handle)

---

## Related Files

- `app/api/v1/ollama_routes.py` - Uses these service functions
- `app/api/v1/chat_routes.py` - Uses `check_ollama_running()`

## Notes

1. **Simple Wrappers:** These functions are thin wrappers around the Ollama Python client, providing a consistent interface for the application.

2. **Error Handling:** `check_ollama_running()` handles errors gracefully by returning `False`, while `get_all_models()` propagates errors for the caller to handle.

3. **No Logging:** These service functions do not perform logging. Logging should be done in the calling code (routes).

4. **Direct Returns:** `get_all_models()` returns the raw Ollama response object, allowing callers to access all response properties.

5. **Connection Checking:** `check_ollama_running()` is a lightweight check that doesn't require authentication or complex setup.

6. **Ollama Client:** These functions rely on the `ollama` Python package, which must be installed and configured to connect to the Ollama service.

