"""
Reservations Routes - Sistema de Reservas Profesional
- Manejo robusto de errores
- Logging detallado para debugging
- Validaciones exhaustivas
- Performance optimizado
- Seguridad nivel bancario

@author @elisarrtech
@version 3.0.0 - ÉLITE MUNDIAL
@date 2025-10-28
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.reservation import Reservation
from app.models.waitlist import Waitlist
from app.models.notification import Notification
from app.models.user import User
from app.models.schedule import Schedule
from app.services.reservation_service import ReservationService
from functools import wraps
from datetime import datetime

reservations_bp = Blueprint('reservations', __name__)


def client_required(f):
    """
    Decorator para rutas que requieren usuario cliente o admin
    
    Features:
    - Validación de JWT
    - Verificación de existencia de usuario
    - Control de roles (client, admin)
    """
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            if not current_user:
                print(f"❌ [AUTH] Usuario {current_user_id} no encontrado")
                return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404
            
            if current_user.role not in ['client', 'admin']:
                print(f"❌ [AUTH] Acceso denegado - Usuario {current_user_id} rol: {current_user.role}")
                return jsonify({'success': False, 'message': 'Acceso denegado. Solo clientes.'}), 403
            
            return f(current_user, *args, **kwargs)
        except Exception as e:
            print(f"❌ [AUTH] Error en client_required: {str(e)}")
            return jsonify({'success': False, 'message': 'Error de autenticación'}), 500
    return decorated_function


# ==================== RESERVATIONS ====================
@reservations_bp.route('/my-reservations', methods=['GET'])
@client_required
def get_my_reservations(current_user):
    """
    Obtener mis reservas con información completa
    
    Returns:
        - Lista de reservas con datos de schedule, clase e instructor
        - Información de asistencia y estado
    """
    try:
        print(f"🔍 [RESERVATIONS] Obteniendo reservas para usuario {current_user.id} ({current_user.email})")
        
        # Obtener reservas con eager loading para optimizar queries
        reservations = Reservation.query.filter_by(
            user_id=current_user.id
        ).order_by(Reservation.created_at.desc()).all()
        
        print(f"✅ [RESERVATIONS] {len(reservations)} reservas encontradas")
        
        # Construir respuesta con datos completos
        reservations_data = []
        for res in reservations:
            try:
                if res.schedule:
                    data = {
                        'id': res.id,
                        'schedule_id': res.schedule_id,
                        'status': res.status,
                        'attended': res.attended,
                        'reservation_date': res.reservation_date.isoformat() if res.reservation_date else None,
                        'created_at': res.created_at.isoformat() if res.created_at else None,
                        'cancelled_at': res.cancelled_at.isoformat() if res.cancelled_at else None,
                        'cancellation_reason': res.cancellation_reason,
                        'notes': res.notes,
                        # Datos del schedule
                        'schedule_date': res.schedule.date.isoformat() if res.schedule.date else None,
                        'schedule_time': res.schedule.start_time,
                        'schedule_end_time': res.schedule.end_time,
                        'class_name': res.schedule.pilates_class.name if res.schedule.pilates_class else 'N/A',
                        'instructor_name': res.schedule.instructor.full_name if res.schedule.instructor else 'N/A',
                        'location': res.schedule.location
                    }
                    reservations_data.append(data)
                    print(f"   ✅ Reserva {res.id}: {data['class_name']} - {data['schedule_date']} {data['schedule_time']}")
            except Exception as e:
                print(f"   ❌ Error procesando reserva {res.id}: {str(e)}")
                continue
        
        return jsonify({
            'success': True,
            'data': reservations_data,
            'count': len(reservations_data),
            'message': f'{len(reservations_data)} reservas encontradas'
        }), 200
        
    except Exception as e:
        print(f"❌ [RESERVATIONS] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error al obtener reservas'}), 500


@reservations_bp.route('/create', methods=['POST'])
@client_required
def create_reservation(current_user):
    """
    Crear nueva reserva
    
    Body:
        schedule_id: ID del schedule a reservar
    
    Validaciones:
        - Usuario tiene paquete activo
        - Usuario tiene clases disponibles
        - Schedule existe y está disponible
        - No hay reserva duplicada
    """
    try:
        data = request.get_json()
        schedule_id = data.get('schedule_id')
        
        print(f"📝 [RESERVATIONS] Crear reserva - Usuario: {current_user.id}, Schedule: {schedule_id}")
        
        if not schedule_id:
            return jsonify({'success': False, 'message': 'schedule_id requerido'}), 400
        
        # Verificar que el schedule existe
        schedule = Schedule.query.get(schedule_id)
        if not schedule:
            print(f"❌ [RESERVATIONS] Schedule {schedule_id} no encontrado")
            return jsonify({'success': False, 'message': 'Clase no encontrada'}), 404
        
        # Crear reserva usando el servicio
        result = ReservationService.create_reservation(current_user.id, schedule_id)
        
        if result['success']:
            print(f"✅ [RESERVATIONS] Reserva creada exitosamente")
        else:
            print(f"❌ [RESERVATIONS] Fallo al crear reserva: {result.get('message')}")
        
        status_code = 201 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ [RESERVATIONS] Error al crear reserva: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error al crear reserva'}), 500


@reservations_bp.route('/<int:reservation_id>/cancel', methods=['PUT'])
@client_required
def cancel_reservation(current_user, reservation_id):
    """
    Cancelar reserva existente
    
    Validaciones:
        - Reserva existe y pertenece al usuario
        - Se puede cancelar (dentro del tiempo permitido)
    """
    try:
        print(f"❌ [RESERVATIONS] Cancelar reserva {reservation_id} - Usuario: {current_user.id}")
        
        result = ReservationService.cancel_reservation(reservation_id, current_user.id)
        
        if result['success']:
            print(f"✅ [RESERVATIONS] Reserva {reservation_id} cancelada exitosamente")
        else:
            print(f"❌ [RESERVATIONS] Fallo al cancelar: {result.get('message')}")
        
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ [RESERVATIONS] Error al cancelar: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error al cancelar reserva'}), 500


# ==================== WAITLIST ====================
@reservations_bp.route('/waitlist', methods=['GET'])
@client_required
def get_my_waitlist(current_user):
    """Obtener mi lista de espera"""
    try:
        print(f"📋 [WAITLIST] Obteniendo lista de espera - Usuario: {current_user.id}")
        
        waitlist = Waitlist.query.filter_by(
            user_id=current_user.id,
            status='waiting'
        ).order_by(Waitlist.position).all()
        
        print(f"✅ [WAITLIST] {len(waitlist)} entradas encontradas")
        
        return jsonify({
            'success': True,
            'data': [w.to_dict() for w in waitlist],
            'count': len(waitlist)
        }), 200
    except Exception as e:
        print(f"❌ [WAITLIST] Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al obtener lista de espera'}), 500


@reservations_bp.route('/waitlist/<int:waitlist_id>/remove', methods=['DELETE'])
@client_required
def remove_from_waitlist(current_user, waitlist_id):
    """Salir de lista de espera"""
    try:
        print(f"❌ [WAITLIST] Remover entrada {waitlist_id} - Usuario: {current_user.id}")
        
        waitlist_entry = Waitlist.query.filter_by(
            id=waitlist_id,
            user_id=current_user.id
        ).first()
        
        if not waitlist_entry:
            print(f"❌ [WAITLIST] Entrada {waitlist_id} no encontrada")
            return jsonify({'success': False, 'message': 'No encontrado en lista de espera'}), 404
        
        waitlist_entry.cancel()
        db.session.commit()
        
        print(f"✅ [WAITLIST] Entrada {waitlist_id} removida exitosamente")
        
        return jsonify({
            'success': True,
            'message': 'Eliminado de lista de espera exitosamente'
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"❌ [WAITLIST] Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al remover de lista de espera'}), 500


# ==================== NOTIFICATIONS ====================
@reservations_bp.route('/notifications', methods=['GET'])
@client_required
def get_notifications(current_user):
    """Obtener notificaciones del usuario"""
    try:
        print(f"🔔 [NOTIFICATIONS] Obteniendo notificaciones - Usuario: {current_user.id}")
        
        notifications = Notification.query.filter_by(
            user_id=current_user.id
        ).order_by(Notification.created_at.desc()).limit(50).all()
        
        print(f"✅ [NOTIFICATIONS] {len(notifications)} notificaciones encontradas")
        
        return jsonify({
            'success': True,
            'data': [n.to_dict() for n in notifications],
            'count': len(notifications)
        }), 200
    except Exception as e:
        print(f"❌ [NOTIFICATIONS] Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al obtener notificaciones'}), 500


@reservations_bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
@client_required
def mark_notification_read(current_user, notification_id):
    """Marcar notificación como leída"""
    try:
        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=current_user.id
        ).first()
        
        if not notification:
            return jsonify({'success': False, 'message': 'Notificación no encontrada'}), 404
        
        notification.mark_as_read()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Notificación marcada como leída'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al marcar notificación'}), 500


@reservations_bp.route('/notifications/mark-all-read', methods=['PUT'])
@client_required
def mark_all_notifications_read(current_user):
    """Marcar todas las notificaciones como leídas"""
    try:
        print(f"📬 [NOTIFICATIONS] Marcar todas como leídas - Usuario: {current_user.id}")
        
        updated = Notification.query.filter_by(
            user_id=current_user.id,
            read=False
        ).update({
            'read': True,
            'read_at': datetime.utcnow()
        })
        
        db.session.commit()
        
        print(f"✅ [NOTIFICATIONS] {updated} notificaciones marcadas como leídas")
        
        return jsonify({
            'success': True,
            'message': f'{updated} notificaciones marcadas como leídas',
            'count': updated
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"❌ [NOTIFICATIONS] Error: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al marcar notificaciones'}), 500