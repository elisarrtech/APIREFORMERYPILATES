from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from datetime import datetime, timedelta
import pytz

from .app import db
from .models import User, RefreshToken

auth_bp = Blueprint('auth', __name__)

# REGISTER (opcional, si quieres registro desde frontend)
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'client')

    if not email or not password:
        return jsonify(success=False, message='Email y contraseña son requeridos'), 400

    if User.query.filter_by(email=email).first():
        return jsonify(success=False, message='El correo ya está en uso'), 409

    user = User(email=email, password_hash=generate_password_hash(password), role=role)
    db.session.add(user)
    db.session.commit()

    return jsonify(success=True, user=user.to_dict(), message='Usuario creado'), 201

# LOGIN
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    remember = data.get('remember', False)

    if not email or not password:
        return jsonify(success=False, message='Email y contraseña son requeridos'), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify(success=False, message='Correo o contraseña incorrectos'), 401

    if not user.is_active:
        return jsonify(success=False, message='Usuario inactivo'), 403

    # Crear access + refresh token
    additional_claims = {'role': user.role, 'email': user.email}
    access_expires = current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES')
    refresh_expires = current_app.config.get('JWT_REFRESH_TOKEN_EXPIRES')

    access_token = create_access_token(identity=user.id, additional_claims=additional_claims, expires_delta=access_expires)
    refresh_token = create_refresh_token(identity=user.id, additional_claims=additional_claims, expires_delta=refresh_expires)

    # Guardar el jti del refresh token para permitir revocación
    from flask_jwt_extended import decode_token
    decoded_refresh = decode_token(refresh_token)
    jti = decoded_refresh.get('jti')
    exp_timestamp = decoded_refresh.get('exp')
    expires_at = datetime.fromtimestamp(exp_timestamp, tz=pytz.UTC) if exp_timestamp else None

    rt = RefreshToken(jti=jti, user_id=user.id, expires_at=expires_at, revoked=False)
    db.session.add(rt)
    db.session.commit()

    user_data = user.to_dict()
    return jsonify(
        success=True,
        message='Autenticación correcta',
        user=user_data,
        access_token=access_token,
        refresh_token=refresh_token
    ), 200

# REFRESH
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    jwt_payload = get_jwt()
    jti = jwt_payload.get('jti')

    # Verificar que el refresh token no esté revocado
    token_record = RefreshToken.query.filter_by(jti=jti, user_id=identity).first()
    if not token_record or token_record.revoked:
        return jsonify(success=False, message='Refresh token inválido o revocado'), 401

    # Crear nuevo access token (puedes también rotar refresh tokens si quieres)
    user = User.query.get(identity)
    additional_claims = {'role': user.role, 'email': user.email}
    access_token = create_access_token(identity=identity, additional_claims=additional_claims)

    return jsonify(success=True, access_token=access_token), 200

# LOGOUT (revocar refresh token)
@auth_bp.route('/logout', methods=['POST'])
@jwt_required(refresh=True)
def logout():
    jwt_payload = get_jwt()
    jti = jwt_payload.get('jti')
    identity = get_jwt_identity()

    token = RefreshToken.query.filter_by(jti=jti, user_id=identity).first()
    if token:
        token.revoked = True
        db.session.commit()
        return jsonify(success=True, message='Sesión cerrada'), 200

    return jsonify(success=False, message='Token no encontrado'), 400
