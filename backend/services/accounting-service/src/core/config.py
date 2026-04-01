import os


class Settings:
    """Load from environment (Docker Compose injects DATABASE_URL). No pydantic-settings required."""

    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://mfc_admin:mfc_secure_password_2026@localhost:5432/mfc_alytix_prod",
    )


settings = Settings()
