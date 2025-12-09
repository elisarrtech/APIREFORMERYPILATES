"""
Authentication Routes
Login, Register, Token Management

@version 2.0.0
@author @elisarrtech
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from email_validator import validate_email, EmailNotValidError

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    
    Request Body:
        email (str): User email
        password (str): User password
        full_name (str): User full name
        phone (str, optional): User phone
        role (str, optional): User role (default: client)
    
    Returns:
        JSON: Success message with user data and token
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({
                'success': False,
                'message': 'No se recibieron datos'
            }), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        full_name = data.get('full_name', '').strip()
        phone = data.get('phone', '').strip()
        role = data.get('role', 'client')
        
        # Validate email
        if not email:
            return jsonify({
                'success': False,
                'message': 'El email es requerido'
            }), 400
        
        try:
            validate_email(email)
        except EmailNotValidError:
            return jsonify({
                'success': False,
                'message': 'Email inválido'
            }), 400
        
        # Validate password
        if not password or len(password) < 6:
            return jsonify({
                'success': False,
                'message': 'La contraseña debe tener al menos 6 caracteres'
            }), 400
        
        # Validate full name
        if not full_name or len(full_name) < 3:
            return jsonify({
                'success': False,
                'message': 'El nombre debe tener al menos 3 caracteres'
            }), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'El email ya está registrado'
            }), 409
        
        # Create new user
        new_user = User(
            email=email,
            full_name=full_name,
            phone=phone if phone else None,
            role=role,
            active=True
        )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate token
        access_token = create_access_token(identity=new_user.id)
        
        print(f"✅ [AUTH] Usuario registrado: {email}")
        
        return jsonify({
            'success': True,
            'message': 'Usuario registrado exitosamente',
            'data': {
                'token': access_token,
                'user': new_user.to_dict()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ [AUTH] Error en registro: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error al registrar usuario',
            'error': str(e)
        }), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login
    
    Request Body:
        email (str): User email
        password (str): User password
    
    Returns:
        JSON: Success message with user data and token
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No se recibieron datos'
            }), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        print(f"🔑 [AUTH] Intento de login: {email}")
        
        # Validate input
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email y contraseña son requeridos'
            }), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user:
            print(f"❌ [AUTH] Usuario no encontrado: {email}")
            return jsonify({
                'success': False,
                'message': 'Credenciales inválidas'
            }), 401
        
        # Check if user is active
        if not user.active:
            print(f"❌ [AUTH] Usuario inactivo: {email}")
            return jsonify({
                'success': False,
                'message': 'Usuario inactivo. Contacta al administrador.'
            }), 403
        
        # Check password
        if not user.check_password(password):
            print(f"❌ [AUTH] Contraseña incorrecta: {email}")
            return jsonify({
                'success': False,
                'message': 'Credenciales inválidas'
            }), 401
        
        # Generate token
        access_token = create_access_token(identity=user.id)
        
        print(f"✅ [AUTH] Login exitoso: {email} (Rol: {user.role})")
        
        return jsonify({
            'success': True,
            'message': 'Login exitoso',
            'data': {
                'token': access_token,
                'user': user.to_dict()
            }
        }), 200
        
    except Exception as e:
        print(f"❌ [AUTH] Error en login: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error al iniciar sesión',
            'error': str(e)
        }), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get current authenticated user
    
    Returns:
        JSON: Current user data
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'Usuario no encontrado'
            }), 404
        
        return jsonify({
            'success': True,
            'data': user.to_dict()
        }), 200
        
    except Exception as e:
        print(f"❌ [AUTH] Error obteniendo usuario actual: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error al obtener usuario',
            'error': str(e)
        }), 500