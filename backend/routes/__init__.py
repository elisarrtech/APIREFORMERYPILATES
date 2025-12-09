# routes/__init__.py
# Inicialización del paquete de rutas
# Autor: @elisarrtech con Elite AI Architect

from routes.auth import bp as auth_bp
from routes.reservations import bp as reservations_bp
from routes.admin_routes import bp as admin_bp
from routes.instructors import bp as instructors_bp

__all__ = [
    'auth_bp',
    'reservations_bp',
    'admin_bp',
    'instructors_bp'
]
