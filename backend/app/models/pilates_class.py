"""
PilatesClass Model
Modelo de clases de Pilates Reformer

@version 2.0.0
@author @elisarrtech
@date 2025-10-27
"""

from app import db
from datetime import datetime


class PilatesClass(db.Model):
    """
    Modelo de Clases de Pilates
    
    Representa las diferentes clases ofrecidas en REFORMERY
    """
    
    __tablename__ = 'pilates_classes'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Información de la clase
    name = db.Column(db.String(100), nullable=False, unique=True, index=True)
    description = db.Column(db.Text, nullable=True)
    duration = db.Column(db.Integer, nullable=False, default=50)  # Duración en minutos
    max_capacity = db.Column(db.Integer, nullable=False, default=10)  # Capacidad máxima
    
    # Estado
    active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Categoría
    category = db.Column(db.String(50), nullable=True)  # grupal, privada, semiprivada, especial
    
    # Nivel de intensidad
    intensity_level = db.Column(db.String(20), nullable=True)  # baja, media, alta
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # TODO: Agregar relación con Schedule cuando se cree ese modelo
    # schedules = db.relationship('Schedule', backref='pilates_class', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'duration': self.duration,
            'max_capacity': self.max_capacity,
            'active': self.active,
            'category': self.category,
            'intensity_level': self.intensity_level,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<PilatesClass {self.name}>'