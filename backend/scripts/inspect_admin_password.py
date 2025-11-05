# backend/scripts/inspect_admin_password.py
# Ejecutar: python backend/scripts/inspect_admin_password.py
import os
from app import create_app, db
from app.models.user import User

ENV = os.getenv('FLASK_ENV', 'production')
app = create_app(ENV)

with app.app_context():
    u = User.query.filter_by(email='admin@reformery.com').first()
    if not u:
        print("Usuario admin@reformery.com no encontrado")
    else:
        ph = u.password_hash or '(sin hash)'
        print("ID:", u.id)
        print("Email:", u.email)
        print("password_hash len:", len(ph))
        print("password_hash prefix (first 60 chars):", ph[:60])
