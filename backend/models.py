# models.py
# Modelos SQLAlchemy - Base de Datos
# Autor: @elisarrtech con Elite AI Architect

from extensions import db
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    # Usuario del sistema
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='client')
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    packages = db.relationship('UserPackage', backref='user', lazy='dynamic')
    reservations = db.relationship('Reservation', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        # Hashea la contraseña
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        # Verifica la contraseña
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        # Convierte a diccionario
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Package(db.Model):
    # Paquete de clases
    
    __tablename__ = 'packages'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    total_classes = db.Column(db.Integer, nullable=False)
    validity_days = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relaciones
    user_packages = db.relationship('UserPackage', backref='package', lazy='dynamic')
    
    def to_dict(self):
        # Convierte a diccionario
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'total_classes': self.total_classes,
            'validity_days': self.validity_days,
            'price': self.price,
            'active': self.active
        }


class UserPackage(db.Model):
    # Paquete asignado a un usuario
    
    __tablename__ = 'user_packages'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    package_id = db.Column(db.Integer, db.ForeignKey('packages.id'), nullable=False)
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)
    expiry_date = db.Column(db.DateTime, nullable=False)
    total_classes = db.Column(db.Integer, nullable=False)
    used_classes = db.Column(db.Integer, default=0)
    remaining_classes = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='active')
    
    # Relaciones
    reservations = db.relationship('Reservation', backref='user_package', lazy='dynamic')
    
    def update_status(self):
        # Actualiza el estado del paquete
        now = datetime.utcnow()
        
        if self.expiry_date < now:
            self.status = 'expired'
        elif self.remaining_classes <= 0:
            self.status = 'exhausted'
        else:
            self.status = 'active'
    
    def to_dict(self):
        # Convierte a diccionario
        return {
            'id': self.id,
            'user_id': self.user_id,
            'package_id': self.package_id,
            'package_name': self.package.name if self.package else None,
            'purchase_date': self.purchase_date.isoformat() if self.purchase_date else None,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'total_classes': self.total_classes,
            'used_classes': self.used_classes,
            'remaining_classes': self.remaining_classes,
            'status': self.status
        }


class PilatesClass(db.Model):
    __tablename__ = 'pilates_classes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    duration = db.Column(db.Integer, default=50)
    difficulty_level = db.Column(db.String(50))
    max_participants = db.Column(db.Integer, default=10)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones - SIN backref, usar back_populates
    schedules = db.relationship('ClassSchedule', back_populates='pilates_class', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'duration': self.duration,
            'difficulty_level': self.difficulty_level,
            'max_participants': self.max_participants,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<PilatesClass {self.name}>'
    
    
class Instructor(db.Model):
    __tablename__ = 'instructors'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    specialization = db.Column(db.String(200))
    bio = db.Column(db.Text)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones - AGREGAR ESTA LÍNEA SI NO EXISTE
    user = db.relationship('User', backref='instructor_profile', uselist=False)
    schedules = db.relationship('ClassSchedule', back_populates='instructor', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.user.full_name if self.user else None,
            'email': self.user.email if self.user else None,
            'specialization': self.specialization,
            'bio': self.bio,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Instructor {self.user.full_name if self.user else self.id}>'
    

class ClassSchedule(db.Model):
    __tablename__ = 'class_schedules'
    
    id = db.Column(db.Integer, primary_key=True)
    pilates_class_id = db.Column(db.Integer, db.ForeignKey('pilates_classes.id'), nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructors.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    max_capacity = db.Column(db.Integer, default=10)
    available_spots = db.Column(db.Integer, default=10)
    status = db.Column(db.String(50), default='scheduled')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones - TODAS con back_populates
    instructor = db.relationship('Instructor', back_populates='schedules')
    pilates_class = db.relationship('PilatesClass', back_populates='schedules')
    reservations = db.relationship('Reservation', backref='schedule', lazy=True)
    
    @property
    def is_full(self):
        """Verifica si el horario está lleno"""
        return self.available_spots <= 0
    
    @property
    def class_name(self):
        """Obtiene el nombre de la clase"""
        return self.pilates_class.name if self.pilates_class else None
    
    @property
    def instructor_name(self):
        """Obtiene el nombre del instructor"""
        return self.instructor.user.full_name if self.instructor and self.instructor.user else None
    
    @property
    def duration(self):
        """Calcula la duración en minutos"""
        if self.start_time and self.end_time:
            delta = self.end_time - self.start_time
            return int(delta.total_seconds() / 60)
        return 0
    
    def to_dict(self):
        return {
            'id': self.id,
            'pilates_class_id': self.pilates_class_id,
            'class_name': self.class_name,
            'instructor_id': self.instructor_id,
            'instructor_name': self.instructor_name,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'duration': self.duration,
            'max_capacity': self.max_capacity,
            'available_spots': self.available_spots,
            'is_full': self.is_full,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<ClassSchedule {self.id} - {self.class_name} at {self.start_time}>'
    
        
class Reservation(db.Model):
    # Reserva de clase
    
    __tablename__ = 'reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey('class_schedules.id'), nullable=False)
    user_package_id = db.Column(db.Integer, db.ForeignKey('user_packages.id'), nullable=False)
    status = db.Column(db.String(20), default='confirmed')
    reservation_date = db.Column(db.DateTime, default=datetime.utcnow)
    cancellation_date = db.Column(db.DateTime)
    cancellation_reason = db.Column(db.Text)
    attended = db.Column(db.Boolean)
    notes = db.Column(db.Text)
    
    def to_dict(self):
        # Convierte a diccionario
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.full_name if self.user else None,
            'schedule_id': self.schedule_id,
            'user_package_id': self.user_package_id,
            'status': self.status,
            'reservation_date': self.reservation_date.isoformat() if self.reservation_date else None,
            'cancellation_date': self.cancellation_date.isoformat() if self.cancellation_date else None,
            'cancellation_reason': self.cancellation_reason,
            'attended': self.attended,
            'notes': self.notes
        }
