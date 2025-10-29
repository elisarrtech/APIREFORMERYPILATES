"""
UserPackage Model
Modelo de paquetes asignados a usuarios

@version 2.0.0
@author @elisarrtech
@date 2025-10-28
"""

from app import db
from datetime import datetime, timedelta


class UserPackage(db.Model):
    """
    Modelo de Paquetes de Usuario
    
    Representa los paquetes comprados/asignados a cada usuario
    """
    
    __tablename__ = 'user_packages'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    package_id = db.Column(db.Integer, db.ForeignKey('packages.id'), nullable=False, index=True)
    
    # Información del paquete asignado
    classes_total = db.Column(db.Integer, nullable=False)  # Total de clases del paquete
    classes_used = db.Column(db.Integer, nullable=False, default=0)  # Clases usadas
    classes_remaining = db.Column(db.Integer, nullable=False)  # Clases restantes
    
    # Vigencia
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    expiration_date = db.Column(db.DateTime, nullable=False)
    
    # Estado
    status = db.Column(db.String(20), nullable=False, default='active')  # active, expired, cancelled
    active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Precio pagado
    price_paid = db.Column(db.Numeric(10, 2), nullable=True)
    
    # Notas
    notes = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('user_packages', lazy='dynamic'))
    package = db.relationship('Package', backref=db.backref('user_packages', lazy='dynamic'))
    
    def __init__(self, **kwargs):
        super(UserPackage, self).__init__(**kwargs)
        # Auto-calcular classes_remaining si no se proporciona
        if not self.classes_remaining:
            self.classes_remaining = self.classes_total - self.classes_used
        
        # Auto-calcular expiration_date si no se proporciona
        if not self.expiration_date and self.package:
            self.expiration_date = datetime.utcnow() + timedelta(days=self.package.validity_days)
    
    def is_expired(self):
        """Check if package is expired"""
        return datetime.utcnow() > self.expiration_date
    
    def has_classes_remaining(self):
        """Check if package has classes remaining"""
        return self.classes_remaining > 0
    
    def use_class(self):
        """Use one class from the package"""
        if self.classes_remaining > 0:
            self.classes_used += 1
            self.classes_remaining -= 1
            return True
        return False
    
    def refund_class(self):
        """Refund one class to the package"""
        if self.classes_used > 0:
            self.classes_used -= 1
            self.classes_remaining += 1
            return True
        return False
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.full_name if self.user else None,
            'package_id': self.package_id,
            'package_name': self.package.name if self.package else None,
            'classes_total': self.classes_total,
            'classes_used': self.classes_used,
            'classes_remaining': self.classes_remaining,
            'purchase_date': self.purchase_date.isoformat() if self.purchase_date else None,
            'expiration_date': self.expiration_date.isoformat() if self.expiration_date else None,
            'is_expired': self.is_expired(),
            'status': self.status,
            'active': self.active,
            'price_paid': float(self.price_paid) if self.price_paid else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<UserPackage User:{self.user_id} Package:{self.package_id} Remaining:{self.classes_remaining}>'