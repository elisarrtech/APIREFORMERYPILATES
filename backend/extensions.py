# extensions.py
# Extensiones Flask centralizadas
# Patrón: Application Factory
# Autor: @elisarrtech con Elite AI Architect

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

# Inicializar extensiones (sin app)
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
cors = CORS()
