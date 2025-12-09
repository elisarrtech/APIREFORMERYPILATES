import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Inicializar extensiones PRIMERO
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuración básica
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret')
    
    # Inicializar
    db.init_app(app)
    jwt.init_app(app)
    
    # CORS simple
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Registrar blueprint básico
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    
    # Crear tablas
    with app.app_context():
        db.create_all()
        print("✅ Database tables created")
    
    # Health check
    @app.route('/health')
    def health():
        return {"status": "ok", "service": "OL-LIN Backend"}, 200
    
    @app.route('/')
    def home():
        return {"message": "OL-LIN Pilates Studio API"}, 200
    
    return app
