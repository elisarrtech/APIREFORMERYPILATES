"""
ClassNote Model - Notas de clases e instructores
@author @elisarrtech
@date 2025-10-28
"""

from app import db
from datetime import datetime


class ClassNote(db.Model):
    """
    Modelo de Notas de Clases
    Permite a instructores registrar notas sobre clases y alumnos
    """
    
    __tablename__ = 'class_notes'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Keys
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedules.id'), nullable=False, index=True)
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True, index=True)
    
    # Contenido
    note_type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships - ✅ CORRECCIÓN: cambiar 'notes' por 'class_notes'
    schedule = db.relationship('Schedule', backref=db.backref('class_notes', lazy='dynamic'))
    instructor = db.relationship('User', foreign_keys=[instructor_id], backref=db.backref('instructor_notes', lazy='dynamic'))
    student = db.relationship('User', foreign_keys=[user_id], backref=db.backref('student_notes', lazy='dynamic'))
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'schedule_id': self.schedule_id,
            'instructor_id': self.instructor_id,
            'user_id': self.user_id,
            'student_name': self.student.full_name if self.student else None,
            'note_type': self.note_type,
            'title': self.title,
            'content': self.content,
            'rating': self.rating,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'class_name': self.schedule.pilates_class.name if self.schedule and self.schedule.pilates_class else None,
            'class_date': self.schedule.date.isoformat() if self.schedule and self.schedule.date else None
        }
    
    def __repr__(self):
        return f'<ClassNote Instructor:{self.instructor_id} Schedule:{self.schedule_id} Type:{self.note_type}>'