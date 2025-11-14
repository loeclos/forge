# Backend Documentation

## Overview

The Forge backend is a FastAPI-based REST API that provides AI chat functionality, model management, and agent services. It integrates with Ollama for local LLM inference and Tavily for internet search capabilities.

## Architecture

### Core Components

1. **FastAPI Application** (`app/main.py`)
   - Main application entry point
   - Route registration and middleware setup
   - Database lifecycle management

2. **API Routes** (`app/api/v1/`)
   - `ollama_routes.py`: Model management endpoints
   - `chat_routes.py`: Chat and conversation endpoints
   - `util_routes.py`: Utility endpoints

3. **Services** (`app/services/`)
   - `ollama_services.py`: Ollama client wrapper functions
   - `agno_services.py`: AI agent creation and management
   - `agent_service.py`: Agent service class (legacy)

4. **Tools** (`app/tools/`)
   - `search_internet.py`: Internet search tool for AI agents

5. **Configuration** (`app/core/` and `app/config/`)
   - `config.py`: Application settings and environment variables
   - `logging.py`: Logging configuration

6. **Database** (`app/database.py`)
   - SQLAlchemy setup and database configuration

## Technology Stack

- **FastAPI**: Web framework for building APIs
- **SQLAlchemy**: ORM for database operations
- **Ollama**: Python client for Ollama LLM service
- **Agno**: Agent framework for AI interactions
- **Tavily**: Internet search API client
- **SQLite**: Database for chat history and application data

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # Database configuration
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── ollama_routes.py    # Model management routes
│   │       ├── chat_routes.py      # Chat routes
│   │       └── util_routes.py      # Utility routes
│   ├── config/
│   │   ├── __init__.py
│   │   └── logging.py          # Logging setup
│   ├── core/
│   │   ├── config.py           # Application settings
│   │   └── instructions/
│   │       └── default_instructions.txt
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ollama_services.py # Ollama integration
│   │   ├── agno_services.py   # Agent creation
│   │   └── agent_service.py   # Agent service class
│   ├── tools/
│   │   ├── __init__.py
│   │   └── search_internet.py # Internet search tool
│   ├── db/                     # Database files
│   └── logs/                   # Application logs
└── requirements.txt           # Python dependencies
```

## Key Features

### Model Management
- List all available Ollama models
- Get current active model
- Change active model
- Download new models from Ollama
- Check Ollama service status

### Chat Functionality
- Send messages to AI agents
- Streaming and non-streaming responses
- Session-based conversation management
- Chat history persistence
- Tool execution with confirmation

### Agent Capabilities
- Internet search via Tavily API
- Context-aware conversations
- Tool integration
- Session management

## API Endpoints Summary

### Models (`/api/models`)
- `GET /all` - List all models
- `GET /current` - Get current model
- `POST /change` - Change model
- `POST /download/{model_name}` - Download model
- `GET /alive` - Check Ollama status

### Chat (`/api/chat`)
- `POST /` - Send chat message
- `POST /confirm-tool` - Confirm tool execution

### Utilities (`/api/utils`)
- `GET /getcwd` - Get current working directory

For detailed API documentation, see [API.md](../API.md).

## Configuration

### Environment Variables

Required environment variables (set in `.env` file):

- `TAVILY_API_KEY`: API key for Tavily internet search service

### Application Settings

Settings are configured in `app/core/config.py`:

- `APP_NAME`: Application name (default: "Sagaforge")
- `MODEL`: Default Ollama model (default: "qwen2.5:14b")
- `DATABASE_URL`: Database connection string
- `TAVILY_API_KEY`: Loaded from environment

## Database

The application uses SQLite databases:

- `app/db/database.db`: Main application database
- `app/db/chat_history.db`: Chat history database (managed by Agno)

Database tables are automatically created on application startup.

## Logging

Logging is configured in `app/config/logging.py`:

- Console output: INFO level and above
- File output: DEBUG level and above (JSON format)
- Log files: `app/logs/app.log`
- Log rotation: 5MB max size, 3 backup files
- Old log cleanup: Logs older than 3 days are automatically deleted

## Development

### Running the Server

**Development mode (with auto-reload):**
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Production mode:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### API Documentation

When the server is running, access interactive documentation:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### Testing

Test endpoints using curl or the interactive API docs:

```bash
# Check Ollama status
curl http://127.0.0.1:8000/api/models/alive

# Get all models
curl http://127.0.0.1:8000/api/models/all

# Send a chat message
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "stream": false}'
```

## File Documentation

Detailed documentation for each file:

- [main.py](main.py.md) - Application entry point and setup
- [database.py](database.py.md) - Database configuration
- [config.py](config.md) - Configuration management
- [api/v1/ollama_routes.md](api/v1/ollama_routes.md) - Model routes
- [api/v1/chat_routes.md](api/v1/chat_routes.md) - Chat routes
- [api/v1/util_routes.md](api/v1/util_routes.md) - Utility routes
- [services/ollama_services.md](services/ollama_services.md) - Ollama services
- [services/agno_services.md](services/agno_services.md) - Agent services
- [services/agent_service.md](services/agent_service.md) - Agent service class
- [tools/search_internet.md](tools/search_internet.md) - Search tool
- [config/logging.md](config/logging.md) - Logging configuration

## Dependencies

Key Python packages:

- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `sqlalchemy`: ORM
- `ollama`: Ollama Python client
- `agno`: Agent framework
- `tavily-python`: Tavily API client
- `pydantic-settings`: Settings management
- `python-dotenv`: Environment variable loading

See `requirements.txt` for complete list.

## Related Documentation

- [Installation Guide](../INSTALLATION.md)
- [API Reference](../API.md)
- [Frontend Documentation](../frontend/README.md)

