# agno_services.py Documentation

## File Overview

Service functions for creating and managing AI agents using the Agno framework. Handles agent creation with Ollama models, tools, and database configuration.

**Location:** `backend/app/services/agno_services.py`

## Imports

```python
from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.db.sqlite import SqliteDb
from app.core.config import settings
from app.tools.search_internet import search_internet
import logging
```

## Functions

### `create_agent(session_id)`

Creates a new AI agent instance configured with Ollama model, tools, and database for chat history.

**Signature:**
```python
def create_agent(session_id: str) -> Agent:
```

**Parameters:**
- `session_id` (str): Unique session identifier for maintaining conversation context

**Returns:**
- `Agent`: Configured Agno agent instance

**Behavior:**
- Creates an `Agent` instance with the following configuration:
  - **Model:** Uses `Ollama(settings.MODEL)` - the model from application settings
  - **Session ID:** Uses the provided `session_id` for conversation context
  - **Tools:** Includes `search_internet` tool for internet search capabilities
  - **Database:** SQLite database at `./db/chat_history.db` for storing chat history
  - **History:** Enabled with `add_history_to_context=True`
  - **History Count:** Uses last 5 conversation runs (`num_history_runs=5`)
- Logs agent creation at INFO level
- Returns the configured agent

**Configuration Details:**

1. **Model:**
   ```python
   model=Ollama(settings.MODEL)
   ```
   - Uses the default model from application settings
   - Can be changed via `/api/models/change` endpoint

2. **Session Management:**
   ```python
   session_id=session_id
   ```
   - Each session gets its own agent instance
   - Maintains separate conversation contexts

3. **Tools:**
   ```python
   tools=[search_internet]
   ```
   - Currently includes only the internet search tool
   - Tools can require user confirmation before execution

4. **Database:**
   ```python
   db=SqliteDb(db_file="./db/chat_history.db")
   ```
   - Stores chat history in SQLite database
   - Separate from main application database
   - Located at `backend/app/db/chat_history.db`

5. **History Configuration:**
   ```python
   add_history_to_context=True,
   num_history_runs=5
   ```
   - Includes conversation history in context
   - Uses last 5 conversation exchanges
   - Helps maintain conversation continuity

**Usage:**
```python
from app.services.agno_services import create_agent

# Create agent for a session
session_id = "session_12345"
agent = create_agent(session_id)

# Use agent to process messages
response = await agent.arun("Hello, how are you?", stream=False)
```

**Example in Route:**
```python
# In chat_routes.py
session_id = request.session_id or generate_session_id()
agent = create_agent(session_id)
response = await agent.arun(request.message, stream=True)
```

**Logging:**
- Logs agent creation at INFO level with session_id
- Helps track agent lifecycle for debugging

**Related Files:**
- `app/core/config.py` - Provides `settings.MODEL`
- `app/tools/search_internet.py` - Provides search tool
- `app/api/v1/chat_routes.py` - Uses this function

---

## Agent Configuration

### Model Selection

The agent uses the model specified in `settings.MODEL`. This can be:
- Changed at runtime via the API
- Different for each application instance
- Any model installed in Ollama

### Tool Integration

The agent includes the `search_internet` tool which:
- Requires user confirmation before execution
- Uses Tavily API for internet searches
- Returns structured search results

### Database Storage

Chat history is stored in:
- **File:** `backend/app/db/chat_history.db`
- **Format:** SQLite database managed by Agno
- **Content:** Conversation history for each session

### History Context

The agent maintains conversation context by:
- Including last 5 conversation runs in context
- Storing history in database
- Loading relevant history for each session

---

## Related Files

- `app/core/config.py` - Application settings
- `app/tools/search_internet.py` - Internet search tool
- `app/api/v1/chat_routes.py` - Chat endpoint that uses agents
- `app/services/agent_service.py` - Alternative agent service (legacy)

## Notes

1. **Session-Based:** Each session gets its own agent instance, allowing independent conversations.

2. **Tool Confirmation:** Tools can require confirmation, but the confirmation flow is partially implemented.

3. **History Management:** Chat history is automatically managed by Agno and stored in SQLite.

4. **Model Configuration:** The model is read from settings at agent creation time. Changing settings.MODEL after agent creation won't affect existing agents.

5. **Database Location:** The chat history database is separate from the main application database.

6. **Instructions:** The agent instructions are commented out in the code. Default instructions from Agno are used.

7. **Error Handling:** Agent creation doesn't explicitly handle errors. Errors from Agno or Ollama will propagate to the caller.

