"""
User Model
SQLAlchemy model for users with bcrypt authentication

@version 2.0.0
@author @elisarrtech
"""

from app import db
import bcrypt
from datetime import datetime


class User(db.Model):
    """User Model with Authentication"""
    
    __tablename__ = 'users'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Authentication
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Profile
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    
    # Role and Status
    role = db.Column(db.String(20), nullable=False, default='client')  # admin, instructor, client
    active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def set_password(self, password):
        """Hash and set password using bcrypt"""
        self.password_hash = bcrypt.hashpw(
            password.encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
    
    def check_password(self, password):
        """Check if password matches hash"""
        try:
            return bcrypt.checkpw(
                password.encode('utf-8'), 
                self.password_hash.encode('utf-8')
            )
        except Exception as e:
            print(f"❌ Error checking password: {str(e)}")
            return False
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'role': self.role,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<User {self.email} ({self.role})>'