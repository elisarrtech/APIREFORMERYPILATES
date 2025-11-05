"""
Reservation Service - Lógica de negocio para reservas
@author @elisarrtech
"""

from app import db
from app.models.reservation import Reservation
from app.models.waitlist import Waitlist
from app.models.notification import Notification
from app.models.schedule import Schedule
from app.models.user_package import UserPackage
from datetime import datetime


class ReservationService:
    """Servicio profesional de gestión de reservas"""
    
    @staticmethod
    def create_reservation(user_id, schedule_id):
        """Crear reserva con validaciones"""
        # Validar
        can_reserve, message, user_package = Reservation.can_user_reserve(user_id, schedule_id)
        
        if not can_reserve:
            if "llena" in message.lower():
                # Agregar a lista de espera
                return ReservationService.add_to_waitlist(user_id, schedule_id)
            return {'success': False, 'message': message, 'waitlisted': False}
        
        # Crear reserva
        reservation = Reservation(
            user_id=user_id,
            schedule_id=schedule_id,
            user_package_id=user_package.id if user_package else None,
            status='confirmed',
            attended=False
        )
        
        # Usar clase del paquete
        if user_package:
            user_package.use_class()
        
        db.session.add(reservation)
        db.session.commit()
        
        # Notificar
        notification = Notification(
            user_id=user_id,
            title='Reserva Confirmada',
            message=f'Tu reserva para {reservation.schedule.pilates_class.name} ha sido confirmada',
            type='success',
            related_type='reservation',
            related_id=reservation.id
        )
        db.session.add(notification)
        db.session.commit()
        
        return {'success': True, 'message': 'Reserva creada exitosamente', 'data': reservation.to_dict(), 'waitlisted': False}
    
    @staticmethod
    def cancel_reservation(reservation_id, user_id):
        """Cancelar reserva con validaciones"""
        reservation = Reservation.query.filter_by(id=reservation_id, user_id=user_id).first()
        
        if not reservation:
            return {'success': False, 'message': 'Reserva no encontrada'}
        
        try:
            reservation.cancel_with_validation(reason="Cancelación por usuario")
            db.session.commit()
            
            # Notificar
            notification = Notification(
                user_id=user_id,
                title='Reserva Cancelada',
                message=f'Tu reserva ha sido cancelada exitosamente',
                type='info',
                related_type='reservation',
                related_id=reservation.id
            )
            db.session.add(notification)
            db.session.commit()
            
            # Procesar lista de espera
            ReservationService.process_waitlist(reservation.schedule_id)
            
            return {'success': True, 'message': 'Reserva cancelada exitosamente'}
            
        except ValueError as e:
            return {'success': False, 'message': str(e)}
    
    @staticmethod
    def add_to_waitlist(user_id, schedule_id):
        """Agregar a lista de espera"""
        # Verificar que no esté ya en la lista
        existing = Waitlist.query.filter_by(
            user_id=user_id,
            schedule_id=schedule_id,
            status='waiting'
        ).first()
        
        if existing:
            return {'success': False, 'message': 'Ya estás en la lista de espera', 'waitlisted': True}
        
        # Calcular posición
        position = Waitlist.query.filter_by(schedule_id=schedule_id, status='waiting').count() + 1
        
        # Crear entrada
        waitlist_entry = Waitlist(
            user_id=user_id,
            schedule_id=schedule_id,
            position=position,
            status='waiting'
        )
        
        db.session.add(waitlist_entry)
        db.session.commit()
        
        # Notificar
        notification = Notification(
            user_id=user_id,
            title='Agregado a Lista de Espera',
            message=f'Has sido agregado a la lista de espera (posición {position})',
            type='info',
            related_type='waitlist',
            related_id=waitlist_entry.id
        )
        db.session.add(notification)
        db.session.commit()
        
        return {'success': True, 'message': f'Agregado a lista de espera (posición {position})', 'waitlisted': True, 'position': position}
    
    @staticmethod
    def process_waitlist(schedule_id):
        """Procesar lista de espera cuando se libera un cupo"""
        schedule = Schedule.query.get(schedule_id)
        if not schedule:
            return
        
        # Verificar si hay cupo
        current_reservations = Reservation.query.filter_by(
            schedule_id=schedule_id,
            status='confirmed'
        ).count()
        
        if current_reservations >= schedule.max_capacity:
            return
        
        # Obtener siguiente en lista de espera
        waitlist_entry = Waitlist.query.filter_by(
            schedule_id=schedule_id,
            status='waiting'
        ).order_by(Waitlist.position).first()
        
        if not waitlist_entry:
            return
        
        # Notificar disponibilidad
        waitlist_entry.notify()
        db.session.commit()
        
        notification = Notification(
            user_id=waitlist_entry.user_id,
            title='¡Cupo Disponible!',
            message=f'Hay un cupo disponible en {schedule.pilates_class.name}. Reserva ahora.',
            type='waitlist_available',
            related_type='waitlist',
            related_id=waitlist_entry.id
        )
        db.session.add(notification)
        db.session.commit()