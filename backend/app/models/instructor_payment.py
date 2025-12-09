"""
InstructorPayment Model - Pagos a instructores
@author @elisarrtech
@date 2025-10-28
"""

from app import db
from datetime import datetime


class InstructorPayment(db.Model):
    """
    Modelo de Pagos a Instructores
    Registra los pagos por clases impartidas
    """
    
    __tablename__ = 'instructor_payments'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Keys
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('schedules.id'), nullable=True, index=True)
    
    # Información de pago
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='USD', nullable=False)
    payment_type = db.Column(db.String(50), nullable=False)  # per_class, hourly, monthly, bonus
    
    # Periodo
    period_start = db.Column(db.Date, nullable=True)
    period_end = db.Column(db.Date, nullable=True)
    
    # Estado
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending, paid, cancelled
    paid_at = db.Column(db.DateTime, nullable=True)
    
    # Método de pago
    payment_method = db.Column(db.String(50), nullable=True)  # bank_transfer, cash, check, paypal
    
    # Notas
    notes = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    instructor = db.relationship('User', backref=db.backref('payments_received', lazy='dynamic'))
    schedule = db.relationship('Schedule', backref=db.backref('instructor_payments', lazy='dynamic'))
    
    def mark_as_paid(self):
        """Marcar como pagado"""
        self.status = 'paid'
        self.paid_at = datetime.utcnow()
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'instructor_id': self.instructor_id,
            'instructor_name': self.instructor.full_name if self.instructor else None,
            'schedule_id': self.schedule_id,
            'amount': self.amount,
            'currency': self.currency,
            'payment_type': self.payment_type,
            'period_start': self.period_start.isoformat() if self.period_start else None,
            'period_end': self.period_end.isoformat() if self.period_end else None,
            'status': self.status,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'payment_method': self.payment_method,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<InstructorPayment Instructor:{self.instructor_id} Amount:{self.amount} Status:{self.status}>'