# Installation Guide

This guide provides detailed step-by-step instructions for installing and setting up the Forge application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Installation](#backend-installation)
3. [Frontend Installation](#frontend-installation)
4. [Ollama Setup](#ollama-setup)
5. [Tavily API Setup](#tavily-api-setup)
6. [Environment Configuration](#environment-configuration)
7. [Database Initialization](#database-initialization)
8. [Verification](#verification)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Python**: Version 3.8 or higher
- **Node.js**: Version 16 or higher
- **Package Managers**: 
  - `pip` (Python package manager)
  - `npm` or `pnpm` (Node.js package managers)

### Required Software

1. **Python 3.8+**
   - Check installation: `python --version` or `python3 --version`
   - Download from [python.org](https://www.python.org/downloads/) if needed

2. **Node.js 16+**
   - Check installation: `node --version`
   - Download from [nodejs.org](https://nodejs.org/) if needed

3. **Ollama**
   - Download from [ollama.ai](https://ollama.ai)
   - Follow installation instructions for your OS
   - Verify installation: `ollama --version`

4. **Git** (optional, for cloning)
   - Check installation: `git --version`

## Backend Installation

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

With conda:
```bash
conda env create -f environment.yml
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

With conda:
```bash
conda env create -f environment.yml
```

### Step 3: Install Python Dependencies

> _Note: If you installed with conda through the `enviornment.yml` file, you can skip this step_

```bash
pip install -r requirements.txt
```

### Step 4: Verify Backend Installation

```bash
python -c "import fastapi; print('FastAPI installed successfully')"
python -c "import ollama; print('Ollama Python client installed successfully')"
```

## Frontend Installation

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Node.js Dependencies

**Using npm:**
```bash
npm install
```

**Using pnpm (recommended):**
```bash
pnpm install
```

### Step 3: Build Frontend

**Using npm:**
```bash
npm run build
```

**Using pnpm:**
```bash
pnpm build
```

### Step 4: Verify Frontend Installation

Check that the `dist/` directory was created:
```bash
ls dist/  # macOS/Linux
dir dist\  # Windows
```

## Ollama Setup

### Step 1: Install Ollama

1. Visit [ollama.ai](https://ollama.ai)
2. Download the installer for your operating system
3. Run the installer and follow the setup wizard

### Step 2: Verify Ollama Installation

```bash
ollama --version
```

### Step 3: Start Ollama Service

Ollama should start automatically after installation. Verify it's running:

```bash
ollama ps
```

If Ollama is not running, start it:
- **Windows**: Ollama should run as a service automatically
- **macOS**: `ollama serve` (or it may run automatically)
- **Linux**: `ollama serve` (or configure as a systemd service)

### Step 4: Download a Model

Download at least one model to use with Forge:

```bash
ollama pull qwen2.5:14b
```

Or download a smaller model for testing:
```bash
ollama pull llama2:7b
```

### Step 5: Verify Model Installation

List installed models:
```bash
ollama list
```

You should see your downloaded model(s) in the list.

## Tavily API Setup (if you want internet search)

### Step 1: Create Tavily Account

1. Visit [tavily.com](https://tavily.com)
2. Sign up for a free account
3. Navigate to your API dashboard
4. Copy your API key

### Step 2: Add API Key to Environment

The API key will be added to your `.env.local` file (see Environment Configuration section).

## Environment Configuration

### Backend Environment Variables

Create a `.env.local` file in the `backend/` directory:

```bash
cd backend
touch .env.local  # macOS/Linux
# or create .env manually on Windows
```

Add the following content:

```env
TAVILY_API_KEY=your_tavily_api_key_here
```

Replace `your_tavily_api_key_here` with your actual Tavily API key.

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
cd frontend
touch .env.local  # macOS/Linux
# or create .env.local manually on Windows
```

Add the following content:

```env
MAIN_ENDPOINT=http://127.0.0.1:8000
```

If your backend runs on a different host or port, update the URL accordingly.

## Database Initialization

### Automatic Initialization

The database is automatically created when you first run the backend application. The database files will be created in:

- `backend/app/db/database.db` - Main application database
- `backend/app/db/chat_history.db` - Chat history database

### Manual Initialization (Optional)

If you need to manually initialize the database:

```bash
cd backend
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### Database Directory

Ensure the `db` directory exists:

```bash
cd backend/app
mkdir -p db  # macOS/Linux
mkdir db     # Windows (if it doesn't exist)
```

## Verification

### Step 1: Verify Backend

1. Start the backend server:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

2. Open your browser and visit:
   - API Docs: `http://127.0.0.1:8000/docs`
   - Health Check: `http://127.0.0.1:8000/api/models/alive`

3. You should see the Swagger UI documentation page.

### Step 2: Verify Frontend

1. In a new terminal, navigate to frontend:
   ```bash
   cd frontend
   ```

2. Build and run:
   ```bash
   npm run build
   node dist/cli.js
   # or
   pnpm build && node dist/cli.js
   ```

3. You should see the Forge welcome screen.

### Step 3: Test Full Integration

1. Ensure backend is running
2. Start frontend
3. Accept the security prompt
4. Type a test message and verify you receive a response

## Troubleshooting

### Common Issues

#### Issue: "Ollama either not installed or not running"

**Solutions:**
1. Verify Ollama is installed: `ollama --version`
2. Check if Ollama service is running: `ollama ps`
3. Start Ollama manually: `ollama serve`
4. On Windows, check if Ollama service is running in Task Manager

#### Issue: "ModuleNotFoundError" in Python

**Solutions:**
1. Ensure virtual environment is activated
2. Reinstall dependencies: `pip install -r requirements.txt`
3. Check Python version: `python --version` (should be 3.8+)

#### Issue: Frontend can't connect to backend

**Solutions:**
1. Verify backend is running on the correct port
2. Check `MAIN_ENDPOINT` in `frontend/.env.local`
3. Test backend directly: `curl http://127.0.0.1:8000/api/models/alive`
4. Check firewall settings

#### Issue: "Model not found" errors

**Solutions:**
1. List available models: `ollama list`
2. Download the model: `ollama pull <model_name>`
3. Update `MODEL` in `backend/app/core/config.py` if needed
4. Restart the backend server

#### Issue: Database errors

**Solutions:**
1. Ensure `backend/app/db/` directory exists
2. Check file permissions on the database directory
3. Delete database files and let them recreate: `rm backend/app/db/*.db`
4. Verify SQLite is available: `python -c "import sqlite3"`

#### Issue: Tavily API errors

**Solutions:**
1. Verify API key is correct in `.env` file
2. Check API key has not expired
3. Verify internet connection
4. Check Tavily API status page

#### Issue: Frontend build errors

**Solutions:**
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Check Node.js version: `node --version` (should be 16+)
4. Try using pnpm instead of npm: `pnpm install && pnpm build`

### Getting Help

If you encounter issues not covered here:

1. Check the main [README.md](../README.md)
2. Review the [API Documentation](API.md)
3. Check application logs in `backend/app/logs/app.log`
4. Open an issue on the repository with:
   - Error messages
   - Steps to reproduce
   - Your operating system and versions
   - Relevant log output

## Next Steps

After successful installation:

1. Read the [API Documentation](API.md) to understand available endpoints
2. Review [Backend Documentation](backend/README.md) for backend architecture
3. Review [Frontend Documentation](frontend/README.md) for frontend architecture
4. Start developing or using the application!

