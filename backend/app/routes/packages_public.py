"""
Packages Public Routes - Rutas públicas de paquetes
@author @elisarrtech
@date 2025-10-28
"""

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.package import Package
from app.models.user import User
from app.models.user_package import UserPackage
from datetime import datetime, timedelta

packages_public_bp = Blueprint('packages_public', __name__)


@packages_public_bp.route('/', methods=['GET'])
@jwt_required()
def get_available_packages():
    """
    Obtener paquetes disponibles para compra
    """
    try:
        packages = Package.query.filter_by(active=True).all()
        return jsonify({
            'success': True,
            'data': [pkg.to_dict() for pkg in packages]
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@packages_public_bp.route('/purchase', methods=['POST'])
@jwt_required()
def purchase_package():
    """
    Comprar un paquete
    """
    from flask import request
    
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404
        
        data = request.get_json()
        package_id = data.get('package_id')
        
        if not package_id:
            return jsonify({'success': False, 'message': 'package_id es requerido'}), 400
        
        package = Package.query.get(package_id)
        if not package:
            return jsonify({'success': False, 'message': 'Paquete no encontrado'}), 404
        
        if not package.active:
            return jsonify({'success': False, 'message': 'Paquete no disponible'}), 400
        
        # Crear UserPackage
        user_package = UserPackage(
            user_id=current_user_id,
            package_id=package_id,
            classes_total=package.classes_count,
            classes_remaining=package.classes_count,
            classes_used=0,
            purchase_date=datetime.utcnow(),
            expiration_date=datetime.utcnow() + timedelta(days=package.validity_days),
            status='active',
            active=True
        )
        
        db.session.add(user_package)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Paquete comprado exitosamente',
            'data': user_package.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@packages_public_bp.route('/my-packages', methods=['GET'])
@jwt_required()
def get_my_packages():
    """
    Obtener paquetes del usuario actual
    """
    try:
        current_user_id = get_jwt_identity()
        user_packages = UserPackage.query.filter_by(user_id=current_user_id).all()
        
        return jsonify({
            'success': True,
            'data': [up.to_dict() for up in user_packages]
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500