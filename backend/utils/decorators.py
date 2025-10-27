# utils/decorators.py
# Decoradores reutilizables
# Autor: @elisarrtech con Elite AI Architect

from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from models import User
from utils.exceptions import AuthenticationError, AuthorizationError

def role_required(*allowed_roles):
    # Decorador para verificar roles de usuario
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            
            user = User.query.get(user_id)
            if not user:
                raise AuthenticationError("Usuario no encontrado")
            
            if not user.active:
                raise AuthenticationError("Usuario inactivo")
            
            if user.role not in allowed_roles:
                raise AuthorizationError(
                    f"Rol '{user.role}' no tiene permisos para este recurso"
                )
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def handle_errors(fn):
    # Decorador para manejo de errores
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({
                'success': False,
                'error': e.__class__.__name__,
                'message': str(e)
            }), 500
    return wrapper
