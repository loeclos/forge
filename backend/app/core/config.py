from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    APP_NAME: str = "Forge"
    DATABASE_URL: str = "sqlite:///./test.db"
    MODEL: str = "granite4:350m" 
    TAVILY_API_KEY: str = os.getenv('TAVILY_API_KEY')
    CURRENT_DIR: str = "./"


settings = Settings()
