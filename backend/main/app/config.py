from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    CORS_ORIGINS: str = "*"
    API_PREFIX: str = "/api"
    
    # Renderの環境変数に合わせる
    PORT: Optional[int] = None
    HOST: str = "0.0.0.0"

    class Config:
        env_file = ".env"

settings = Settings()