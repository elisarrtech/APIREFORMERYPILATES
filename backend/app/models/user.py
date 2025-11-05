from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

# Optional: import passlib only if you add it to requirements
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

    def set_password(self, password: str):
        if password is None:
            self.password_hash = None
        else:
            # Use werkzeug to generate (compatible with seed)
            self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        try:
            if not self.password_hash:
                return False
            # First attempt: werkzeug (pbkdf2:sha256, scrypt, etc. supported)
            try:
                if check_password_hash(self.password_hash, password):
                    return True
            except Exception as e:
                # continue to try other methods
                print("⚠️ werkzeug check failed:", str(e))

            # Second attempt: passlib (bcrypt or pbkdf2) if available
            if pwd_context is not None:
                try:
                    # passlib's verify returns True/False and handles many schemes
                    return pwd_context.verify(password, self.password_hash)
                except Exception as e:
                    print("⚠️ passlib verify failed:", str(e))

            # If nothing matched, return False
            return False
        except Exception as e:
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
