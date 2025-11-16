# Forge

A full-stack AI chat application with a FastAPI backend and TypeScript/React CLI frontend. Forge provides an interactive terminal-based interface for chatting with AI models powered by Ollama, with support for tools.

## Features

- **Terminal-based Chat Interface**: Beautiful CLI interface built with React and Ink
- **Ollama Integration**: Seamless integration with Ollama for local AI model inference
- **Streaming Responses**: Real-time streaming of AI responses for better UX
- **Session Management**: Persistent chat history with session support
- **Command System**: Built-in commands for model management and navigation

## Todos
- [ ] 1. Add file reading/writing tools
- [ ] 2. Add tool confirmation capabilities.
- [ ] 3. Add model downloading util at the frontend.
- [ ] 4. Add command running tools for the models.
- [ ] 5. Add MCP server support.

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework for building APIs
- **SQLAlchemy**: ORM for database management
- **Ollama**: Local LLM inference engine
- **Agno**: Agent framework for AI interactions
- **Tavily**: Internet search API integration
- **SQLite**: Lightweight database for chat history

### Frontend
- **TypeScript**: Type-safe JavaScript
- **React**: UI library
- **Ink**: React renderer for CLI applications
- **Pastel**: CLI framework for building terminal apps

## Prerequisites

Before installing Forge, ensure you have the following installed:

- **Python 3.8+**: Required for the backend
- **Node.js 16+**: Required for the frontend
- **Ollama**: Must be installed and running locally
  - Download from [ollama.ai](https://ollama.ai)
  - At least one model must be downloaded (e.g., `qwen2.5:14b`)
- **Tavily API Key**: Required for internet search functionality
  - Sign up at [tavily.com](https://tavily.com) to get your API key

## Installation

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://www.github.com/loeclos/forge.git
   cd forge
   ```

2. **Install Backend Dependencies**:
   With conda:
   ```bash
   conda env create -f environment.yml
   ```
   With pip:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   # or (recommended)
   pnpm install
   ```

4. **Configure Environment Variables**:
   
   Create a `.env.local` file in the `backend` directory:
   ```env
   TAVILY_API_KEY=your_tavily_api_key_here
   ```
   
   Create a `.env.local` file in the `frontend` directory:
   ```env
   MAIN_ENDPOINT=http://127.0.0.1:8000
   ```

5. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   # or
   pnpm build
   ```

For detailed installation instructions, see [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Running the Application

### Development Mode

1. **Start the Backend Server**:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

2. **Start the Frontend CLI** (in a new terminal):
   ```bash
   cd frontend
   npm run build
   node dist/cli.js
   # or
   pnpm build && node dist/cli.js
   ```

### Production Mode

1. **Start Backend**:
   ```bash
   cd backend
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

2. **Run Frontend**:
   ```bash
   cd frontend
   npm run build
   node dist/cli.js
   ```

## Configuration

### Backend Configuration

The backend configuration is managed in `backend/app/core/config.py`. Key settings:

- `APP_NAME`: Application name (default: "Sagaforge")
- `MODEL`: Default Ollama model to use (default: "qwen2.5:14b")
- `TAVILY_API_KEY`: API key for Tavily search (from environment variable)
- `DATABASE_URL`: SQLite database path

### Frontend Configuration

The frontend configuration is managed via environment variables in `.env.local`:

- `MAIN_ENDPOINT`: Backend API endpoint (default: "http://127.0.0.1:8000")

## Project Structure

```
forge/
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── api/             # API route handlers
│   │   │   └── v1/          # API version 1 routes
│   │   ├── config/          # Configuration modules
│   │   ├── core/            # Core application settings
│   │   ├── db/              # Database files
│   │   ├── logs/            # Application logs
│   │   ├── services/        # Business logic services
│   │   ├── tools/           # AI agent tools
│   │   ├── database.py      # Database configuration
│   │   └── main.py          # FastAPI application entry point
│   └── requirements.txt     # Python dependencies
│ 
├── frontend/                # TypeScript/React CLI frontend
│   ├── source/              # Source code
│   │   ├── commands/        # CLI commands
│   │   ├── components/      # React components
│   │   ├── hooks/           # React hooks
│   │   ├── services/        # Service layer
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── cli.tsx          # CLI entry point
│   ├── dist/                # Compiled JavaScript output
│   └── package.json         # Node.js dependencies
│  
└── docs/                    # Documentation
    ├── INSTALLATION.md      # Detailed installation guide
    ├── API.md               # API reference
    ├── backend/             # Backend documentation
    └── frontend/            # Frontend documentation
```

## Usage

### Starting a Chat Session

1. Launch the frontend CLI application
2. You'll be prompted with a security question about trusting files in the current directory
3. Select "Yes, proceed" to continue
4. Start typing your message and press Enter
5. The AI will respond in real-time with streaming output

### Available Commands

Type `/` followed by a command name to access built-in commands:

- `/models` - List all available Ollama models
- `/model` - Show the currently active model
- `/change` - Change the active model
- `/exit` - Exit the application

### Example Session

```
Welcome to Forge!
Forge can write, test and debug code right from your terminal.
Describe a task to get started or enter ? for help.

❯ What is the capital of France?
The capital of France is Paris.
```

## API Documentation

For complete API documentation, see [docs/API.md](docs/API.md).

The backend provides the following main endpoints:

- `GET /api/models/all` - Get all available models
- `GET /api/models/current` - Get current model
- `POST /api/models/change` - Change current model
- `POST /api/models/download/{model_name}` - Download a model
- `GET /api/models/alive` - Check if Ollama is running
- `POST /api/chat` - Send a chat message
- `GET /api/utils/getcwd` - Get current working directory

## Troubleshooting

### Nothing shows up after message is sent

If you just see a blank message box for a while, this could be for two reasons:
1. The model you chose is too big and runs really slowly on your machine.
2. The model you chose doesn't have tool integration.

To fix 1, try pulling a smaller model from the same family (i.e. qwen3:0.6b instead of qwen3:7b) or you can just wait. The response should show up eventually. 

For 2, you must make sure that the model you got supports tools. All models that allow tools are listed here: https://ollama.com/search?c=tools


### Ollama Connection Errors

If you see "Ollama either not installed or not running":
1. Ensure Ollama is installed and running
2. Check that at least one model is downloaded: `ollama list`
3. Verify Ollama is accessible: `ollama ps`

### API Connection Errors

If the frontend can't connect to the backend:
1. Verify the backend is running on the correct port
2. Check that `MAIN_ENDPOINT` in `.env.local` matches the backend URL
3. Ensure no firewall is blocking the connection

### Model Not Found

If you get "Model not found" errors:
1. List available models: `/models` command
2. Download the model: Use Ollama CLI: `ollama pull <model_name>`

For more troubleshooting tips, see [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Documentation


- [Installation Guide](docs/INSTALLATION.md) - Detailed setup instructions
- [API Reference](docs/API.md) - Complete API documentation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## Support

For issues, questions, or contributions, please open an issue on the repository.

