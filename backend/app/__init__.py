import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import config

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    jwt.init_app(app)

    # Orígenes permitidos
    netlify_origin = os.getenv("NETLIFY_ORIGIN", "https://ollinavances.netlify.app")
    allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173", netlify_origin]

    CORS(
        app,
        resources={r"/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "supports_credentials": True,
            "expose_headers": ["Content-Type", "Authorization"],
            "max_age": 3600
        }},
    )

    # SIMPLIFICA: Solo registra los blueprints esenciales por ahora
    try:
        from app.routes.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
        print("✅ Auth blueprint registered")
    except ImportError as e:
        print(f"❌ ERROR importing auth blueprint: {e}")
        # Si falla, define uno mínimo
        @app.route('/api/v1/auth/login', methods=['POST'])
        def temp_login():
            return {"success": False, "message": "Backend en mantenimiento"}, 503

    # Healthcheck
    @app.route('/health')
    def health():
        return {"status": "ok", "backend": "OL-LIN"}, 200

    # INICIALIZACIÓN SIMPLIFICADA - Sin seeding por ahora
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables created")
        except Exception as e:
            print(f"⚠️ Error creating tables: {e}")

    return app
