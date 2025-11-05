from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.Text, nullable=True)
    full_name = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    role = db.Column(db.String(50), default='client')
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.email}>"

    # Setter helper: guarda el hash (usa werkzeug por compatibilidad con el seeding)
    def set_password(self, password: str):
        if password is None:
            self.password_hash = None
        else:
            # Método por defecto: 'pbkdf2:sha256' (compatible con generate_password_hash en seeding)
            self.password_hash = generate_password_hash(password)

    # Verificación: usa check_password_hash de werkzeug, que entiende hashes generados por generate_password_hash
    def check_password(self, password: str) -> bool:
        try:
            if not self.password_hash:
                return False
            return check_password_hash(self.password_hash, password)
        except Exception as e:
            # Loguea el error para ayudar a debug (si usas logging, preferir logging en lugar de print)
            # Aquí devolvemos False si ocurre cualquier excepción (evita que la app rompa)
            print(f"❌ Error checking password: {str(e)}")
            return False

    # Método auxiliar para serializar usuario (ajusta según lo que necesites)
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "phone": self.phone,
            "role": self.role,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
