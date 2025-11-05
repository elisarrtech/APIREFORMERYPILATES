from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt", "pbkdf2_sha256"], deprecated="auto")
except Exception:
    pwd_context = None

def hash_password(password: str) -> str:
    return generate_password_hash(password)

def verify_password(stored_hash: str, password: str) -> bool:
    if not stored_hash:
        return False
    ph = stored_hash.strip()
    # Intentar werkzeug primero
    try:
        if check_password_hash(ph, password):
            return True
    except Exception as e:
        print(f"⚠️ werkzeug verify raised: {e}")
    # Intentar passlib si está disponible
    if pwd_context is not None:
        try:
            return pwd_context.verify(password, ph)
        except Exception as e:
            print(f"⚠️ passlib verify raised: {e}")
    return False



class User(db.Model):
    """Usuario del sistema - MODELO PRINCIPAL"""
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='client')
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    packages = db.relationship('UserPackage', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    reservations = db.relationship('Reservation', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hashea la contraseña"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verifica la contraseña"""
        return check_password_hash(self.password_hash, password)
    
    def get_active_package(self):
        """Obtiene el paquete activo del usuario"""
        return self.packages.filter(
            UserPackage.status == 'active',
            UserPackage.remaining_classes > 0,
            UserPackage.expiry_date > datetime.utcnow()
        ).first()
    
    def to_dict(self):
        """Convierte a diccionario"""
        active_package = self.get_active_package()
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'has_active_package': active_package is not None,
            'remaining_classes': active_package.remaining_classes if active_package else 0
        }


class Package(db.Model):
    """Paquete de clases - CATÁLOGO"""
    
    __tablename__ = 'packages'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    total_classes = db.Column(db.Integer, nullable=False)
    validity_days = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('total_classes > 0', name='check_total_classes_positive'),
        CheckConstraint('validity_days > 0', name='check_validity_days_positive'),
        CheckConstraint('price >= 0', name='check_price_non_negative'),
    )
    
    # Relaciones
    user_packages = db.relationship('UserPackage', backref='package', lazy='dynamic')
    
    def to_dict(self):
        """Convierte a diccionario"""
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
    """Paquete asignado a un usuario - INSTANCIA"""
    
    __tablename__ = 'user_packages'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    package_id = db.Column(db.Integer, db.ForeignKey('packages.id'), nullable=False)
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    expiry_date = db.Column(db.DateTime, nullable=False)
    total_classes = db.Column(db.Integer, nullable=False)
    used_classes = db.Column(db.Integer, default=0, nullable=False)
    remaining_classes = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='active', nullable=False, index=True)
    reason = db.Column(db.String(200), default='', nullable=True)  # <-- Aquí agregas el motivo del ajuste/bono
    
    # Constraints
    __table_args__ = (
        CheckConstraint('total_classes > 0', name='check_up_total_classes_positive'),
        CheckConstraint('used_classes >= 0', name='check_up_used_classes_non_negative'),
        CheckConstraint('remaining_classes >= 0', name='check_up_remaining_classes_non_negative'),
        CheckConstraint('used_classes + remaining_classes = total_classes', name='check_up_classes_balance'),
        Index('idx_user_package_status', 'user_id', 'status'),
    )
    
    # Relaciones
    reservations = db.relationship('Reservation', backref='user_package', lazy='dynamic')
    
    def update_status(self):
        """Actualiza el estado del paquete basado en fechas y clases"""
        now = datetime.utcnow()
        
        if self.expiry_date < now:
            self.status = 'expired'
        elif self.remaining_classes <= 0:
            self.status = 'exhausted'
        elif self.status in ['expired', 'exhausted'] and self.remaining_classes > 0 and self.expiry_date >= now:
            self.status = 'active'
        
        return self.status
    
    def can_reserve(self):
        """Verifica si el paquete puede ser usado para reservar"""
        self.update_status()
        return self.status == 'active' and self.remaining_classes > 0 and self.expiry_date > datetime.utcnow()
    
    def use_class(self):
        """Usa una clase del paquete"""
        if not self.can_reserve():
            raise ValueError("El paquete no puede ser usado")
        
        self.used_classes += 1
        self.remaining_classes -= 1
        self.update_status()
    
    def refund_class(self):
        """Devuelve una clase al paquete (por cancelación)"""
        if self.remaining_classes < self.total_classes:
            self.used_classes -= 1
            self.remaining_classes += 1
            self.update_status()
    
    def to_dict(self):
        """Convierte a diccionario"""
        self.update_status()
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
            'status': self.status,
            'can_reserve': self.can_reserve()
        }


class PilatesClass(db.Model):
    """Clase de Pilates - TIPO DE CLASE"""
    
    __tablename__ = 'pilates_classes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    duration = db.Column(db.Integer, default=50, nullable=False)  # minutos
    difficulty_level = db.Column(db.String(50))
    max_participants = db.Column(db.Integer, default=10, nullable=False)
    color = db.Column(db.String(7), default='#8BA88D')  # Color hex para UI
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('duration > 0', name='check_duration_positive'),
        CheckConstraint('max_participants > 0', name='check_max_participants_positive'),
    )
    
    # Relaciones
    schedules = db.relationship('ClassSchedule', back_populates='pilates_class', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'duration': self.duration,
            'difficulty_level': self.difficulty_level,
            'max_participants': self.max_participants,
            'color': self.color,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<PilatesClass {self.name}>'


class Instructor(db.Model):
    """Instructor de Pilates"""
    
    __tablename__ = 'instructors'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    specialization = db.Column(db.String(200))
    bio = db.Column(db.Text)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    user = db.relationship('User', backref='instructor_profile', uselist=False)
    schedules = db.relationship('ClassSchedule', back_populates='instructor', lazy='dynamic', cascade='all, delete-orphan')
    
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
    """Horario de Clase - INSTANCIA PROGRAMADA"""
    
    __tablename__ = 'class_schedules'
    
    id = db.Column(db.Integer, primary_key=True)
    pilates_class_id = db.Column(db.Integer, db.ForeignKey('pilates_classes.id', ondelete='CASCADE'), nullable=False, index=True)
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructors.id', ondelete='SET NULL'), nullable=True, index=True)
    start_time = db.Column(db.DateTime, nullable=False, index=True)
    end_time = db.Column(db.DateTime, nullable=False)
    max_capacity = db.Column(db.Integer, default=10, nullable=False)
    status = db.Column(db.String(50), default='scheduled', nullable=False, index=True)  # scheduled, cancelled, completed
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Constraints
    __table_args__ = (
        CheckConstraint('end_time > start_time', name='check_end_after_start'),
        CheckConstraint('max_capacity > 0', name='check_cs_max_capacity_positive'),
        Index('idx_schedule_time', 'start_time', 'status'),
        Index('idx_schedule_instructor_time', 'instructor_id', 'start_time'),
    )
    
    # Relaciones
    instructor = db.relationship('Instructor', back_populates='schedules')
    pilates_class = db.relationship('PilatesClass', back_populates='schedules')
    reservations = db.relationship('Reservation', backref='schedule', lazy='dynamic', cascade='all, delete-orphan')
    
    @property
    def current_reservations(self):
        """Cuenta reservas confirmadas actuales"""
        return self.reservations.filter(
            Reservation.status.in_(['confirmed', 'pending'])
        ).count()
    
    @property
    def available_spots(self):
        """Calcula cupos disponibles en tiempo real"""
        return max(0, self.max_capacity - self.current_reservations)
    
    @property
    def is_full(self):
        """Verifica si el horario está lleno"""
        return self.available_spots <= 0
    
    @property
    def class_name(self):
        """Obtiene el nombre de la clase"""
        return self.pilates_class.name if self.pilates_class else None
    
    @property
    def class_color(self):
        """Obtiene el color de la clase"""
        return self.pilates_class.color if self.pilates_class else '#8BA88D'
    
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
        return self.pilates_class.duration if self.pilates_class else 50
    
    def can_be_reserved(self):
        """Verifica si el horario puede ser reservado"""
        now = datetime.utcnow()
        return (
            self.status == 'scheduled' and
            self.start_time > now and
            self.available_spots > 0
        )
    
    def has_reservation_from_user(self, user_id):
        """Verifica si un usuario tiene reserva en este horario"""
        return self.reservations.filter(
            Reservation.user_id == user_id,
            Reservation.status.in_(['confirmed', 'pending'])
        ).first() is not None
    
    def get_user_reservation(self, user_id):
        """Obtiene la reserva de un usuario en este horario"""
        return self.reservations.filter(
            Reservation.user_id == user_id,
            Reservation.status.in_(['confirmed', 'pending'])
        ).first()
    
    def check_instructor_conflict(self):
        """Verifica si el instructor tiene conflicto de horario"""
        if not self.instructor_id:
            return False
        
        conflicts = ClassSchedule.query.filter(
            ClassSchedule.id != self.id,
            ClassSchedule.instructor_id == self.instructor_id,
            ClassSchedule.status == 'scheduled',
            db.or_(
                db.and_(
                    ClassSchedule.start_time <= self.start_time,
                    ClassSchedule.end_time > self.start_time
                ),
                db.and_(
                    ClassSchedule.start_time < self.end_time,
                    ClassSchedule.end_time >= self.end_time
                ),
                db.and_(
                    ClassSchedule.start_time >= self.start_time,
                    ClassSchedule.end_time <= self.end_time
                )
            )
        ).first()
        
        return conflicts is not None
    
    def to_dict(self, include_user_reservation=False, user_id=None):
        """Convierte a diccionario"""
        data = {
            'id': self.id,
            'pilates_class_id': self.pilates_class_id,
            'class_name': self.class_name,
            'class_color': self.class_color,
            'class_description': self.pilates_class.description if self.pilates_class else None,
            'instructor_id': self.instructor_id,
            'instructor_name': self.instructor_name,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'duration': self.duration,
            'max_capacity': self.max_capacity,
            'current_reservations': self.current_reservations,
            'available_spots': self.available_spots,
            'is_full': self.is_full,
            'can_be_reserved': self.can_be_reserved(),
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_user_reservation and user_id:
            reservation = self.get_user_reservation(user_id)
            data['user_has_reserved'] = reservation is not None
            data['reservation_id'] = reservation.id if reservation else None
        
        return data
    
    def __repr__(self):
        return f'<ClassSchedule {self.id} - {self.class_name} at {self.start_time}>'


class Reservation(db.Model):
    """Reserva de clase - BOOKING"""
    
    __tablename__ = 'reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('class_schedules.id', ondelete='CASCADE'), nullable=False, index=True)
    user_package_id = db.Column(db.Integer, db.ForeignKey('user_packages.id', ondelete='SET NULL'), nullable=True)
    status = db.Column(db.String(20), default='confirmed', nullable=False, index=True)  # confirmed, cancelled, completed, no_show
    reservation_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    cancellation_date = db.Column(db.DateTime)
    cancellation_reason = db.Column(db.Text)
    attended = db.Column(db.Boolean)
    notes = db.Column(db.Text)
    
    # Constraints
    __table_args__ = (
        Index('idx_user_schedule', 'user_id', 'schedule_id'),
        Index('idx_reservation_status', 'status', 'reservation_date'),
    )
    
    def can_be_cancelled(self):
        """Verifica si la reserva puede ser cancelada"""
        if self.status != 'confirmed':
            return False
        
        # No se puede cancelar si la clase ya empezó
        if self.schedule and self.schedule.start_time <= datetime.utcnow():
            return False
        
        return True
    
    def cancel(self, reason=None):
        """Cancela la reserva"""
        if not self.can_be_cancelled():
            raise ValueError("La reserva no puede ser cancelada")
        
        self.status = 'cancelled'
        self.cancellation_date = datetime.utcnow()
        self.cancellation_reason = reason
        
        # Devolver clase al paquete
        if self.user_package:
            self.user_package.refund_class()
    
    def to_dict(self, include_details=False):
        """Convierte a diccionario"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'schedule_id': self.schedule_id,
            'user_package_id': self.user_package_id,
            'status': self.status,
            'reservation_date': self.reservation_date.isoformat() if self.reservation_date else None,
            'cancellation_date': self.cancellation_date.isoformat() if self.cancellation_date else None,
            'cancellation_reason': self.cancellation_reason,
            'attended': self.attended,
            'can_be_cancelled': self.can_be_cancelled()
        }
        
        if include_details:
            data['user_name'] = self.user.full_name if self.user else None
            data['class_name'] = self.schedule.class_name if self.schedule else None
            data['instructor_name'] = self.schedule.instructor_name if self.schedule else None
            data['start_time'] = self.schedule.start_time.isoformat() if self.schedule and self.schedule.start_time else None
            data['end_time'] = self.schedule.end_time.isoformat() if self.schedule and self.schedule.end_time else None
        
        return data
    
    def __repr__(self):
        return f'<Reservation {self.id} - User {self.user_id} - Schedule {self.schedule_id}>'
