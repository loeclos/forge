from typing import Annotated, Literal
from fastapi import Depends, FastAPI, HTTPException, Query

from app.database import SessionLocal, engine, Base
from contextlib import asynccontextmanager
import logging
import os

from app.api.v1 import ollama_routes, chat_routes, util_routes
from app.config.logging import setup_logging

setup_logging()

logger = logging.getLogger("app")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        logger.debug("Database session created.")
        yield db
    finally:
        db.close()
        logger.debug("Database session closed.")

# Database initialization
async def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created.")

# Optional: close engine on shutdown
async def shutdown_db():
    await engine.dispose()
    logger.info("Database connection closed.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application startup: initializing database.")
    await init_db()
    yield
    logger.info("Application shutdown: closing database.")
    await shutdown_db()

def create_db_and_tables():
    Base.metadata.create_all(engine)
    logger.info("Database tables created (sync).")

def is_path_in_current_script_dir(target_path):
    """
    Checks if a given path is within the same directory as the current Python script.

    Args:
        target_path (str): The path to check.

    Returns:
        bool: True if the target_path is in the same directory, False otherwise.
    """
    current_script_dir = os.path.dirname(os.path.abspath(__file__))
    absolute_target_path = os.path.abspath(target_path)
    target_parent_dir = os.path.dirname(absolute_target_path)

    result = current_script_dir == target_parent_dir
    logger.debug(f"Checking if '{target_path}' is in current script dir: {result}")
    return result

def write_file(filename: str, value: str = '', write_type: Literal['w', 'a', 'x', 'wt'] = 'wt'):
    if not is_path_in_current_script_dir(filename):
        logger.error(f"Attempted to write to file outside current directory: {filename}")
        raise RuntimeError('Cannot write to files that are not in the current directory.')
    with open(file=filename, mode=write_type) as file:
        file.write(value)
    logger.info(f"File '{filename}' written with mode '{write_type}'.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application startup: creating DB tables (sync).")
    create_db_and_tables()
    yield
    logger.info("Application shutdown.")




app = FastAPI(lifespan=lifespan)


app.include_router(ollama_routes.router, prefix='/api/models')
app.include_router(chat_routes.router, prefix='/api/chat')
app.include_router(util_routes.router, prefix='/api/utils')