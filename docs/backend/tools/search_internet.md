# search_internet.py Documentation

## File Overview

Internet search tool for AI agents. Allows agents to search the web using the Tavily API and retrieve relevant information.

**Location:** `backend/app/tools/search_internet.py`

## Imports

```python
from agno.tools import tool
from tavily import TavilyClient
from app.core.config import settings
```

## Global Variables

### `client`

Tavily API client instance initialized with the API key from settings.

**Type:** `TavilyClient`

**Initialization:**
```python
client = TavilyClient(settings.TAVILY_API_KEY)
```

**Configuration:**
- Uses `settings.TAVILY_API_KEY` from application configuration
- Must be set in `.env` file or environment variables

---

## Functions

### `search_internet(query)`

Searches the internet using Tavily API and returns search results with URLs, titles, content, and relevance scores.

**Signature:**
```python
@tool(requires_confirmation=True)
def search_internet(query: str):
```

**Parameters:**
- `query` (str): Search query string

**Returns:**
- `dict`: Tavily search response containing query and results

**Response Format:**
```json
{
  "query": "your search query",
  "results": [
    {
      "url": "https://example.com",
      "title": "Page Title",
      "content": "Brief overview of the content...",
      "score": 0.79,
      "raw_content": "Full scraped content of the website..." | null
    },
    ...
  ]
}
```

**Response Fields:**

- `query` (str): The original search query
- `results` (list): Array of search result objects
  - `url` (str): URL of the website
  - `title` (str): Title of the webpage
  - `content` (str): Brief overview/summary of the content
  - `score` (float): Relevance score (0.0 to 1.0)
  - `raw_content` (str | null): Full scraped content (if available)

**Behavior:**
- Decorated with `@tool(requires_confirmation=True)` - requires user confirmation before execution
- Calls `client.search()` with the query
- Includes raw content in text format (`include_raw_content="text"`)
- Returns the full Tavily response object

**Tool Decorator:**
```python
@tool(requires_confirmation=True)
```
- Marks the function as an Agno tool
- `requires_confirmation=True` means the agent will pause and request user confirmation before executing this tool

**Usage by Agent:**
The agent will automatically use this tool when it determines an internet search is needed. The tool execution flow:

1. Agent decides to search the internet
2. Agent calls `search_internet(query)`
3. Tool execution is paused (due to `requires_confirmation=True`)
4. Frontend receives tool confirmation request
5. User confirms or denies
6. Tool executes and returns results
7. Agent uses results in response

**Example Response:**
```json
{
  "query": "Python programming language",
  "results": [
    {
      "url": "https://www.python.org",
      "title": "Welcome to Python.org",
      "content": "Python is a programming language...",
      "score": 0.95,
      "raw_content": "Python is a high-level, interpreted programming language..."
    },
    {
      "url": "https://en.wikipedia.org/wiki/Python_(programming_language)",
      "title": "Python (programming language) - Wikipedia",
      "content": "Python is an interpreted, high-level...",
      "score": 0.88,
      "raw_content": null
    }
  ]
}
```

**Documentation String:**
The function includes a comprehensive docstring that:
- Describes the function purpose
- Documents parameters
- Shows example return format
- Explains each field in the results
- Provides guidance on how to use the results (check titles, content, then raw_content)

**Usage:**
```python
# This function is called by the AI agent, not directly
# The agent will use it when it needs to search the internet

# Example: Agent processing user query
# User: "What is the latest news about AI?"
# Agent: [decides to search] -> calls search_internet("latest news about AI")
# Tool: [requests confirmation] -> [executes] -> returns results
# Agent: [uses results] -> provides answer to user
```

**Error Handling:**
- Errors from Tavily API will propagate to the agent
- Agent should handle errors gracefully
- Common errors:
  - Invalid API key
  - Rate limiting
  - Network errors

**Related Files:**
- `app/core/config.py` - Provides `settings.TAVILY_API_KEY`
- `app/services/agno_services.py` - Includes this tool in agent configuration

---

## Tool Integration

### Agent Configuration

This tool is included in agent creation:

```python
# In agno_services.py
agent = Agent(
    tools=[search_internet],  # Tool included here
    # ... other config
)
```

### Confirmation Flow

When the agent wants to use this tool:

1. Agent identifies need for internet search
2. Tool execution is paused (`requires_confirmation=True`)
3. Chat endpoint detects paused state
4. Tool information is sent to frontend in stream
5. User confirms or denies
6. Tool executes (if confirmed) or is skipped (if denied)
7. Results are returned to agent

**Note:** The confirmation endpoint (`/api/chat/confirm-tool`) is currently a placeholder and doesn't process confirmations yet.

---

## Tavily API

### Setup

1. Sign up at [tavily.com](https://tavily.com)
2. Get API key from dashboard
3. Add to `.env` file:
   ```env
   TAVILY_API_KEY=your_api_key_here
   ```

### API Features

- Web search with relevance scoring
- Content scraping
- Structured results
- Raw content extraction

### Rate Limits

Check Tavily documentation for current rate limits. Free tier has limitations.

---

## Related Files

- `app/core/config.py` - API key configuration
- `app/services/agno_services.py` - Tool registration
- `app/api/v1/chat_routes.py` - Tool confirmation handling

## Notes

1. **Confirmation Required:** This tool requires user confirmation before execution, which is a security best practice for tools that access external services.

2. **Raw Content:** The tool requests raw content, which provides more detailed information but may be slower and use more API credits.

3. **Result Quality:** Results include relevance scores, allowing the agent to prioritize higher-scoring results.

4. **Content Fields:** The tool provides both brief `content` and detailed `raw_content`, allowing the agent to choose based on needs.

5. **API Key Security:** The API key is loaded from environment variables, never hardcoded.

6. **Tool Documentation:** The comprehensive docstring helps the AI agent understand how to use the search results effectively.

