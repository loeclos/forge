from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    APP_NAME: str = "Forge"
    DATABASE_URL: str = "sqlite:///./test.db"
    MODEL: str = "qwen2.5:14b" 
    TAVILY_API_KEY: str = os.getenv('TAVILY_API_KEY')


settings = Settings()
