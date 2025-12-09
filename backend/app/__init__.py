# backend/app/__init__.py
"""
Application Factory Pattern - REFORMERY
@version 3.0.0 - PRODUCTION READY
"""

from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import config

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_name='development'):
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(config[config_name])
    print(f"✅ Configuration loaded: {config_name}")

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    print("✅ Extensions initialized")

    # --- CORS: permitir frontend (Netlify) y localhost para desarrollo ---
    ALLOWED_ORIGINS = [
        "https://ollinavances.netlify.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    # Aplica CORS de forma global sobre todas las rutas - origenes explicitados
    CORS(app, origins=ALLOWED_ORIGINS, supports_credentials=True,
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         allow_headers=["Content-Type", "Authorization"])

    # Fallback: asegúrate de que las respuestas (incluido OPTIONS) incluyan cabeceras CORS
    @app.after_request
    def _add_cors_headers(response):
        origin = request.headers.get("Origin")
        if origin and origin in ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            # optionally expose headers
            response.headers["Access-Control-Expose-Headers"] = "Content-Type, Authorization"
        return response

    print("✅ CORS configured")

    # ... resto del create_app (registro de blueprints, seeds, etc.) ...
    # (Mantén el resto de tu archivo tal cual)
    ...
    return app
