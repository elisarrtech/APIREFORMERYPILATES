from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

# Intentar importar passlib (opcional, pero está en requirements.txt)
try:
    from passlib.context import CryptContext
    # Soportamos bcrypt y pbkdf2_sha256 (passlib maneja muchos formatos)
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
        Verifica la contraseña de manera resiliente:
        - Si el hash parece pbkdf2 (werkzeug), usar werkzeug.check_password_hash.
        - Si el hash parece bcrypt ($2...), usar passlib (si disponible).
        - Si no sabemos, intentar werkzeug primero (capturando errores), luego passlib.
        Esto evita excepciones 'Invalid salt' y permite compatibilidad retroactiva.
        """
        try:
            if not self.password_hash:
                return False

            ph = self.password_hash

            # Heurística por prefijo de hash:
            try:
                prefix = ph.split(':', 1)[0]
            except Exception:
                prefix = ""

            # 1) Si el hash parece PBKDF2/werkzeug (empieza por 'pbkdf2' o contiene 'pbkdf2')
            if ph.startswith("pbkdf2:") or "pbkdf2" in prefix:
                try:
                    return check_password_hash(ph, password)
                except Exception as e:
                    # Logger de depuración (no rompe la app)
                    print(f"⚠️ werkzeug check raised: {e}")

            # 2) Si el hash parece bcrypt (prefijo $2a$, $2b$, $2y$), usar passlib si está disponible
            if ph.startswith("$2a$") or ph.startswith("$2b$") or ph.startswith("$2y$") or ph.startswith("$2$"):
                if pwd_context is not None:
                    try:
                        return pwd_context.verify(password, ph)
                    except Exception as e:
                        print(f"⚠️ passlib verify raised for bcrypt: {e}")
                # si no hay passlib, intentamos fallar grácilmente
                return False

            # 3) Intentar werkzeug como fallback (capturando excepciones)
            try:
                if check_password_hash(ph, password):
                    return True
            except Exception as e:
                print(f"⚠️ werkzeug fallback check raised: {e}")

            # 4) Intentar passlib general (si está disponible): passlib reconoce muchos formatos
            if pwd_context is not None:
                try:
                    return pwd_context.verify(password, ph)
                except Exception as e:
                    print(f"⚠️ passlib fallback verify raised: {e}")

            # Nada coincidió
            return False

        except Exception as e:
            # Capturar cualquier excepción inesperada y devolver False (no romper la app)
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
