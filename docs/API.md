# API Reference

Complete API documentation for the Forge backend application.

## Base URL

```
http://127.0.0.1:8000
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## API Endpoints

### Models Endpoints

Base path: `/api/models`

#### Get All Models

Retrieve a list of all available Ollama models installed on the system.

**Endpoint:** `GET /api/models/all`

**Response:**
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

**Example:**
```bash
curl http://127.0.0.1:8000/api/models/all
```

---

#### Get Current Model

Get the currently active model configured in the application.

**Endpoint:** `GET /api/models/current`

**Response:**
```json
{
  "name": "qwen2.5:14b"
}
```

**Status Codes:**
- `200 OK`: Successfully retrieved current model

**Example:**
```bash
curl http://127.0.0.1:8000/api/models/current
```

---

#### Change Current Model

Change the active model to a different installed model.

**Endpoint:** `POST /api/models/change`

**Request Body:**
```json
{
  "model_name": "llama2:7b"
}
```

**Response:**
```json
{
  "message": "Success! model set to llama2:7b"
}
```

**Status Codes:**
- `200 OK`: Model successfully changed
- `404 Not Found`: Model not found among installed models
- `500 Internal Server Error`: Ollama not installed or not running

**Example:**
```bash
curl -X POST http://127.0.0.1:8000/api/models/change \
  -H "Content-Type: application/json" \
  -d '{"model_name": "llama2:7b"}'
```

---

#### Download Model

Download a new model from Ollama servers. Returns a streaming response with download progress.

**Endpoint:** `POST /api/models/download/{model_name}`

**Path Parameters:**
- `model_name` (string): Name of the model to download (e.g., "qwen2.5:14b")

**Response:** Server-Sent Events (SSE) stream

**Stream Format:**
```
data: {"completed": 100, "total": 1000}

data: {"completed": 200, "total": 1000}

...
```

**Status Codes:**
- `200 OK`: Download started successfully
- `500 Internal Server Error`: 
  - Ollama not installed or not running
  - Model does not exist on Ollama servers

**Example:**
```bash
curl -X POST http://127.0.0.1:8000/api/models/download/qwen2.5:14b
```

**Note:** This endpoint streams progress updates. The download happens asynchronously.

---

#### Check Ollama Status

Check if Ollama is running and accessible.

**Endpoint:** `GET /api/models/alive`

**Response:**
```json
true
```
or
```json
false
```

**Status Codes:**
- `200 OK`: Always returns (true or false)

**Example:**
```bash
curl http://127.0.0.1:8000/api/models/alive
```

---

### Chat Endpoints

Base path: `/api/chat`

#### Send Chat Message

Send a message to the AI agent and receive a response. Supports both streaming and non-streaming modes.

**Endpoint:** `POST /api/chat`

**Request Body:**
```json
{
  "message": "What is the capital of France?",
  "session_id": "session_12345",
  "stream": true
}
```

**Request Parameters:**
- `message` (string, required): The user's message
- `session_id` (string, optional): Session ID for maintaining conversation context. If not provided, a new session ID will be generated.
- `stream` (boolean, optional): Whether to stream the response. Default: `false`

**Non-Streaming Response:**
```json
{
  "response": "The capital of France is Paris.",
  "session_id": "session_12345"
}
```

**Streaming Response:** Server-Sent Events (SSE) stream

**Stream Format:**
```
data: {"content": "The", "type": "RunResponse", "tool_calls": [], "session_id": "session_12345", "tool_requiring_confirmation": null}

data: {"content": " capital", "type": "RunResponse", "tool_calls": [], "session_id": "session_12345", "tool_requiring_confirmation": null}

data: {"content": " of", "type": "RunResponse", "tool_calls": [], "session_id": "session_12345", "tool_requiring_confirmation": null}

...

data: [DONE]
```

**Stream Response Fields:**
- `content` (string): Text chunk from the AI response
- `type` (string): Type of response chunk
- `tool_calls` (array): Array of tool calls made by the agent
- `session_id` (string): Session ID for this conversation
- `tool_requiring_confirmation` (object|null): Tool that requires user confirmation before execution

**Tool Requiring Confirmation Format:**
```json
{
  "tool_name": "search_internet",
  "tool_id": "uuid-here",
  "session_id": "session_12345",
  "confirmed": false
}
```

**Status Codes:**
- `200 OK`: Request processed successfully
- `500 Internal Server Error`: 
  - Ollama not installed or not running
  - Error processing request

**Example (Non-Streaming):**
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?", "stream": false}'
```

**Example (Streaming):**
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?", "stream": true}'
```

---

#### Confirm Tool Execution

Confirm or deny execution of a tool that requires user confirmation.

**Endpoint:** `POST /api/chat/confirm-tool`

**Request Body:**
```json
{
  "tool_id": "uuid-here",
  "session_id": "session_12345",
  "confirmed": true
}
```

**Request Parameters:**
- `tool_id` (string, required): ID of the tool requiring confirmation
- `session_id` (string, required): Session ID for the conversation
- `confirmed` (boolean, required): Whether to confirm tool execution

**Response:**
Currently returns empty response (endpoint is a placeholder).

**Status Codes:**
- `200 OK`: Request processed

**Note:** This endpoint is currently a placeholder and does not perform any action.

---

### Utility Endpoints

Base path: `/api/utils`

#### Get Current Working Directory

Get the current working directory of the backend server.

**Endpoint:** `GET /api/utils/getcwd`

**Response:**
```json
{
  "dir": "/path/to/backend/app"
}
```

**Status Codes:**
- `200 OK`: Successfully retrieved directory
- `500 Internal Server Error`: Failed to retrieve directory

**Example:**
```bash
curl http://127.0.0.1:8000/api/utils/getcwd
```

---

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Error Codes

- `404 Not Found`: Resource not found (e.g., model not found)
- `500 Internal Server Error`: Server error (e.g., Ollama connection issues, processing errors)

### Error Examples

**Model Not Found:**
```json
{
  "detail": "The model you are trying to set as default was not found installed. Maybe pull it from ollama?"
}
```

**Ollama Not Running:**
```json
{
  "detail": "Ollama either not installed or not running."
}
```

**Processing Error:**
```json
{
  "detail": "Error processing request: <error details>"
}
```

---

## Streaming Responses

### Server-Sent Events (SSE)

Several endpoints return streaming responses using Server-Sent Events (SSE) format:

1. **Model Download** (`POST /api/models/download/{model_name}`)
2. **Chat Messages** (`POST /api/chat` with `stream: true`)

### SSE Format

Each event follows this format:
```
data: <JSON_OBJECT>

```

Events are separated by double newlines (`\n\n`).

### End of Stream

Streaming responses end with:
```
data: [DONE]

```

### Parsing SSE in JavaScript

```javascript
const response = await fetch('http://127.0.0.1:8000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello', stream: true })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n\n');
  
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (line.startsWith('data: ')) {
      const data = line.replace('data: ', '');
      if (data === '[DONE]') {
        // Stream ended
        break;
      }
      const json = JSON.parse(data);
      // Process json chunk
    }
  }
  
  buffer = lines[lines.length - 1];
}
```

---

## Rate Limiting

Currently, there are no rate limits imposed on the API. However, be mindful of:

- Model inference can be resource-intensive
- Internet search operations consume API credits
- Database operations may be affected by high load

---

## CORS

The API does not currently implement CORS restrictions. For production deployments, consider adding appropriate CORS headers.

---

## Interactive API Documentation

When the backend is running, interactive API documentation is available at:

- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

These interfaces allow you to:
- Browse all available endpoints
- Test endpoints directly from the browser
- View request/response schemas
- See example requests and responses

---

## Related Documentation

- [Installation Guide](INSTALLATION.md) - Setup instructions
- [Backend Documentation](backend/README.md) - Backend architecture
- [Frontend Documentation](frontend/README.md) - Frontend implementation

