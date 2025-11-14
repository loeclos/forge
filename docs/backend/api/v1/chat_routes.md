# chat_routes.py Documentation

## File Overview

API routes for chat functionality. Handles sending messages to AI agents, managing chat sessions, and processing streaming responses.

**Location:** `backend/app/api/v1/chat_routes.py`

## Imports

```python
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from uuid import uuid4
from pydantic import BaseModel
from app.services.ollama_services import check_ollama_running
from app.services.agno_services import create_agent
import asyncio
import json
```

## Router

### `router`

FastAPI router instance for chat routes.

**Type:** `APIRouter`

**Registration:** Registered in `app/main.py` with prefix `/api/chat`

---

## Global Variables

### `tool_requiring_confirm`

Global variable to store tool confirmation requests.

**Type:** `dict | None`

**Current State:** Defined but not fully implemented

**Note:** This appears to be a work-in-progress feature for tool confirmation.

---

## Request Models

### `ChatRequest`

Pydantic model for chat message requests.

**Fields:**
- `message` (str, required): The user's message to send to the AI
- `session_id` (str | None, optional): Session ID for conversation context. If not provided, a new session ID is generated.
- `stream` (bool, optional): Whether to stream the response. Default: `False`

**Example:**
```python
request = ChatRequest(
    message="What is Python?",
    session_id="session_12345",
    stream=True
)
```

---

### `ConfirmToolRequest`

Pydantic model for tool confirmation requests.

**Fields:**
- `tool_id` (str): Unique identifier for the tool requiring confirmation
- `session_id` (str): Session ID for the conversation
- `confirmed` (bool): Whether the user confirmed tool execution

**Example:**
```python
request = ConfirmToolRequest(
    tool_id="uuid-here",
    session_id="session_12345",
    confirmed=True
)
```

---

## Functions

### `confirm_tool(request)`

Placeholder endpoint for confirming tool execution. Currently does nothing.

**Endpoint:** `POST /api/chat/confirm-tool`

**Parameters:**
- `request` (ConfirmToolRequest): Tool confirmation request

**Returns:**
- `None`: Currently just passes (placeholder)

**Status Codes:**
- `200 OK`: Always returns (no action taken)

**Note:** This endpoint is a placeholder and does not perform any action. Tool confirmation functionality is not yet fully implemented.

**Example Request:**
```bash
curl -X POST http://127.0.0.1:8000/api/chat/confirm-tool \
  -H "Content-Type: application/json" \
  -d '{"tool_id": "uuid", "session_id": "session_123", "confirmed": true}'
```

---

### `chat(request)`

Main chat endpoint. Sends a message to an AI agent and returns a response, with support for both streaming and non-streaming modes.

**Endpoint:** `POST /api/chat`

**Parameters:**
- `request` (ChatRequest): Chat request with message and options

**Returns:**
- **Non-streaming:** `dict` with response and session_id
- **Streaming:** `StreamingResponse` with Server-Sent Events

**Non-Streaming Response Format:**
```json
{
  "response": "The AI's complete response text.",
  "session_id": "session_12345"
}
```

**Streaming Response Format:**
Server-Sent Events stream:
```
data: {"content": "Hello", "type": "RunResponse", "tool_calls": [], "session_id": "session_12345", "tool_requiring_confirmation": null}\n\n
data: {"content": " there", "type": "RunResponse", "tool_calls": [], "session_id": "session_12345", "tool_requiring_confirmation": null}\n\n
...
data: [DONE]\n\n
```

**Status Codes:**
- `200 OK`: Request processed successfully
- `500 Internal Server Error`: 
  - Ollama not installed or not running
  - Error processing request

**Behavior:**

1. **Session Management:**
   - Generates a new session ID if not provided
   - Uses `hash(str(asyncio.get_event_loop().time()))` for session ID generation
   - Format: `"session_{hash}"`

2. **Agent Creation:**
   - Creates a new agent for the session using `create_agent(session_id)`
   - Each session gets its own agent instance

3. **Ollama Check:**
   - Verifies Ollama is running before processing
   - Raises HTTPException if Ollama is not available

4. **Non-Streaming Mode:**
   - Calls `agent.arun(request.message, stream=False)`
   - Returns complete response in JSON format
   - Includes session_id in response

5. **Streaming Mode:**
   - Uses `stream_generator()` async generator
   - Calls `agent.arun(request.message, stream=True)`
   - Yields chunks as they're generated
   - Handles tool confirmation requests
   - Sends `[DONE]` when complete

6. **Error Handling:**
   - Catches `ConnectionError` for Ollama issues
   - Catches general exceptions and returns error details
   - Logs errors appropriately

**Stream Generator Details:**

The `stream_generator()` function (defined inside `chat()`):
- Iterates over streamed `RunResponse` chunks
- Handles paused states when tools require confirmation
- Extracts tool calls from chunks
- Formats each chunk as JSON
- Yields SSE-formatted strings
- Handles errors gracefully

**Tool Confirmation Handling:**
- Detects when agent is paused (`chunk.is_paused`)
- Extracts tools requiring confirmation
- Generates UUID for tool confirmation
- Includes tool info in stream response
- Sets `tool_requiring_confirmation` to `None` when not paused

**Example Request (Non-Streaming):**
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?", "stream": false}'
```

**Example Request (Streaming):**
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?", "stream": true}'
```

**Related Functions:**
- `create_agent()` - Creates agent instance
- `check_ollama_running()` - Verifies Ollama availability

---

## Response Format Details

### Streaming Chunk Structure

Each streaming chunk contains:

```json
{
  "content": "Text chunk from AI",
  "type": "RunResponse",
  "tool_calls": [
    {
      "tool_name": "search_internet",
      "arguments": {...}
    }
  ],
  "session_id": "session_12345",
  "tool_requiring_confirmation": {
    "tool_name": "search_internet",
    "tool_id": "uuid-here",
    "session_id": "session_12345",
    "confirmed": false
  }
}
```

**Fields:**
- `content` (str): Text content chunk (may be empty string)
- `type` (str): Type of response chunk (e.g., "RunResponse")
- `tool_calls` (list): Array of tool calls made by the agent
- `session_id` (str): Session identifier
- `tool_requiring_confirmation` (object | null): Tool requiring user confirmation

### End of Stream

Streaming ends with:
```
data: [DONE]\n\n
```

### Error in Stream

If an error occurs during streaming:
```
data: {"error": "Error message", "session_id": "session_12345"}\n\n
```

---

## Error Handling

### ConnectionError

Raised when Ollama is not running.

**Response:**
```json
{
  "detail": "Ollama either not installed or not running."
}
```

**Status Code:** `500 Internal Server Error`

### General Exceptions

Any other exception during processing.

**Response:**
```json
{
  "detail": "Error processing request: <error details>"
}
```

**Status Code:** `500 Internal Server Error`

---

## Related Files

- `app/services/agno_services.py` - Agent creation
- `app/services/ollama_services.py` - Ollama status checking
- `app/tools/search_internet.py` - Internet search tool

## Notes

1. **Session Management:** Each chat request can use an existing session or create a new one. Sessions maintain conversation context.

2. **Streaming:** Streaming mode provides real-time response updates, improving user experience for long responses.

3. **Tool Confirmation:** The tool confirmation feature is partially implemented. Tools can request confirmation, but the confirmation endpoint doesn't yet process confirmations.

4. **Agent Per Session:** Each session gets its own agent instance, allowing independent conversation contexts.

5. **Error Recovery:** Errors in streaming are sent as error chunks, allowing the client to handle them gracefully.

6. **Session ID Generation:** The session ID generation uses a hash of the event loop time, which may not be ideal for production. Consider using UUID instead.

