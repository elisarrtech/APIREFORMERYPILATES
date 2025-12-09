"""
Payments Routes - Rutas de Pagos
@author @elisarrtech
@date 2025-10-28
"""

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User

payments_bp = Blueprint('payments', __name__)


@payments_bp.route('/my-payments', methods=['GET'])
@jwt_required()
def get_my_payments():
    """
    Obtener historial de pagos del usuario actual
    """
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404
        
        # TODO: Implementar lógica de pagos cuando se implemente el sistema de pagos
        # Por ahora retornamos lista vacía
        return jsonify({
            'success': True,
            'data': [],
            'message': 'Historial de pagos (en desarrollo)'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500