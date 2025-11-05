# Ejecutar: python backend/scripts/reset_admin_password.py
# ATENCIÓN: Esto setea la contraseña del admin a 'admin123' (temporal). Cambiala luego en la UI.
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
        u.set_password('admin123')  # temporal: cambiar después en UI
        db.session.commit()
        print("✅ Contraseña del admin reseteada a 'admin123' (temporal).")
