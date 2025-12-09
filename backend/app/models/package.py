"""
Package Model
Modelo de paquetes de clases

@version 2.0.0
@author @elisarrtech
@date 2025-10-27
"""

from app import db
from datetime import datetime


class Package(db.Model):
    """
    Modelo de Paquetes de Clases
    
    Representa los diferentes paquetes de clases disponibles
    """
    
    __tablename__ = 'packages'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Información del paquete
    name = db.Column(db.String(100), nullable=False, unique=True, index=True)
    description = db.Column(db.Text, nullable=True)
    
    # Clases incluidas
    total_classes = db.Column(db.Integer, nullable=False)
    total_classes_reformer = db.Column(db.Integer, nullable=False, default=0)
    total_classes_top_barre = db.Column(db.Integer, nullable=False, default=0)
    
    # Vigencia y precio
    validity_days = db.Column(db.Integer, nullable=False, default=30)  # Días de vigencia
    price = db.Column(db.Numeric(10, 2), nullable=False)  # Precio en pesos
    
    # Tipo de paquete
    package_type = db.Column(db.String(50), nullable=True)  # individual, duo, combo
    
    # Estado
    active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Orden de display
    display_order = db.Column(db.Integer, nullable=True, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # TODO: Agregar relación con UserPackage cuando se cree ese modelo
    # user_packages = db.relationship('UserPackage', backref='package', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'total_classes': self.total_classes,
            'total_classes_reformer': self.total_classes_reformer,
            'total_classes_top_barre': self.total_classes_top_barre,
            'validity_days': self.validity_days,
            'price': float(self.price),
            'package_type': self.package_type,
            'active': self.active,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Package {self.name}>'