"""
Waitlist Model
Modelo de lista de espera para clases llenas

@version 2.0.0
@author @elisarrtech
@date 2025-10-28
"""

from app import db
from datetime import datetime


class Waitlist(db.Model):
    """
    Modelo de Lista de Espera
    
    Representa los usuarios en lista de espera para clases llenas
    """
    
    __tablename__ = 'waitlist'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedules.id'), nullable=False, index=True)
    
    # Información de la lista de espera
    position = db.Column(db.Integer, nullable=False)  # Posición en la lista
    status = db.Column(db.String(20), nullable=False, default='waiting')  # waiting, notified, enrolled, cancelled
    
    # Notificación
    notified_at = db.Column(db.DateTime, nullable=True)
    enrolled_at = db.Column(db.DateTime, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('waitlist_entries', lazy='dynamic'))
    schedule = db.relationship('Schedule', backref=db.backref('waitlist_entries', lazy='dynamic'))
    
    def notify(self):
        """Notificar al usuario que hay espacio disponible"""
        self.status = 'notified'
        self.notified_at = datetime.utcnow()
    
    def enroll(self):
        """Marcar como inscrito"""
        self.status = 'enrolled'
        self.enrolled_at = datetime.utcnow()
    
    def cancel(self):
        """Cancelar de la lista de espera"""
        self.status = 'cancelled'
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.full_name if self.user else None,
            'schedule_id': self.schedule_id,
            'class_name': self.schedule.pilates_class.name if self.schedule and self.schedule.pilates_class else None,
            'schedule_date': self.schedule.date.isoformat() if self.schedule and self.schedule.date else None,
            'schedule_time': self.schedule.start_time.isoformat() if self.schedule and self.schedule.start_time else None,
            'position': self.position,
            'status': self.status,
            'notified_at': self.notified_at.isoformat() if self.notified_at else None,
            'enrolled_at': self.enrolled_at.isoformat() if self.enrolled_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Waitlist User:{self.user_id} Schedule:{self.schedule_id} Position:{self.position}>'