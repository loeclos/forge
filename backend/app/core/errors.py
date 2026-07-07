from fastapi import HTTPException

# Shared detail message reused wherever Ollama connectivity fails.
OLLAMA_UNAVAILABLE_DETAIL = "Ollama either not installed or not running."


def ollama_unavailable() -> HTTPException:
    """Build the standard HTTPException raised/returned when Ollama is unreachable."""
    return HTTPException(status_code=500, detail=OLLAMA_UNAVAILABLE_DETAIL)
