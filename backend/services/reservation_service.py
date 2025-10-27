# services/reservation_service.py
# Servicio de lógica de negocio para reservas
# Autor: @elisarrtech con Elite AI Architect

from extensions import db
from models import Reservation, ClassSchedule, UserPackage
from utils.exceptions import ValidationError, ConflictError, NotFoundError
from datetime import datetime


class ReservationService:
    # Servicio para gestionar reservas
    
    @staticmethod
    def create_reservation(user_id, schedule_id):
        # Crea una nueva reserva
        
        # Verificar que el horario existe
        schedule = ClassSchedule.query.get(schedule_id)
        if not schedule:
            raise NotFoundError("Horario no encontrado")
        
        # Verificar que el horario no ha pasado
        if schedule.start_time < datetime.utcnow():
            raise ValidationError("No se puede reservar un horario que ya pasó")
        
        # Verificar que hay espacios disponibles
        if schedule.is_full:
            raise ConflictError("La clase está llena")
        
        # Verificar que el usuario tiene un paquete activo
        user_package = UserPackage.query.filter_by(
            user_id=user_id,
            status='active'
        ).first()
        
        if not user_package:
            raise ValidationError("No tienes un paquete activo")
        
        # Verificar que tiene clases disponibles
        if user_package.remaining_classes <= 0:
            raise ValidationError("No tienes clases disponibles en tu paquete")
        
        # Verificar que no tiene una reserva duplicada
        existing = Reservation.query.filter_by(
            user_id=user_id,
            schedule_id=schedule_id,
            status='confirmed'
        ).first()
        
        if existing:
            raise ConflictError("Ya tienes una reserva para este horario")
        
        # Crear reserva
        reservation = Reservation(
            user_id=user_id,
            schedule_id=schedule_id,
            user_package_id=user_package.id,
            status='confirmed',
            reservation_date=datetime.utcnow()
        )
        
        # Actualizar contador del horario
        schedule.current_reservations += 1
        
        # Actualizar clases del paquete
        user_package.used_classes += 1
        user_package.remaining_classes -= 1
        user_package.update_status()
        
        db.session.add(reservation)
        db.session.commit()
        
        return reservation
    
    @staticmethod
    def cancel_reservation(reservation_id, user_id):
        # Cancela una reserva
        
        # Buscar reserva
        reservation = Reservation.query.get(reservation_id)
        
        if not reservation:
            raise NotFoundError("Reserva no encontrada")
        
        # Verificar que la reserva pertenece al usuario
        if reservation.user_id != user_id:
            raise ValidationError("No tienes permiso para cancelar esta reserva")
        
        # Verificar que la reserva está confirmada
        if reservation.status != 'confirmed':
            raise ValidationError("Solo se pueden cancelar reservas confirmadas")
        
        # Verificar tiempo mínimo de cancelación (2 horas)
        schedule = reservation.schedule
        hours_until_class = (schedule.start_time - datetime.utcnow()).total_seconds() / 3600
        
        if hours_until_class < 2:
            raise ValidationError("No se puede cancelar con menos de 2 horas de anticipación")
        
        # Cancelar reserva
        reservation.status = 'cancelled'
        reservation.cancellation_date = datetime.utcnow()
        
        # Actualizar contador del horario
        schedule.current_reservations -= 1
        
        # Devolver clase al paquete
        user_package = reservation.user_package
        user_package.used_classes -= 1
        user_package.remaining_classes += 1
        user_package.update_status()
        
        db.session.commit()
        
        return reservation
    
    @staticmethod
    def get_user_reservations(user_id, status='confirmed'):
        # Obtiene reservas de un usuario
        
        reservations = Reservation.query.filter_by(
            user_id=user_id,
            status=status
        ).order_by(Reservation.reservation_date.desc()).all()
        
        return reservations
    
    @staticmethod
    def mark_attendance(reservation_id, attended):
        # Marca asistencia de una reserva
        
        reservation = Reservation.query.get(reservation_id)
        
        if not reservation:
            raise NotFoundError("Reserva no encontrada")
        
        reservation.attended = attended
        db.session.commit()
        
        return reservation
