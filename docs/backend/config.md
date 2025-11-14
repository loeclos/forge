# Configuration Documentation

## File Overview

Configuration management for the Forge backend application. Settings are loaded from environment variables and provide default values.

**Location:** `backend/app/core/config.py`

## Imports

```python
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv
```

## Environment Loading

```python
load_dotenv()
```

Loads environment variables from a `.env` file in the backend directory. This must be called before accessing environment variables.

---

## Settings Class

### `Settings`

Pydantic settings class that manages application configuration.

**Base Class:** `BaseSettings` (from `pydantic_settings`)

**Definition:**
```python
class Settings(BaseSettings):
    APP_NAME: str = "Sagaforge"
    DATABASE_URL: str = "sqlite:///./test.db"
    MODEL: str = "qwen2.5:14b" 
    TAVILY_API_KEY: str = os.getenv('TAVILY_API_KEY')
```

### Settings Fields

#### `APP_NAME`

Application name identifier.

**Type:** `str`

**Default:** `"Sagaforge"`

**Usage:** Used for application identification in logs and metadata.

---

#### `DATABASE_URL`

Database connection URL.

**Type:** `str`

**Default:** `"sqlite:///./test.db"`

**Note:** This default is not currently used. The actual database URL is defined in `app/database.py` as `SQLALCHEMY_DATABASE_URL`.

**Potential Usage:** Could be used to override the database connection if needed.

---

#### `MODEL`

Default Ollama model to use for AI interactions.

**Type:** `str`

**Default:** `"qwen2.5:14b"`

**Usage:** 
- Used when creating AI agents
- Can be changed via the `/api/models/change` endpoint
- Must be a model that is installed in Ollama

**Example Values:**
- `"qwen2.5:14b"`
- `"llama2:7b"`
- `"mistral:7b"`

**Note:** The model must be downloaded in Ollama before use. Use `ollama pull <model_name>` to download.

---

#### `TAVILY_API_KEY`

API key for Tavily internet search service.

**Type:** `str`

**Default:** `os.getenv('TAVILY_API_KEY')`

**Source:** Loaded from environment variable `TAVILY_API_KEY`

**Required:** Yes (for internet search functionality)

**Setup:**
1. Sign up at [tavily.com](https://tavily.com)
2. Get your API key from the dashboard
3. Add to `.env` file:
   ```env
   TAVILY_API_KEY=your_api_key_here
   ```

**Usage:** Used by the `search_internet` tool to perform web searches.

**Security:** Never commit the API key to version control. Always use environment variables.

---

## Settings Instance

### `settings`

Global settings instance that should be imported and used throughout the application.

**Type:** `Settings`

**Creation:**
```python
settings = Settings()
```

**Usage:**
```python
from app.core.config import settings

# Access settings
current_model = settings.MODEL
api_key = settings.TAVILY_API_KEY
```

---

## Environment Variables

### Required Variables

Create a `.env` file in the `backend/` directory with:

```env
TAVILY_API_KEY=your_tavily_api_key_here
```

### Optional Variables

The following can be set via environment variables (though they have defaults):

- `APP_NAME` - Application name
- `DATABASE_URL` - Database connection string
- `MODEL` - Default Ollama model

**Note:** Pydantic Settings automatically reads from environment variables. You can override defaults by setting environment variables with the same names.

---

## Usage Examples

### Importing Settings

```python
from app.core.config import settings

# Use in code
model = settings.MODEL
app_name = settings.APP_NAME
```

### Using in Services

```python
from app.core.config import settings
from agno.models.ollama import Ollama

# Create model with configured default
model = Ollama(settings.MODEL)
```

### Using in Tools

```python
from app.core.config import settings
from tavily import TavilyClient

# Initialize client with API key
client = TavilyClient(settings.TAVILY_API_KEY)
```

---

## Configuration File Location

The `.env` file should be located at:
```
backend/.env
```

**Important:** 
- Never commit `.env` files to version control
- Add `.env` to `.gitignore`
- Document required environment variables in README

---

## Related Files

- `app/database.py` - Database configuration (uses different database URL)
- `app/services/agno_services.py` - Uses `settings.MODEL` and `settings.TAVILY_API_KEY`
- `app/tools/search_internet.py` - Uses `settings.TAVILY_API_KEY`
- `app/api/v1/ollama_routes.py` - Uses `settings.MODEL`

## Notes

1. **Pydantic Settings:** Uses Pydantic's `BaseSettings` which provides validation and type checking for configuration values.

2. **Environment Variable Priority:** Pydantic Settings reads from:
   1. Environment variables (highest priority)
   2. Default values in the class definition

3. **Database URL:** The `DATABASE_URL` in settings is not currently used. The actual database URL is hardcoded in `app/database.py`.

4. **Model Configuration:** The `MODEL` setting can be changed at runtime via the API, but the change only persists for the current application instance.

5. **API Key Security:** The Tavily API key should always be loaded from environment variables, never hardcoded.

6. **Dotenv Loading:** `load_dotenv()` must be called before creating the `Settings` instance to ensure environment variables are loaded.

