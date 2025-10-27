# config.py
# Configuración profesional por entornos
# Patrón: Strategy Pattern para configuración
# Autor: @elisarrtech con Elite AI Architect

import os
from datetime import timedelta


class Config:
    # Configuración base
    
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_size': 10,
        'max_overflow': 20
    }
    
    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_ALGORITHM = 'HS256'
    
    # Security
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # JSON
    JSON_SORT_KEYS = False
    JSONIFY_PRETTYPRINT_REGULAR = False
    
    # CORS
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5000",
    ]
    
    # Pagination
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100
    
    # Reservations
    MIN_HOURS_TO_CANCEL = 2
    MAX_RESERVATIONS_PER_USER = 10
    
    @staticmethod
    def init_app(app):
        # Inicialización adicional de la app
        pass


class DevelopmentConfig(Config):
    # Configuración de desarrollo
    
    DEBUG = True
    TESTING = False
    
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'sqlite:///fitnessclub_dev.db'
    )
    
    SQLALCHEMY_ECHO = False


class ProductionConfig(Config):
    # Configuración de producción
    
    DEBUG = False
    TESTING = False
    
    # Seguridad estricta
    SESSION_COOKIE_SECURE = True
    
    # Base de datos (PostgreSQL en producción)
    database_url = os.environ.get('DATABASE_URL')
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_DATABASE_URI = database_url or 'sqlite:///fitnessclub.db'
    
    # CORS específico
    cors_origins = os.environ.get('CORS_ORIGINS')
    if cors_origins:
        CORS_ORIGINS = [o.strip() for o in cors_origins.split(',')]


# Mapeo de configuraciones
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}


def get_config(env=None):
    # Obtiene la configuración según el entorno
    if env is None:
        env = os.environ.get('FLASK_ENV', 'development')
    
    return config.get(env, config['default'])
