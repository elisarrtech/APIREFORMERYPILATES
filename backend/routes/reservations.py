"""
Reservations Routes - Sistema de Reservas de Clases
Autor: @elisarrtech con Elite AI Architect
Código de Élite Mundial - Production Ready

Este módulo maneja toda la lógica de reservas de clases de Pilates:
- Creación de reservas
- Cancelación de reservas
- Consulta de horarios disponibles
- Estado de paquetes de usuario
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, ClassSchedule, Reservation, UserPackage
from datetime import datetime, timedelta
import logging

# Configurar logging profesional
LOG = logging.getLogger(__name__)

bp = Blueprint('reservations', __name__, url_prefix='/api/v1/reservations')


# ============================================================================
# CUSTOM EXCEPTIONS - Manejo Profesional de Errores
# ============================================================================

class ValidationError(Exception):
    """Error de validación de datos de entrada"""
    pass


class NotFoundError(Exception):
    """Recurso solicitado no encontrado en la base de datos"""
    pass


class BusinessError(Exception):
    """Error de lógica de negocio (reglas del sistema)"""
    pass


# ============================================================================
# ENDPOINTS - API REST
# ============================================================================

@bp.route('/schedules', methods=['GET'])
@jwt_required()
def get_weekly_schedules():
    """
    Obtiene los horarios de la semana con información de reservas del usuario.
    
    Query Parameters:
        - start_date (str, optional): Fecha de inicio en formato ISO (YYYY-MM-DD)
        - days (int, optional): Número de días a consultar (default: 7)
    
    Returns:
        JSON con lista de horarios disponibles y estado de reserva del usuario
    
    Example:
        GET /api/v1/reservations/schedules?start_date=2025-10-27&days=7
    """
    try:
        current_user_id = get_jwt_identity()
        
        # Obtener parámetros de query
        start_date_str = request.args.get('start_date')
        days = int(request.args.get('days', 7))
        
        # Calcular rango de fechas
        if start_date_str:
            try:
                start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
            except ValueError:
                raise ValidationError("Formato de fecha inválido. Use YYYY-MM-DD")
        else:
            # Inicio de la semana actual (lunes)
            now = datetime.utcnow()
            start_date = now - timedelta(days=now.weekday())
        
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(days=days)
        
        LOG.info(f"📅 Usuario {current_user_id} consultando horarios del {start_date.date()} al {end_date.date()}")
        
        # Obtener horarios del rango con joins optimizados
        schedules = ClassSchedule.query.filter(
            ClassSchedule.start_time >= start_date,
            ClassSchedule.start_time < end_date,
            ClassSchedule.status == 'scheduled'
        ).order_by(ClassSchedule.start_time).all()
        
        LOG.info(f"✅ Encontrados {len(schedules)} horarios programados")
        
        # Serializar con información de reserva del usuario
        schedules_data = [
            schedule.to_dict(include_user_reservation=True, user_id=current_user_id)
            for schedule in schedules
        ]
        
        return jsonify({
            'success': True,
            'data': schedules_data,
            'total': len(schedules_data),
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat()
        }), 200
        
    except ValidationError as e:
        LOG.error(f"❌ Error de validación: {str(e)}")
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except Exception as e:
        LOG.error(f"❌ Error inesperado al obtener horarios: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': 'server_error',
            'message': 'Error al obtener horarios'
        }), 500


@bp.route('/package-status', methods=['GET'])
@jwt_required()
def get_package_status():
    """
    Obtiene el estado del paquete activo del usuario autenticado.
    
    Returns:
        JSON con información del paquete activo (clases restantes, fecha de vencimiento, etc.)
    
    Example:
        GET /api/v1/reservations/package-status
        
        Response:
        {
            "success": true,
            "data": {
                "has_active_package": true,
                "remaining_classes": 8,
                "total_classes": 12,
                "expiry_date": "2025-11-27T00:00:00",
                "can_reserve": true
            }
        }
    """
    try:
        current_user_id = get_jwt_identity()
        
        LOG.info(f"📦 Usuario {current_user_id} consultando estado de paquete")
        
        # Obtener usuario
        user = User.query.get(current_user_id)
        if not user:
            raise NotFoundError("Usuario no encontrado")
        
        # Obtener paquete activo usando el método del modelo
        active_package = user.get_active_package()
        
        if not active_package:
            LOG.info(f"⚠️ Usuario {current_user_id} no tiene paquete activo")
            return jsonify({
                'success': True,
                'data': {
                    'has_active_package': False,
                    'remaining_classes': 0,
                    'total_classes': 0,
                    'used_classes': 0,
                    'expiry_date': None,
                    'status': 'no_package',
                    'can_reserve': False
                }
            }), 200
        
        # Actualizar estado antes de devolver
        active_package.update_status()
        db.session.commit()
        
        LOG.info(f"✅ Paquete activo: {active_package.package.name}, {active_package.remaining_classes} clases restantes")
        
        return jsonify({
            'success': True,
            'data': {
                'has_active_package': True,
                'package_id': active_package.id,
                'package_name': active_package.package.name if active_package.package else None,
                'remaining_classes': active_package.remaining_classes,
                'total_classes': active_package.total_classes,
                'used_classes': active_package.used_classes,
                'purchase_date': active_package.purchase_date.isoformat() if active_package.purchase_date else None,
                'expiry_date': active_package.expiry_date.isoformat() if active_package.expiry_date else None,
                'status': active_package.status,
                'can_reserve': active_package.can_reserve()
            }
        }), 200
        
    except NotFoundError as e:
        LOG.error(f"❌ {str(e)}")
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        LOG.error(f"❌ Error al obtener estado de paquete: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al consultar paquete'}), 500


@bp.route('', methods=['POST'])
@jwt_required()
def create_reservation():
    """
    Crea una nueva reserva para un horario específico.
    
    Body JSON:
        {
            "schedule_id": int  // ID del horario a reservar
        }
    
    Returns:
        JSON con la reserva creada
    
    Validaciones:
        - Usuario debe tener paquete activo con clases disponibles
        - Horario debe estar disponible (no lleno, no cancelado)
        - Usuario no debe tener ya una reserva para ese horario
        - Horario no debe haber iniciado
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        LOG.info(f"🎯 Usuario {current_user_id} intentando crear reserva")
        LOG.info(f"📝 Datos recibidos: {data}")
        
        # Validar datos de entrada
        if not data or 'schedule_id' not in data:
            raise ValidationError("El campo 'schedule_id' es requerido")
        
        try:
            schedule_id = int(data['schedule_id'])
        except (ValueError, TypeError):
            raise ValidationError("El 'schedule_id' debe ser un número entero válido")
        
        # Obtener el horario
        schedule = ClassSchedule.query.get(schedule_id)
        if not schedule:
            raise NotFoundError(f"Horario con ID {schedule_id} no encontrado")
        
        LOG.info(f"📚 Horario encontrado: {schedule.class_name} - {schedule.start_time}")
        
        # Validar que el horario pueda ser reservado (usa método del modelo)
        if not schedule.can_be_reserved():
            if schedule.status != 'scheduled':
                raise BusinessError(f"El horario está {schedule.status} y no puede ser reservado")
            elif schedule.start_time <= datetime.utcnow():
                raise BusinessError("No puedes reservar un horario que ya ha iniciado")
            elif schedule.is_full:
                raise BusinessError("No hay cupos disponibles para este horario")
            else:
                raise BusinessError("El horario no está disponible para reservar")
        
        LOG.info(f"✅ Cupos disponibles: {schedule.available_spots}/{schedule.max_capacity}")
        
        # Verificar que el usuario no tenga ya una reserva (usa método del modelo)
        if schedule.has_reservation_from_user(current_user_id):
            raise BusinessError("Ya tienes una reserva para este horario")
        
        # Obtener usuario y su paquete activo
        user = User.query.get(current_user_id)
        if not user:
            raise NotFoundError("Usuario no encontrado")
        
        # Usar método del modelo para obtener paquete activo
        active_package = user.get_active_package()
        if not active_package:
            raise BusinessError(
                "No tienes un paquete activo. "
                "Por favor, adquiere un paquete para reservar clases."
            )
        
        # Validar que el paquete pueda ser usado (método del modelo)
        if not active_package.can_reserve():
            if active_package.status == 'expired':
                raise BusinessError("Tu paquete ha expirado. Adquiere uno nuevo para continuar.")
            elif active_package.status == 'exhausted':
                raise BusinessError("Has agotado todas las clases de tu paquete.")
            else:
                raise BusinessError(f"Tu paquete está {active_package.status}. No puedes reservar clases.")
        
        LOG.info(f"👤 Usuario: {user.full_name}")
        LOG.info(f"📦 Paquete: {active_package.package.name if active_package.package else 'N/A'}")
        LOG.info(f"🎟️ Clases restantes antes de reservar: {active_package.remaining_classes}")
        
        # Crear la reserva
        reservation = Reservation(
            user_id=current_user_id,
            schedule_id=schedule_id,
            user_package_id=active_package.id,
            status='confirmed',
            reservation_date=datetime.utcnow()
        )
        
        db.session.add(reservation)
        
        # Usar clase del paquete (método del modelo que valida automáticamente)
        active_package.use_class()
        
        # Commit de la transacción
        db.session.commit()
        
        LOG.info(f"✅ Reserva creada exitosamente con ID: {reservation.id}")
        LOG.info(f"📊 Clases restantes después de reservar: {active_package.remaining_classes}")
        LOG.info(f"📊 Cupos restantes en horario: {schedule.available_spots}")
        
        return jsonify({
            'success': True,
            'message': 'Reserva creada exitosamente',
            'data': {
                'reservation_id': reservation.id,
                'schedule_id': schedule_id,
                'class_name': schedule.class_name,
                'instructor_name': schedule.instructor_name,
                'start_time': schedule.start_time.isoformat() if schedule.start_time else None,
                'end_time': schedule.end_time.isoformat() if schedule.end_time else None,
                'status': reservation.status,
                'remaining_classes': active_package.remaining_classes,
                'available_spots': schedule.available_spots
            }
        }), 201
        
    except ValidationError as e:
        LOG.error(f"❌ Error de validación: {str(e)}")
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        LOG.error(f"❌ Recurso no encontrado: {str(e)}")
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except BusinessError as e:
        LOG.error(f"❌ Error de negocio: {str(e)}")
        return jsonify({'success': False, 'error': 'business_error', 'message': str(e)}), 400
    except Exception as e:
        LOG.error(f"❌ Error inesperado al crear reserva: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'server_error',
            'message': 'Error al crear la reserva. Por favor, intenta nuevamente.'
        }), 500


@bp.route('', methods=['GET'])
@jwt_required()
def get_user_reservations():
    """
    Obtiene todas las reservas del usuario autenticado.
    
    Query Parameters:
        - status (str, optional): Filtrar por estado (confirmed, cancelled, completed, no_show)
        - include_past (bool, optional): Incluir reservas pasadas (default: true)
    
    Returns:
        JSON con lista de reservas del usuario
    
    Example:
        GET /api/v1/reservations?status=confirmed&include_past=false
    """
    try:
        current_user_id = get_jwt_identity()
        
        # Obtener parámetros de filtrado
        status_filter = request.args.get('status')
        include_past = request.args.get('include_past', 'true').lower() == 'true'
        
        LOG.info(f"📋 Obteniendo reservas del usuario {current_user_id} (status={status_filter}, past={include_past})")
        
        # Query base
        query = Reservation.query.filter_by(user_id=current_user_id)
        
        # Filtrar por estado si se especifica
        if status_filter:
            valid_statuses = ['confirmed', 'cancelled', 'completed', 'no_show']
            if status_filter not in valid_statuses:
                raise ValidationError(f"Estado inválido. Use uno de: {', '.join(valid_statuses)}")
            query = query.filter_by(status=status_filter)
        
        # Excluir reservas pasadas si se solicita
        if not include_past:
            query = query.join(ClassSchedule).filter(
                ClassSchedule.start_time > datetime.utcnow()
            )
        
        reservations = query.order_by(Reservation.reservation_date.desc()).all()
        
        LOG.info(f"✅ Encontradas {len(reservations)} reservas")
        
        # Serializar con detalles del horario
        reservations_data = []
        for reservation in reservations:
            res_dict = reservation.to_dict(include_details=False)
            
            # Agregar información completa del horario
            if reservation.schedule:
                res_dict['schedule'] = {
                    'id': reservation.schedule.id,
                    'class_name': reservation.schedule.class_name,
                    'class_color': reservation.schedule.class_color,
                    'instructor_name': reservation.schedule.instructor_name,
                    'start_time': reservation.schedule.start_time.isoformat() if reservation.schedule.start_time else None,
                    'end_time': reservation.schedule.end_time.isoformat() if reservation.schedule.end_time else None,
                    'duration': reservation.schedule.duration,
                    'status': reservation.schedule.status
                }
            
            reservations_data.append(res_dict)
        
        return jsonify({
            'success': True,
            'data': reservations_data,
            'total': len(reservations_data)
        }), 200
        
    except ValidationError as e:
        LOG.error(f"❌ Error de validación: {str(e)}")
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except Exception as e:
        LOG.error(f"❌ Error al obtener reservas: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al consultar reservas'}), 500


@bp.route('/<int:reservation_id>', methods=['DELETE'])
@jwt_required()
def cancel_reservation(reservation_id):
    """
    Cancela una reserva existente y devuelve la clase al paquete del usuario.
    
    Path Parameters:
        reservation_id (int): ID de la reserva a cancelar
    
    Body JSON (opcional):
        {
            "reason": "Motivo de cancelación"
        }
    
    Returns:
        JSON confirmando la cancelación
    
    Validaciones:
        - La reserva debe pertenecer al usuario
        - La reserva debe estar en estado 'confirmed'
        - La clase no debe haber iniciado
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json() or {}
        reason = data.get('reason')
        
        LOG.info(f"❌ Usuario {current_user_id} intentando cancelar reserva {reservation_id}")
        
        # Obtener la reserva
        reservation = Reservation.query.get(reservation_id)
        if not reservation:
            raise NotFoundError(f"Reserva con ID {reservation_id} no encontrada")
        
        # Verificar permisos
        if reservation.user_id != current_user_id:
            raise BusinessError("No tienes permiso para cancelar esta reserva")
        
        # Validar que la reserva pueda ser cancelada (método del modelo)
        if not reservation.can_be_cancelled():
            if reservation.status != 'confirmed':
                raise BusinessError(f"La reserva ya está {reservation.status} y no puede ser cancelada")
            elif reservation.schedule and reservation.schedule.start_time <= datetime.utcnow():
                raise BusinessError("No puedes cancelar una clase que ya ha iniciado")
            else:
                raise BusinessError("Esta reserva no puede ser cancelada")
        
        LOG.info(f"📝 Cancelando reserva: {reservation.schedule.class_name if reservation.schedule else 'N/A'}")
        
        # Cancelar usando el método del modelo (maneja toda la lógica)
        reservation.cancel(reason=reason)
        
        # Commit de la transacción
        db.session.commit()
        
        LOG.info(f"✅ Reserva {reservation_id} cancelada exitosamente")
        LOG.info(f"📦 Clase devuelta. Clases restantes: {reservation.user_package.remaining_classes if reservation.user_package else 'N/A'}")
        
        return jsonify({
            'success': True,
            'message': 'Reserva cancelada exitosamente',
            'data': {
                'reservation_id': reservation_id,
                'remaining_classes': reservation.user_package.remaining_classes if reservation.user_package else 0
            }
        }), 200
        
    except NotFoundError as e:
        LOG.error(f"❌ {str(e)}")
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except BusinessError as e:
        LOG.error(f"❌ {str(e)}")
        return jsonify({'success': False, 'error': 'business_error', 'message': str(e)}), 400
    except Exception as e:
        LOG.error(f"❌ Error al cancelar reserva: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'server_error',
            'message': 'Error al cancelar la reserva. Por favor, intenta nuevamente.'
        }), 500


@bp.route('/<int:reservation_id>', methods=['GET'])
@jwt_required()
def get_reservation(reservation_id):
    """
    Obtiene los detalles completos de una reserva específica.
    
    Path Parameters:
        reservation_id (int): ID de la reserva
    
    Returns:
        JSON con detalles completos de la reserva
    """
    try:
        current_user_id = get_jwt_identity()
        
        LOG.info(f"📄 Usuario {current_user_id} consultando reserva {reservation_id}")
        
        # Obtener la reserva
        reservation = Reservation.query.get(reservation_id)
        if not reservation:
            raise NotFoundError(f"Reserva con ID {reservation_id} no encontrada")
        
        # Verificar permisos (TODO: permitir a admin/instructor ver todas)
        if reservation.user_id != current_user_id:
            raise BusinessError("No tienes permiso para ver esta reserva")
        
        # Serializar con detalles completos
        res_data = reservation.to_dict(include_details=True)
        
        # Agregar información completa del horario
        if reservation.schedule:
            res_data['schedule'] = reservation.schedule.to_dict()
        
        LOG.info(f"✅ Reserva encontrada: {reservation.schedule.class_name if reservation.schedule else 'N/A'}")
        
        return jsonify({
            'success': True,
            'data': res_data
        }), 200
        
    except NotFoundError as e:
        LOG.error(f"❌ {str(e)}")
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except BusinessError as e:
        LOG.error(f"❌ {str(e)}")
        return jsonify({'success': False, 'error': 'business_error', 'message': str(e)}), 400
    except Exception as e:
        LOG.error(f"❌ Error al consultar reserva: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al consultar la reserva'}), 500