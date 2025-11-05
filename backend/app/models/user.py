from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

# Intentar importar passlib (ya está en requirements.txt)
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt", "pbkdf2_sha256"], deprecated="auto")
except Exception:
    pwd_context = None

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

    def set_password(self, password: str):
        """Hash and store password using werkzeug (pbkdf2:sha256 by default)."""
        if password is None:
            self.password_hash = None
        else:
            self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """
        Verificación resiliente:
        - Intentar werkzeug.check_password_hash (pbkdf2, scrypt...)
        - Si falla, intentar passlib (bcrypt, pbkdf2, etc.) si está disponible.
        - Atrapar excepciones para evitar 'Invalid salt' y devolver False.
        """
        try:
            if not self.password_hash:
                return False

            ph = self.password_hash.strip()

            # 1) Intento con werkzeug
            try:
                if check_password_hash(ph, password):
                    return True
            except Exception as e:
                # No rompemos la app; intentamos otros métodos
                print(f"⚠️ werkzeug check raised: {e}")

            # 2) Intento con passlib si está instalado (compatibilidad bcrypt, pbkdf2, etc.)
            if pwd_context is not None:
                try:
                    return pwd_context.verify(password, ph)
                except Exception as e:
                    print(f"⚠️ passlib verify raised: {e}")

            # 3) Si nada coincide
            return False

        except Exception as e:
            # Capturar cualquier excepción y devolver False
            print(f"❌ Error checking password: {str(e)}")
            return False

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
