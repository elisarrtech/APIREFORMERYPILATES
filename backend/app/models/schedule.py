"""
Schedule Model
Modelo de horarios de clases programadas

@version 2.0.0
@author @elisarrtech
@date 2025-10-27
"""

from app import db
from datetime import datetime


class Schedule(db.Model):
    """
    Modelo de Horarios de Clases
    
    Representa los horarios programados de clases con instructores
    """
    
    __tablename__ = 'schedules'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Keys
    class_id = db.Column(db.Integer, db.ForeignKey('pilates_classes.id'), nullable=False, index=True)
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Fecha y hora
    date = db.Column(db.Date, nullable=False, index=True)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    
    # Capacidad
    max_capacity = db.Column(db.Integer, nullable=False, default=10)
    current_capacity = db.Column(db.Integer, nullable=False, default=0)
    available_spots = db.Column(db.Integer, nullable=False, default=10)
    
    # Estado
    status = db.Column(db.String(20), nullable=False, default='scheduled')  # scheduled, cancelled, completed
    active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Notas
    notes = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    pilates_class = db.relationship('PilatesClass', backref=db.backref('schedules', lazy='dynamic'))
    instructor = db.relationship('User', foreign_keys=[instructor_id], backref=db.backref('instructor_schedules', lazy='dynamic'))
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'class_id': self.class_id,
            'class_name': self.pilates_class.name if self.pilates_class else None,
            'instructor_id': self.instructor_id,
            'instructor_name': self.instructor.full_name if self.instructor else None,
            'date': self.date.isoformat() if self.date else None,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'max_capacity': self.max_capacity,
            'current_capacity': self.current_capacity,
            'available_spots': self.available_spots,
            'status': self.status,
            'active': self.active,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Schedule {self.pilates_class.name if self.pilates_class else "Unknown"} - {self.date} {self.start_time}>'