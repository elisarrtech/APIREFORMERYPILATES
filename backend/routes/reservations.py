from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, ClassSchedule, Reservation, UserPackage
from datetime import datetime
import logging

# Configurar logging
LOG = logging.getLogger(__name__)

bp = Blueprint('reservations', __name__, url_prefix='/api/v1/reservations')


# ============================================================================
# EXCEPTIONS
# ============================================================================

class ValidationError(Exception):
    """Error de validación"""
    pass


class NotFoundError(Exception):
    """Recurso no encontrado"""
    pass


class BusinessError(Exception):
    """Error de lógica de negocio"""
    pass


# ============================================================================
# ENDPOINTS
# ============================================================================

@bp.route('', methods=['POST'])
@jwt_required()
def create_reservation():
    """Crea una nueva reserva para un horario"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        LOG.info(f"Usuario {current_user_id} intentando reservar")
        LOG.info(f"Datos recibidos: {data}")
        
        # Validar datos requeridos
        if 'schedule_id' not in data:
            raise ValidationError("schedule_id es requerido")
        
        schedule_id = int(data['schedule_id'])
        
        # Obtener el horario
        schedule = ClassSchedule.query.get(schedule_id)
        if not schedule:
            raise NotFoundError(f"Horario con ID {schedule_id} no encontrado")
        
        LOG.info(f"Horario encontrado: {schedule.pilates_class.name if schedule.pilates_class else 'N/A'} - {schedule.start_time}")
        
        # Verificar que el horario esté disponible
        if schedule.status != 'scheduled':
            raise BusinessError(f"El horario está {schedule.status}, no se puede reservar")
        
        # Verificar que haya cupos disponibles
        if schedule.available_spots <= 0:
            raise BusinessError("No hay cupos disponibles para este horario")
        
        LOG.info(f"Cupos disponibles: {schedule.available_spots}")
        
        # Verificar que el usuario no tenga ya una reserva para este horario
        existing_reservation = Reservation.query.filter_by(
            user_id=current_user_id,
            schedule_id=schedule_id
        ).filter(
            Reservation.status.in_(['confirmed', 'pending'])
        ).first()
        
        if existing_reservation:
            raise BusinessError("Ya tienes una reserva para este horario")
        
        # Obtener el usuario
        user = User.query.get(current_user_id)
        if not user:
            raise NotFoundError("Usuario no encontrado")
        
        LOG.info(f"Usuario: {user.full_name}")
        
        # Verificar que el usuario tenga un paquete activo con clases disponibles
        active_package = UserPackage.query.filter_by(
            user_id=current_user_id,
            status='active'
        ).filter(
            UserPackage.remaining_classes > 0
        ).first()
        
        if not active_package:
            raise BusinessError("No tienes un paquete activo con clases disponibles")
        
        LOG.info(f"Paquete activo encontrado: {active_package.package.name if active_package.package else 'N/A'}")
        LOG.info(f"Clases restantes: {active_package.remaining_classes}")
        
        # Crear la reserva
        reservation = Reservation(
            user_id=current_user_id,
            schedule_id=schedule_id,
            user_package_id=active_package.id,
            status='confirmed',
            reservation_date=datetime.utcnow()
        )
        
        db.session.add(reservation)
        
        # Actualizar clases restantes del paquete
        active_package.remaining_classes -= 1
        active_package.used_classes += 1
        
        # Actualizar cupos disponibles del horario
        schedule.available_spots -= 1
        
        db.session.commit()
        
        LOG.info(f"Reserva creada exitosamente con ID: {reservation.id}")
        LOG.info(f"Clases restantes del usuario: {active_package.remaining_classes}")
        LOG.info(f"Cupos disponibles del horario: {schedule.available_spots}")
        
        return jsonify({
            'success': True,
            'message': 'Reserva creada exitosamente',
            'data': {
                'id': reservation.id,
                'schedule_id': schedule_id,
                'class_name': schedule.pilates_class.name if schedule.pilates_class else None,
                'instructor_name': schedule.instructor.user.full_name if schedule.instructor and schedule.instructor.user else None,
                'start_time': schedule.start_time.isoformat() if schedule.start_time else None,
                'status': reservation.status,
                'remaining_classes': active_package.remaining_classes
            }
        }), 201
        
    except ValidationError as e:
        LOG.error(f"Error de validación: {str(e)}")
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        LOG.error(f"Error not found: {str(e)}")
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except BusinessError as e:
        LOG.error(f"Error de negocio: {str(e)}")
        return jsonify({'success': False, 'error': 'business_error', 'message': str(e)}), 400
    except Exception as e:
        LOG.error(f"Error general: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': f'Error al crear reserva: {str(e)}'}), 500


@bp.route('', methods=['GET'])
@jwt_required()
def get_user_reservations():
    """Obtiene las reservas del usuario actual"""
    try:
        current_user_id = get_jwt_identity()
        
        LOG.info(f"Obteniendo reservas del usuario {current_user_id}")
        
        # Obtener reservas del usuario
        reservations = Reservation.query.filter_by(
            user_id=current_user_id
        ).order_by(
            Reservation.reservation_date.desc()
        ).all()
        
        reservations_data = []
        for reservation in reservations:
            schedule = reservation.schedule
            reservations_data.append({
                'id': reservation.id,
                'schedule_id': reservation.schedule_id,
                'class_name': schedule.pilates_class.name if schedule and schedule.pilates_class else None,
                'instructor_name': schedule.instructor.user.full_name if schedule and schedule.instructor and schedule.instructor.user else None,
                'start_time': schedule.start_time.isoformat() if schedule and schedule.start_time else None,
                'end_time': schedule.end_time.isoformat() if schedule and schedule.end_time else None,
                'status': reservation.status,
                'reservation_date': reservation.reservation_date.isoformat() if reservation.reservation_date else None
            })
        
        LOG.info(f"Encontradas {len(reservations_data)} reservas")
        
        return jsonify({
            'success': True,
            'data': reservations_data,
            'total': len(reservations_data)
        }), 200
        
    except Exception as e:
        LOG.error(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'server_error', 'message': str(e)}), 500


@bp.route('/<int:reservation_id>', methods=['DELETE'])
@jwt_required()
def cancel_reservation(reservation_id):
    """Cancela una reserva"""
    try:
        current_user_id = get_jwt_identity()
        
        LOG.info(f"Usuario {current_user_id} cancelando reserva {reservation_id}")
        
        # Obtener la reserva
        reservation = Reservation.query.get(reservation_id)
        if not reservation:
            raise NotFoundError("Reserva no encontrada")
        
        # Verificar que la reserva pertenezca al usuario
        if reservation.user_id != current_user_id:
            raise BusinessError("No tienes permiso para cancelar esta reserva")
        
        # Verificar que la reserva esté confirmada
        if reservation.status != 'confirmed':
            raise BusinessError(f"La reserva ya está {reservation.status}")
        
        # Cancelar la reserva
        reservation.status = 'cancelled'
        
        # Devolver el cupo al horario
        schedule = reservation.schedule
        if schedule:
            schedule.available_spots += 1
        
        # Devolver la clase al paquete del usuario
        if reservation.user_package:
            reservation.user_package.remaining_classes += 1
            reservation.user_package.used_classes -= 1
        
        db.session.commit()
        
        LOG.info(f"Reserva {reservation_id} cancelada exitosamente")
        
        return jsonify({
            'success': True,
            'message': 'Reserva cancelada exitosamente'
        }), 200
        
    except NotFoundError as e:
        LOG.error(f"Error: {str(e)}")
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except BusinessError as e:
        LOG.error(f"Error: {str(e)}")
        return jsonify({'success': False, 'error': 'business_error', 'message': str(e)}), 400
    except Exception as e:
        LOG.error(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': str(e)}), 500


@bp.route('/<int:reservation_id>', methods=['GET'])
@jwt_required()
def get_reservation(reservation_id):
    """Obtiene los detalles de una reserva"""
    try:
        current_user_id = get_jwt_identity()
        
        # Obtener la reserva
        reservation = Reservation.query.get(reservation_id)
        if not reservation:
            raise NotFoundError("Reserva no encontrada")
        
        # Verificar que la reserva pertenezca al usuario
        if reservation.user_id != current_user_id:
            raise BusinessError("No tienes permiso para ver esta reserva")
        
        schedule = reservation.schedule
        
        return jsonify({
            'success': True,
            'data': {
                'id': reservation.id,
                'schedule_id': reservation.schedule_id,
                'class_name': schedule.pilates_class.name if schedule and schedule.pilates_class else None,
                'instructor_name': schedule.instructor.user.full_name if schedule and schedule.instructor and schedule.instructor.user else None,
                'start_time': schedule.start_time.isoformat() if schedule and schedule.start_time else None,
                'end_time': schedule.end_time.isoformat() if schedule and schedule.end_time else None,
                'status': reservation.status,
                'reservation_date': reservation.reservation_date.isoformat() if reservation.reservation_date else None
            }
        }), 200
        
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except BusinessError as e:
        return jsonify({'success': False, 'error': 'business_error', 'message': str(e)}), 400
    except Exception as e:
        LOG.error(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'server_error', 'message': str(e)}), 500