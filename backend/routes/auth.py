# routes/auth.py
# Rutas de autenticación y autorización
# Autor: @elisarrtech con Elite AI Architect

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from extensions import db
from models import User
from utils.validators import validate_email, validate_password
from utils.exceptions import ValidationError, AuthenticationError
from datetime import timedelta

bp = Blueprint('auth', __name__)


@bp.route('/register', methods=['POST'])
def register():
    # Registro de nuevo usuario
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data or not data.get('email') or not data.get('password') or not data.get('full_name'):
            raise ValidationError("Email, contraseña y nombre completo son requeridos")
        
        email = data['email'].lower().strip()
        password = data['password']
        full_name = data['full_name'].strip()
        
        # Validar formato
        validate_email(email)
        validate_password(password)
        
        # Verificar si el usuario ya existe
        if User.query.filter_by(email=email).first():
            raise ValidationError("El email ya está registrado")
        
        # Crear nuevo usuario
        user = User(
            email=email,
            full_name=full_name,
            role=data.get('role', 'client'),
            active=True
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Generar token
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=7)
        )
        
        return jsonify({
            'success': True,
            'message': 'Usuario registrado exitosamente',
            'data': {
                'user': user.to_dict(),
                'access_token': access_token
            }
        }), 201
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'validation_error',
            'message': str(e)
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'server_error',
            'message': 'Error al registrar usuario'
        }), 500


@bp.route('/login', methods=['POST'])
def login():
    # Inicio de sesión
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data or not data.get('email') or not data.get('password'):
            raise ValidationError("Email y contraseña son requeridos")
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # Buscar usuario
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            raise AuthenticationError("Email o contraseña incorrectos")
        
        if not user.active:
            raise AuthenticationError("Usuario inactivo")
        
        # Generar token
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=7)
        )
        
        return jsonify({
            'success': True,
            'message': 'Inicio de sesión exitoso',
            'data': {
                'user': user.to_dict(),
                'access_token': access_token
            }
        }), 200
        
    except AuthenticationError as e:
        return jsonify({
            'success': False,
            'error': 'authentication_error',
            'message': str(e)
        }), 401
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'validation_error',
            'message': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'server_error',
            'message': 'Error al iniciar sesión'
        }), 500


@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    # Obtiene información del usuario autenticado
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            raise AuthenticationError("Usuario no encontrado")
        
        return jsonify({
            'success': True,
            'data': user.to_dict()
        }), 200
        
    except AuthenticationError as e:
        return jsonify({
            'success': False,
            'error': 'authentication_error',
            'message': str(e)
        }), 401
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'server_error',
            'message': 'Error al obtener usuario'
        }), 500


@bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    # Cambiar contraseña
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            raise AuthenticationError("Usuario no encontrado")
        
        data = request.get_json()
        
        if not data or not data.get('current_password') or not data.get('new_password'):
            raise ValidationError("Contraseña actual y nueva contraseña son requeridas")
        
        current_password = data['current_password']
        new_password = data['new_password']
        
        # Verificar contraseña actual
        if not user.check_password(current_password):
            raise AuthenticationError("Contraseña actual incorrecta")
        
        # Validar nueva contraseña
        validate_password(new_password)
        
        # Actualizar contraseña
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Contraseña actualizada exitosamente'
        }), 200
        
    except AuthenticationError as e:
        return jsonify({
            'success': False,
            'error': 'authentication_error',
            'message': str(e)
        }), 401
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'validation_error',
            'message': str(e)
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'server_error',
            'message': 'Error al cambiar contraseña'
        }), 500
