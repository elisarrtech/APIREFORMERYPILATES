# Ejecutar: python backend/scripts/create_admin.py
import os
from app import create_app, db
from app.models.user import User

ENV = os.getenv('FLASK_ENV', 'production')
app = create_app(ENV)

ADMIN_EMAIL = 'admin@reformery.com'
ADMIN_PASSWORD = 'AdminSeguro2025!'  # cambia aquí a la que quieras

with app.app_context():
    u = User.query.filter_by(email=ADMIN_EMAIL).first()
    if u:
        print("Usuario ya existe:", ADMIN_EMAIL)
        u.set_password(ADMIN_PASSWORD)
        db.session.commit()
        print("✅ Contraseña actualizada para admin.")
    else:
        u = User(email=ADMIN_EMAIL, full_name='Admin', role='admin', active=True)
        u.set_password(ADMIN_PASSWORD)
        db.session.add(u)
        db.session.commit()
        print("✅ Admin creado:", ADMIN_EMAIL)
