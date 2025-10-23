from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Sagaforge"
    DATABASE_URL: str = "sqlite:///./test.db"
    MODEL: str = "qwen2.5:14b" 


settings = Settings()
