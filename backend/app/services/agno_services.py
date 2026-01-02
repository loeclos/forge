'''
Functions using the agno library
'''

from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.db.sqlite import SqliteDb

from app.core.config import settings
from app.tools.search_internet import search_internet
from app.tools.file_tools import write_file, read_file, list_files_in_dir, get_current_dir
import logging

logger = logging.getLogger(__name__)

def create_agent(session_id: str) -> Agent:
    logger.info(f"Creating agent for session_id: {session_id}")
    agent = Agent(
        model=Ollama(settings.MODEL), 
        session_id=session_id,
        tools=[search_internet, write_file, read_file, list_files_in_dir, get_current_dir],
        db=SqliteDb(db_file="./db/chat_history.db"),
        add_history_to_context=True, 
        num_history_runs=5,  
        # instructions=agent_instructions
    )
    logger.info(f"Agent created for session_id: {session_id}")
    return agent
