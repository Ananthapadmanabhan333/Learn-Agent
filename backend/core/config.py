import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "A1 Engine"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    DATABASE_URL: str = "sqlite:///./a1engine.db"
    
    # AI MODELS
    OPENAI_API_KEY: str = ""

    # AUTH
    SECRET_KEY: str = "your-super-secret-key-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra='ignore'
    )

settings = Settings()
