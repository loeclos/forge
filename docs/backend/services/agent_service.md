# agent_service.py Documentation

## File Overview

Legacy agent service class providing an alternative way to create AI agents. This appears to be an older implementation that may not be actively used.

**Location:** `backend/app/services/agent_service.py`

## Imports

```python
from agno.agent import Agent 
from agno.models.ollama import Ollama
from app.core.config import Settings
from textwrap import dedent
import ollama
```

## Classes

### `AgentService`

Service class for creating AI agents. Provides a static method for agent creation.

**Definition:**
```python
class AgentService:
    @staticmethod
    def create_agent(model: str = Settings().MODEL, instructions: str = 'You are a helpful assistant.'):
        # Implementation
```

---

## Methods

### `AgentService.create_agent(model, instructions)`

Static method to create an AI agent with custom model and instructions.

**Signature:**
```python
@staticmethod
def create_agent(
    model: str = Settings().MODEL, 
    instructions: str = 'You are a helpful assistant.'
) -> Agent | dict:
```

**Parameters:**
- `model` (str, optional): Ollama model to use. Default: `Settings().MODEL`
- `instructions` (str, optional): System instructions for the agent. Default: `'You are a helpful assistant.'`

**Returns:**
- `Agent`: Configured Agno agent instance on success
- `dict`: Error dictionary on failure: `{'error': 'error message'}`

**Behavior:**
- Creates a new `Settings()` instance to get default model
- Creates an `Agent` with:
  - Model: `Ollama(id=f'{model}')` - Uses the specified model
  - Instructions: Uses `dedent()` to format the instructions string
  - Markdown: Disabled (`markdown=False`)
- Handles `ollama.ResponseError` if model doesn't exist
- Returns error dictionary on failure
- Returns agent instance on success

**Error Handling:**
- Catches `ollama.ResponseError` when model doesn't exist
- Returns `{'error': 'Failed to create an agent. You most likely provided a wrong model name.'}`

**Usage:**
```python
from app.services.agent_service import AgentService

# Create agent with default settings
agent = AgentService.create_agent()

# Create agent with custom model
agent = AgentService.create_agent(model="llama2:7b")

# Create agent with custom instructions
agent = AgentService.create_agent(
    model="qwen2.5:14b",
    instructions="You are a Python programming assistant."
)

# Check for errors
if isinstance(agent, dict) and 'error' in agent:
    print(f"Error: {agent['error']}")
else:
    # Use agent
    response = await agent.arun("Hello")
```

**Example:**
```python
# Create agent
result = AgentService.create_agent()

if isinstance(result, dict):
    # Handle error
    print(result['error'])
else:
    # Use agent
    agent = result
    response = await agent.arun("What is Python?")
```

**Related Files:**
- `app/core/config.py` - Settings configuration
- `app/services/agno_services.py` - Alternative agent creation function

---

## Differences from agno_services.py

This service differs from `agno_services.py` in several ways:

1. **Class vs Function:** This is a class with static method, while `agno_services.py` uses a standalone function
2. **Instructions:** This allows custom instructions, while `agno_services.py` uses default/empty instructions
3. **Session Management:** This doesn't handle sessions, while `agno_services.py` uses session_id
4. **Tools:** This doesn't include tools, while `agno_services.py` includes search_internet tool
5. **Database:** This doesn't configure database, while `agno_services.py` uses SqliteDb
6. **History:** This doesn't configure history, while `agno_services.py` enables history

---

## Current Usage

**Status:** This appears to be a legacy implementation. The active codebase uses `agno_services.create_agent()` instead.

**Recommendation:** This file may be kept for reference or removed if not needed. The `agno_services.py` implementation is more feature-complete.

---

## Related Files

- `app/services/agno_services.py` - Active agent creation implementation
- `app/core/config.py` - Settings configuration
- `app/api/v1/chat_routes.py` - Uses `agno_services.create_agent()`

## Notes

1. **Legacy Code:** This appears to be an older implementation that's not actively used in the current codebase.

2. **Error Handling:** Returns error dictionary instead of raising exceptions, which is a different pattern from the rest of the codebase.

3. **Settings Instantiation:** Creates a new `Settings()` instance each time, which is less efficient than using the global `settings` instance.

4. **Limited Features:** Lacks session management, tools, database, and history features that are present in `agno_services.py`.

5. **Markdown Disabled:** Sets `markdown=False`, which may affect response formatting.

6. **Instructions Formatting:** Uses `dedent()` to format instructions, which is useful for multi-line strings.

