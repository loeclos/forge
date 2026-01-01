from fastapi import Depends, FastAPI, HTTPException, Query

from database import SessionLocal, engine, Base
from contextlib import asynccontextmanager
import logging
from core.config import settings
import os

from api.v1 import ollama_routes, chat_routes, util_routes
from config.logging import setup_logging

setup_logging()

logger = logging.getLogger("app")

settings.CURRENT_DIR = os.getcwd()

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