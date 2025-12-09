# Crear archivo nuevo: backend/app/routes/notifications.py

"""
Notifications Routes - Gestión de notificaciones para usuarios
@author @elisarrtech
@version 1.0.0 - ÉLITE MUNDIAL
@date 2025-10-28
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.notification import Notification
from app.models.user import User
from datetime import datetime

notifications_bp = Blueprint('notifications', __name__)


@notifications_bp.route('/my-notifications', methods=['GET'])
@jwt_required()
def get_my_notifications():
    """
    Obtener notificaciones del usuario actual
    Query params:
        limit: int (default: 50)
        unread_only: bool (default: false)
    """
    try:
        current_user_id = get_jwt_identity()
        limit = request.args.get('limit', 50, type=int)
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        
        query = Notification.query.filter_by(user_id=current_user_id)
        
        if unread_only:
            query = query.filter_by(read=False)
        
        notifications = query.order_by(
            Notification.created_at.desc()
        ).limit(limit).all()
        
        unread_count = Notification.query.filter_by(
            user_id=current_user_id,
            read=False
        ).count()
        
        return jsonify({
            'success': True,
            'data': [n.to_dict() for n in notifications],
            'unread_count': unread_count
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@notifications_bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(notification_id):
    """Marcar notificación como leída"""
    try:
        current_user_id = get_jwt_identity()
        
        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=current_user_id
        ).first()
        
        if not notification:
            return jsonify({
                'success': False,
                'message': 'Notificación no encontrada'
            }), 404
        
        notification.mark_as_read()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Notificación marcada como leída'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@notifications_bp.route('/mark-all-read', methods=['PUT'])
@jwt_required()
def mark_all_as_read():
    """Marcar todas las notificaciones como leídas"""
    try:
        current_user_id = get_jwt_identity()
        
        updated = Notification.query.filter_by(
            user_id=current_user_id,
            read=False
        ).update({
            'read': True,
            'read_at': datetime.utcnow()
        })
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'{updated} notificaciones marcadas como leídas'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@notifications_bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """Eliminar notificación"""
    try:
        current_user_id = get_jwt_identity()
        
        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=current_user_id
        ).first()
        
        if not notification:
            return jsonify({
                'success': False,
                'message': 'Notificación no encontrada'
            }), 404
        
        db.session.delete(notification)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Notificación eliminada'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500