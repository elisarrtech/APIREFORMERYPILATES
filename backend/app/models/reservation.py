"""
Reservation Model
Modelo de reservas de clases

@version 2.0.0
@author @elisarrtech
@date 2025-10-28
"""

from app import db
from datetime import datetime, timedelta, date


class Reservation(db.Model):
    """
    Modelo de Reservas
    
    Representa las reservas de usuarios a horarios de clases
    """
    
    __tablename__ = 'reservations'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedules.id'), nullable=False, index=True)
    user_package_id = db.Column(db.Integer, db.ForeignKey('user_packages.id'), nullable=True, index=True)
    
    # Estado de la reserva
    status = db.Column(db.String(20), nullable=False, default='confirmed')  # confirmed, cancelled, attended, no_show
    
    # Fecha de reserva
    reservation_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Cancelación
    cancelled_at = db.Column(db.DateTime, nullable=True)
    cancellation_reason = db.Column(db.Text, nullable=True)
    
    # Asistencia
    attended = db.Column(db.Boolean, default=False, nullable=False)
    attendance_marked_at = db.Column(db.DateTime, nullable=True)
    
    # Notas
    notes = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('reservations', lazy='dynamic'))
    schedule = db.relationship('Schedule', backref=db.backref('reservations', lazy='dynamic'))
    user_package = db.relationship('UserPackage', backref=db.backref('reservations', lazy='dynamic'))
    
    def cancel(self, reason=None):
        """Cancel reservation"""
        self.status = 'cancelled'
        self.cancelled_at = datetime.utcnow()
        if reason:
            self.cancellation_reason = reason
        
        # Refund class to user package if applicable
        if self.user_package:
            self.user_package.refund_class()
    
    def mark_attended(self):
        """Mark as attended"""
        self.attended = True
        self.status = 'attended'
        self.attendance_marked_at = datetime.utcnow()
    
    def mark_no_show(self):
        """Mark as no show"""
        self.attended = False
        self.status = 'no_show'
        self.attendance_marked_at = datetime.utcnow()
    
    def can_cancel(self):
        """
        Verificar si la reserva puede ser cancelada
        Regla: Hasta 8 horas antes de la clase
        """
        if self.status == 'cancelled':
            return False, "La reserva ya está cancelada"
        
        if not self.schedule or not self.schedule.date or not self.schedule.start_time:
            return False, "Información de horario incompleta"
        
        # Combinar fecha y hora de la clase
        class_datetime = datetime.combine(self.schedule.date, self.schedule.start_time)
        
        # Calcular 8 horas antes
        cancellation_deadline = class_datetime - timedelta(hours=8)
        
        # Verificar si aún está dentro del plazo
        if datetime.utcnow() > cancellation_deadline:
            return False, "No se puede cancelar con menos de 8 horas de anticipación"
        
        return True, "Puede cancelar"
    
    def cancel_with_validation(self, reason=None):
        """Cancelar reserva con validación de tiempo"""
        can_cancel_result, message = self.can_cancel()
        
        if not can_cancel_result:
            raise ValueError(message)
        
        # Cancelar normalmente
        self.cancel(reason)
        
        # Refundar clase al paquete si aplica
        if self.user_package and self.user_package.active:
            self.user_package.refund_class()
        
        return True
    
    @staticmethod
    def count_user_reservations_in_week(user_id):
        """
        Contar reservas del usuario en la ventana de 7 días
        """
        from sqlalchemy import and_
        from app.models.schedule import Schedule
        
        today = date.today()
        week_end = today + timedelta(days=7)
        
        count = Reservation.query.join(Schedule).filter(
            and_(
                Reservation.user_id == user_id,
                Reservation.status.in_(['confirmed', 'attended']),
                Schedule.date >= today,
                Schedule.date <= week_end
            )
        ).count()
        
        return count
    
    @staticmethod
    def can_user_reserve(user_id, schedule_id):
        """
        Verificar si el usuario puede reservar una clase
        """
        from app.models.user_package import UserPackage
        from app.models.schedule import Schedule
        from sqlalchemy import and_
        
        # Verificar que el usuario tenga un paquete activo con clases disponibles
        active_package = UserPackage.query.filter(
            and_(
                UserPackage.user_id == user_id,
                UserPackage.active == True,
                UserPackage.status == 'active',
                UserPackage.classes_remaining > 0
            )
        ).first()
        
        if not active_package:
            return False, "No tienes clases disponibles en tu paquete", None
        
        # Verificar que no esté expirado
        if active_package.is_expired():
            return False, "Tu paquete ha expirado", None
        
        # Verificar que la clase esté en la ventana de 7 días
        schedule = Schedule.query.get(schedule_id)
        if not schedule:
            return False, "Horario no encontrado", None
        
        today = date.today()
        week_end = today + timedelta(days=7)
        
        if schedule.date < today:
            return False, "No puedes reservar clases pasadas", None
        
        if schedule.date > week_end:
            return False, "Solo puedes reservar clases dentro de los próximos 7 días", None
        
        # Verificar que el horario esté disponible
        if schedule.status == 'cancelled':
            return False, "Esta clase ha sido cancelada", None
        
        # Verificar que haya cupo
        current_reservations = Reservation.query.filter_by(
            schedule_id=schedule_id,
            status='confirmed'
        ).count()
        
        if current_reservations >= schedule.max_capacity:
            return False, "Esta clase está llena", None
        
        # Verificar que no tenga ya una reserva en esta clase
        existing_reservation = Reservation.query.filter(
            and_(
                Reservation.user_id == user_id,
                Reservation.schedule_id == schedule_id,
                Reservation.status.in_(['confirmed', 'attended'])
            )
        ).first()
        
        if existing_reservation:
            return False, "Ya tienes una reserva en esta clase", None
        
        return True, "Puedes reservar", active_package
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.full_name if self.user else None,
            'user_email': self.user.email if self.user else None,
            'schedule_id': self.schedule_id,
            'schedule_date': self.schedule.date.isoformat() if self.schedule and self.schedule.date else None,
            'schedule_time': self.schedule.start_time.isoformat() if self.schedule and self.schedule.start_time else None,
            'class_name': self.schedule.pilates_class.name if self.schedule and self.schedule.pilates_class else None,
            'instructor_name': self.schedule.instructor.full_name if self.schedule and self.schedule.instructor else None,
            'user_package_id': self.user_package_id,
            'status': self.status,
            'attended': self.attended,
            'reservation_date': self.reservation_date.isoformat() if self.reservation_date else None,
            'cancelled_at': self.cancelled_at.isoformat() if self.cancelled_at else None,
            'cancellation_reason': self.cancellation_reason,
            'attendance_marked_at': self.attendance_marked_at.isoformat() if self.attendance_marked_at else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Reservation User:{self.user_id} Schedule:{self.schedule_id} Status:{self.status}>'