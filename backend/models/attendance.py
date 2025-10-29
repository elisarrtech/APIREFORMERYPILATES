"""
Modelo de Asistencia (Attendance)
Sistema de registro de asistencia para clases de Pilates
@version 1.0.0 - ÉLITE MUNDIAL
@author @elisarrtech
"""

from datetime import datetime
from extensions import db

class Attendance(db.Model):
    """
    Modelo para registrar la asistencia de alumnos a las clases
    """
    __tablename__ = 'attendance'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Foreign Keys
    student_id = db.Column(
        db.Integer, 
        db.ForeignKey('users.id', ondelete='CASCADE'), 
        nullable=False,
        index=True
    )
    schedule_id = db.Column(
        db.Integer, 
        db.ForeignKey('schedules.id', ondelete='CASCADE'), 
        nullable=False,
        index=True
    )
    
    # Attendance Data
    status = db.Column(
        db.String(20), 
        default='present',
        nullable=False
    )  # Opciones: 'present', 'absent', 'late', 'excused'
    
    # Timestamps
    marked_at = db.Column(
        db.DateTime, 
        default=datetime.utcnow,
        nullable=False
    )
    created_at = db.Column(
        db.DateTime, 
        default=datetime.utcnow,
        nullable=False
    )
    updated_at = db.Column(
        db.DateTime, 
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
    
    # Optional Fields
    notes = db.Column(db.Text, nullable=True)  # Notas del instructor
    marked_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Instructor que marcó
    
    # Relationships
    student = db.relationship(
        'User', 
        foreign_keys=[student_id],
        backref=db.backref('attendances', lazy='dynamic', cascade='all, delete-orphan')
    )
    schedule = db.relationship(
        'Schedule', 
        foreign_keys=[schedule_id],
        backref=db.backref('attendances', lazy='dynamic', cascade='all, delete-orphan')
    )
    instructor = db.relationship(
        'User',
        foreign_keys=[marked_by],
        backref='marked_attendances'
    )
    
    # Constraints
    __table_args__ = (
        db.UniqueConstraint('student_id', 'schedule_id', name='unique_attendance_per_schedule'),
        db.Index('idx_attendance_student', 'student_id'),
        db.Index('idx_attendance_schedule', 'schedule_id'),
        db.Index('idx_attendance_date', 'marked_at'),
    )
    
    def __init__(self, student_id, schedule_id, status='present', notes=None, marked_by=None):
        """
        Constructor del modelo Attendance
        """
        self.student_id = student_id
        self.schedule_id = schedule_id
        self.status = status
        self.notes = notes
        self.marked_by = marked_by
        self.marked_at = datetime.utcnow()
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def __repr__(self):
        """
        Representación string del objeto
        """
        return f'<Attendance {self.id}: Student {self.student_id} - Schedule {self.schedule_id} - {self.status}>'
    
    def to_dict(self):
        """
        Convierte el objeto a diccionario para JSON
        """
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.student.full_name if self.student else None,
            'student_email': self.student.email if self.student else None,
            'schedule_id': self.schedule_id,
            'class_name': self.schedule.class_name if self.schedule else None,
            'schedule_date': self.schedule.date.isoformat() if self.schedule and self.schedule.date else None,
            'schedule_time': self.schedule.time.strftime('%H:%M') if self.schedule and self.schedule.time else None,
            'status': self.status,
            'marked_at': self.marked_at.isoformat() if self.marked_at else None,
            'marked_by': self.marked_by,
            'instructor_name': self.instructor.full_name if self.instructor else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @staticmethod
    def get_by_student_and_schedule(student_id, schedule_id):
        """
        Obtiene una asistencia específica por alumno y clase
        """
        return Attendance.query.filter_by(
            student_id=student_id,
            schedule_id=schedule_id
        ).first()
    
    @staticmethod
    def get_student_attendances(student_id, limit=None):
        """
        Obtiene todas las asistencias de un alumno
        """
        query = Attendance.query.filter_by(student_id=student_id).order_by(Attendance.marked_at.desc())
        if limit:
            return query.limit(limit).all()
        return query.all()
    
    @staticmethod
    def get_schedule_attendances(schedule_id):
        """
        Obtiene todas las asistencias de una clase específica
        """
        return Attendance.query.filter_by(schedule_id=schedule_id).all()
    
    @staticmethod
    def get_attendance_rate(student_id):
        """
        Calcula el porcentaje de asistencia de un alumno
        """
        total = Attendance.query.filter_by(student_id=student_id).count()
        if total == 0:
            return 0
        present = Attendance.query.filter_by(
            student_id=student_id,
            status='present'
        ).count()
        return round((present / total) * 100, 2)
    
    def save(self):
        """
        Guarda el registro en la base de datos
        """
        db.session.add(self)
        db.session.commit()
        return self
    
    def update(self, **kwargs):
        """
        Actualiza los campos del registro
        """
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.utcnow()
        db.session.commit()
        return self
    
    def delete(self):
        """
        Elimina el registro de la base de datos
        """
        db.session.delete(self)
        db.session.commit()
        return True