"""
Notification Model
Modelo de notificaciones in-app

@version 2.0.0
@author @elisarrtech
@date 2025-10-28
"""

from app import db
from datetime import datetime


class Notification(db.Model):
    """
    Modelo de Notificaciones
    
    Representa notificaciones in-app para usuarios
    """
    
    __tablename__ = 'notifications'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Key
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Contenido de la notificación
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # info, success, warning, error, waitlist_available
    
    # Estado
    read = db.Column(db.Boolean, default=False, nullable=False)
    read_at = db.Column(db.DateTime, nullable=True)
    
    # Metadata
    related_type = db.Column(db.String(50), nullable=True)  # reservation, waitlist, class, package
    related_id = db.Column(db.Integer, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('notifications', lazy='dynamic', order_by='Notification.created_at.desc()'))
    
    def mark_as_read(self):
        """Marcar notificación como leída"""
        self.read = True
        self.read_at = datetime.utcnow()
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'read': self.read,
            'read_at': self.read_at.isoformat() if self.read_at else None,
            'related_type': self.related_type,
            'related_id': self.related_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Notification User:{self.user_id} Type:{self.type} Read:{self.read}>'