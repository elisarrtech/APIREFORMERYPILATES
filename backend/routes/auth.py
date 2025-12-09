# app/routes/auth.py
from flask import Blueprint, request, jsonify
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json() or {}
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email y contraseña requeridos'
            }), 400
        
        # Credenciales de prueba
        test_users = {
            'admin@ollin.com': {'password': 'admin123', 'role': 'admin', 'name': 'Admin OL-LIN'},
            'instructor@ollin.com': {'password': 'instructor123', 'role': 'instructor', 'name': 'Instructor Demo'},
            'cliente@ollin.com': {'password': 'cliente123', 'role': 'client', 'name': 'Cliente Demo'}
        }
        
        if email in test_users and password == test_users[email]['password']:
            user_data = test_users[email]
            return jsonify({
                'success': True,
                'user': {
                    'id': 1,
                    'email': email,
                    'full_name': user_data['name'],
                    'role': user_data['role'],
                    'active': True
                },
                'access_token': 'jwt-token-de-prueba-123'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Credenciales incorrectas'
            }), 401
            
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({
            'success': False,
            'message': 'Error interno del servidor'
        }), 500

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json() or {}
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        full_name = data.get('full_name', '').strip()
        
        if not all([email, password, full_name]):
            return jsonify({
                'success': False,
                'message': 'Faltan campos requeridos'
            }), 400
        
        # Simular creación exitosa
        return jsonify({
            'success': True,
            'user': {
                'id': 2,
                'email': email,
                'full_name': full_name,
                'role': data.get('role', 'client'),
                'active': True
            },
            'access_token': 'jwt-token-nuevo-usuario-456',
            'message': 'Usuario registrado exitosamente'
        }), 201
        
    except Exception as e:
        print(f"Register error: {e}")
        return jsonify({
            'success': False,
            'message': 'Error al registrar usuario'
        }), 500

@auth_bp.route('/test', methods=['GET'])
def test():
    return jsonify({
        'success': True,
        'message': 'Auth endpoint working!'
    }), 200
