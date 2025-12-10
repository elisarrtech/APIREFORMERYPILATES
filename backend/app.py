from datetime import timedelta
import os

from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Config desde variables de entorno (Railway provee DATABASE_URL)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///dev.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # JWT config
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change_this_in_prod')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=int(os.getenv('JWT_ACCESS_EXPIRES_MIN', '15')))
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=int(os.getenv('JWT_REFRESH_EXPIRES_DAYS', '30')))

    # CORS: cambiar FRONTEND_URL por la URL de tu frontend en Railway o Vercel
    CORS(app, origins=[os.getenv('FRONTEND_URL', 'http://localhost:3000')], supports_credentials=True)

    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Blueprints
    from .auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    # Ejemplo de ruta protegida
    from flask_jwt_extended import jwt_required, get_jwt_identity
    @app.route('/api/protected')
    @jwt_required()
    def protected():
        user_id = get_jwt_identity()
        return jsonify(message='Acceso permitido', user_id=user_id), 200

    # Health check
    @app.route('/health')
    def health():
        return jsonify(status='ok'), 200

    return app

# Para gunicorn en Railway: "gunicorn backend.app:create_app()"
app = create_app()
