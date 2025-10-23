from agno.agent import Agent 
from agno.models.ollama import Ollama
from app.core.config import Settings

from textwrap import dedent

import ollama

class AgentService:
    @staticmethod
    def create_agent(model: str = Settings().MODEL, instructions: str = 'You are a helpful assistant.'):
        try:
            agent = Agent(
                model=Ollama(id=f'{model}'),
                instructions=dedent(f'''\
                                        {instructions}
                                        \
                                    '''),
                markdown=False,
            )
        except ollama.ResponseError as e:
            return {'error': 'Failed to create an agent. You most likely provided a wrong model name.'}
        else:
            return agent

