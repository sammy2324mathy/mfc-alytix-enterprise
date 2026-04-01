import os


class Settings:
    """Auth service configuration from environment variables."""

    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./auth.db")
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    jwt_secret: str = os.getenv("JWT_SECRET", "changeme")
    jwt_expires_minutes: int = int(os.getenv("JWT_EXPIRES_MINUTES", "60"))
    jwt_refresh_expires_minutes: int = int(os.getenv("JWT_REFRESH_EXPIRES_MINUTES", str(60 * 24 * 30)))
    service_name: str = os.getenv("SERVICE_NAME", "auth-service")


settings = Settings()
