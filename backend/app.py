# app.py
# FitnessClub - Sistema de Reservas de Clases de Pilates
# Stack: Flask + SQLAlchemy + JWT + React
# Autor: @elisarrtech con Elite AI Architect
# Versión: 2.0.0

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging
from datetime import datetime, timedelta

# Cargar variables de entorno
load_dotenv()

# Crear directorio de logs si no existe
if not os.path.exists('logs'):
    os.makedirs('logs')
    print("✅ Directorio 'logs' creado")

# Configuración de logging profesional
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('logs/app.log', encoding='utf-8')
    ]
)
LOG = logging.getLogger(__name__)

# Importar extensiones
from extensions import db, jwt, migrate

# Importar configuración
from config import get_config


def create_app(config_name=None):
    # Application Factory Pattern
    # Crea y configura la aplicación Flask
    
    app = Flask(__name__)
    
    # Cargar configuración según entorno
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    config_class = get_config(config_name)
    app.config.from_object(config_class)
    
    # Inicializar configuración adicional
    config_class.init_app(app)
    
    LOG.info(f"🎯 Aplicación iniciando en modo: {config_name}")
    
    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # CORS con configuración desde config
    CORS(
        app,
        origins=app.config['CORS_ORIGINS'],
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    )
    
    LOG.info(f"🌐 CORS configurado para: {app.config['CORS_ORIGINS']}")
    
    # JWT CALLBACKS
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'error': 'token_expired',
            'message': 'El token ha expirado. Por favor inicia sesión nuevamente.'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'success': False,
            'error': 'invalid_token',
            'message': 'Token inválido. Por favor inicia sesión.'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'success': False,
            'error': 'authorization_required',
            'message': 'Se requiere autenticación para acceder a este recurso.'
        }), 401
    
    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'error': 'token_revoked',
            'message': 'El token ha sido revocado.'
        }), 401
    
    # CREAR TABLAS Y REGISTRAR BLUEPRINTS
    with app.app_context():
        # Importar modelos (necesario para crear tablas)
        try:
            from models import (
                User, Package, UserPackage, PilatesClass, 
                Instructor, ClassSchedule, Reservation
            )
            
            # Crear todas las tablas
            db.create_all()
            LOG.info("✅ Tablas de base de datos verificadas/creadas")
        except Exception as e:
            LOG.error(f"❌ Error creando tablas: {e}")
        
        # Registrar blueprints
        register_blueprints(app)
    
    # ERROR HANDLERS PROFESIONALES
    try:
        from utils.exceptions import FitnessClubException
        
        @app.errorhandler(FitnessClubException)
        def handle_custom_exception(error):
            # Manejo de excepciones personalizadas
            LOG.warning(f"Custom exception: {error.__class__.__name__} - {error.message}")
            return jsonify(error.to_dict()), error.status_code
    except ImportError:
        LOG.warning("⚠️  utils.exceptions no encontrado")
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 'not_found',
            'message': 'El recurso solicitado no existe'
        }), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            'success': False,
            'error': 'method_not_allowed',
            'message': 'Método HTTP no permitido para este endpoint'
        }), 405
    
    @app.errorhandler(500)
    def internal_error(error):
        LOG.exception("Error interno del servidor")
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'internal_server_error',
            'message': 'Error interno del servidor'
        }), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'success': False,
            'error': 'bad_request',
            'message': 'Solicitud inválida'
        }), 400
    
    # ENDPOINTS DE UTILIDAD
    @app.route('/')
    def index():
        # Root endpoint con información de la API
        return jsonify({
            'service': 'FitnessClub API',
            'version': '2.0.0',
            'status': 'operational',
            'environment': config_name,
            'database': 'SQLite' if 'sqlite' in app.config['SQLALCHEMY_DATABASE_URI'] else 'PostgreSQL',
            'endpoints': {
                'health': '/health',
                'routes': '/_routes (solo development)',
                'auth': '/api/v1/auth',
                'reservations': '/api/v1/reservations',
                'admin': '/api/v1/admin',
                'instructors': '/api/v1/instructors'
            },
            'documentation': '/api/v1/docs (coming soon)',
            'author': '@elisarrtech'
        }), 200
    
    @app.route('/health')
    def health():
        # Health check endpoint para monitoring
        # Verifica el estado de la aplicación y base de datos
        try:
            # Verificar conexión a la base de datos
            db.session.execute('SELECT 1')
            db_status = 'connected'
            app_status = 'healthy'
            status_code = 200
        except Exception as e:
            LOG.error(f"Health check failed: {e}")
            db_status = 'disconnected'
            app_status = 'unhealthy'
            status_code = 503
        
        return jsonify({
            'status': app_status,
            'service': 'fitnessclub-api',
            'version': '2.0.0',
            'database': db_status,
            'environment': config_name,
            'timestamp': datetime.utcnow().isoformat()
        }), status_code
    
    # AFTER REQUEST (Logging y Headers)
    @app.after_request
    def after_request(response):
        # Procesamiento después de cada request
        # Logging y Headers de seguridad
        
        # Logging
        LOG.info(
            f"{request.method} {request.path} "
            f"{response.status_code} {request.remote_addr}"
        )
        
        # Headers de seguridad
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        
        if config_name == 'production':
            response.headers['Strict-Transport-Security'] = (
                'max-age=31536000; includeSubDomains'
            )
        
        return response
    
    # MENSAJE FINAL
    LOG.info("=" * 80)
    LOG.info("🚀 FitnessClub API v2.0.0 - Sistema de Reservas de Pilates")
    LOG.info("=" * 80)
    LOG.info(f"📍 Entorno: {config_name}")
    LOG.info(f"🗄️  Base de datos: {app.config['SQLALCHEMY_DATABASE_URI']}")
    LOG.info(f"🌐 CORS: {len(app.config['CORS_ORIGINS'])} origins configurados")
    LOG.info(f"🔐 JWT: Token expira en {app.config['JWT_ACCESS_TOKEN_EXPIRES']}")
    LOG.info("=" * 80)
    LOG.info("✅ Aplicación iniciada exitosamente")
    LOG.info("=" * 80)
    
    return app


# app.py
# ACTUALIZADO: Agregando blueprint admin_reformery
# Solo la función register_blueprints modificada

def register_blueprints(app):
    # Registra todos los blueprints de la aplicación
    
    api_prefix = '/api/v1'
    
    # Auth
    try:
        from routes.auth import bp as auth_bp
        app.register_blueprint(auth_bp, url_prefix=f'{api_prefix}/auth')
        LOG.info("✅ Blueprint registrado: auth")
    except ImportError as e:
        LOG.warning(f"⚠️  auth blueprint no encontrado: {e}")
    
    # Reservations
    try:
        from routes.reservations import bp as reservations_bp
        app.register_blueprint(reservations_bp, url_prefix=f'{api_prefix}/reservations')
        LOG.info("✅ Blueprint registrado: reservations")
    except ImportError as e:
        LOG.warning(f"⚠️  reservations blueprint no encontrado: {e}")
    
    # Admin - ROUTES ORIGINAL
    try:
        from routes.admin_routes import bp as admin_bp
        app.register_blueprint(admin_bp, url_prefix=f'{api_prefix}/admin')
        LOG.info("✅ Blueprint registrado: admin")
    except ImportError as e:
        LOG.warning(f"⚠️  admin blueprint no encontrado: {e}")
    
    # Admin REFORMERY - NUEVO
    try:
        from routes.admin_routes_reformery import bp as admin_reformery_bp
        app.register_blueprint(admin_reformery_bp, url_prefix=f'{api_prefix}/admin-reformery')
        LOG.info("✅ Blueprint registrado: admin-reformery")
    except ImportError as e:
        LOG.warning(f"⚠️  admin-reformery blueprint no encontrado: {e}")
    
    # Instructors
    try:
        from routes.instructors import bp as instructors_bp
        app.register_blueprint(instructors_bp, url_prefix=f'{api_prefix}/instructors')
        LOG.info("✅ Blueprint registrado: instructors")
    except ImportError as e:
        LOG.warning(f"⚠️  instructors blueprint no encontrado: {e}")

# ENTRY POINT
if __name__ == '__main__':
    # Crear aplicación
    app = create_app()
    
    # Configuración según entorno
    is_debug = os.environ.get('FLASK_ENV') == 'development'
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    
    LOG.info(f"🎯 Servidor escuchando en {host}:{port}")
    LOG.info(f"🔧 Debug mode: {is_debug}")
    
    # Iniciar servidor
    app.run(
        host=host,
        port=port,
        debug=is_debug,
        threaded=True,
        use_reloader=is_debug
    )
