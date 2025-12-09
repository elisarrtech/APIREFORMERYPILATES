"""
Application Configuration
Configuración centralizada con múltiples ambientes

@version 2.0.0
@author @elisarrtech
"""

import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables (local development)
load_dotenv()


def _normalize_database_url(url: str | None) -> str | None:
    """Normalize DB URL for SQLAlchemy (Heroku/Railway sometimes provide postgres://)."""
    if not url:
        return url
    # SQLAlchemy 1.x/2.x prefers postgresql://
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


def _parse_origins(raw: str | None) -> list[str]:
    """Parse CORS origins from comma separated env var and strip whitespace."""
    if not raw:
        return []
    # allow single '*' to be used explicitly
    if raw.strip() == "*":
        return ["*"]
    # split and strip, filter empties
    origins = [o.strip() for o in raw.split(",")]
    return [o for o in origins if o]


class Config:
    """Base configuration"""

    # Flask Configuration
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    DEBUG = False
    TESTING = False
    PREFERRED_URL_SCHEME = "https"

    # Database Configuration
    SQLALCHEMY_DATABASE_URI = _normalize_database_url(
        os.getenv("DATABASE_URL", "sqlite:///reformery.db")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

    # Only set engine options for non-sqlite backends
    if SQLALCHEMY_DATABASE_URI and not SQLALCHEMY_DATABASE_URI.startswith("sqlite"):
        SQLALCHEMY_ENGINE_OPTIONS = {
            "pool_size": int(os.getenv("SQLALCHEMY_POOL_SIZE", 10)),
            "pool_recycle": int(os.getenv("SQLALCHEMY_POOL_RECYCLE", 3600)),
            "pool_pre_ping": True,
            # allow SQLALCHEMY_MAX_OVERFLOW in env if needed
            "max_overflow": int(os.getenv("SQLALCHEMY_MAX_OVERFLOW", 0)),
        }
    else:
        SQLALCHEMY_ENGINE_OPTIONS = {}

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 86400))
    )
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES_DAYS", 30)))
    JWT_TOKEN_LOCATION = os.getenv("JWT_TOKEN_LOCATION", "headers").split(",")  # e.g. "headers,cookies"
    JWT_HEADER_NAME = os.getenv("JWT_HEADER_NAME", "Authorization")
    JWT_HEADER_TYPE = os.getenv("JWT_HEADER_TYPE", "Bearer")

    # CORS Configuration
    # Default includes your Netlify frontend plus local dev ports
    _raw_origins = os.getenv(
        "CORS_ORIGINS", "https://ollinavances.netlify.app,http://localhost:3000,http://localhost:5173"
    )
    CORS_ORIGINS = _parse_origins(_raw_origins)
    # If you plan to use cookies across sites, set CORS_SUPPORTS_CREDENTIALS=True and make sure front uses credentials
    # If you only use tokens in headers, set to False (safer)
    CORS_SUPPORTS_CREDENTIALS = os.getenv("CORS_SUPPORTS_CREDENTIALS", "false").lower() in (
        "1",
        "true",
        "yes",
    )

    # Application Configuration
    APP_NAME = os.getenv("APP_NAME", "REFORMERY")
    APP_VERSION = os.getenv("APP_VERSION", "2.0.0")
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@reformery.com")

    # Pagination
    ITEMS_PER_PAGE = int(os.getenv("ITEMS_PER_PAGE", 20))
    MAX_ITEMS_PER_PAGE = int(os.getenv("MAX_ITEMS_PER_PAGE", 100))

    # Upload Configuration
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", 16 * 1024 * 1024))
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
    ALLOWED_EXTENSIONS = set(os.getenv("ALLOWED_EXTENSIONS", "png,jpg,jpeg,gif,pdf").split(","))


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = True  # Log SQL queries


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

    # Security Headers / Cookies
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    # If you need cross-site cookies and set CORS_SUPPORTS_CREDENTIALS=True, you might need 'None' + Secure.
    SESSION_COOKIE_SAMESITE = os.getenv("SESSION_COOKIE_SAMESITE", "Lax")

    # Performance defaults (can be overridden via env vars above)
    # Note: SQLALCHEMY_ENGINE_OPTIONS are set in base class for non-sqlite DBs


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)


# Configuration dictionary
config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig,
}


def get_config():
    """Get configuration based on environment (FLASK_ENV or APP_ENV)."""
    env = os.getenv("FLASK_ENV") or os.getenv("APP_ENV") or "development"
    return config.get(env, config["default"])
