# backend/app/__init__.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import config

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    jwt.init_app(app)

    # Orígenes permitidos: local dev + NETLIFY_ORIGIN si está definido en env vars
    netlify_origin = os.getenv("NETLIFY_ORIGIN")  # ej: https://reformeryavances.netlify.app
    allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
    if netlify_origin:
        allowed_origins.append(netlify_origin)

    # FIX: aplicar CORS a todas las rutas (responde OPTIONS y añade Access-Control-Allow-*).
    # Se mantiene la lista de orígenes para seguridad en producción.
    CORS(
        app,
        resources={r"/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "supports_credentials": True,
            "expose_headers": ["Content-Type", "Authorization"],
            "max_age": 3600
        }},
    )

    # Register blueprints (API canonical con /api/v1)
    from app.routes.auth import auth_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')

    # Compatibilidad: registrar también sin prefijo para clientes que todavía usan /auth
    # Evita 404 en clientes que llaman /auth/login
    try:
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.register_blueprint(admin_bp, url_prefix='/admin')
    except Exception:
        # no romper si ya está registrado o si blueprint no permite doble registro
        pass

    print("✅ Core blueprints registered")
    

    # Register optional blueprints
    try:
        from app.routes.schedules import admin_schedules_bp
        app.register_blueprint(admin_schedules_bp, url_prefix='/api/v1/admin-reformery/schedules')
        print("✅ Schedules blueprint registered")
    except ImportError:
        print("⚠️ Schedules blueprint not found")

    try:
        from app.routes.reservations import reservations_bp
        app.register_blueprint(reservations_bp, url_prefix='/api/v1/reservations')
        print("✅ Reservations blueprint registered")
    except ImportError:
        print("⚠️ Reservations blueprint not found")

    try:
        from app.routes.notifications import notifications_bp
        app.register_blueprint(notifications_bp, url_prefix='/api/v1/notifications')
        print("✅ Notifications blueprint registered")
    except ImportError:
        print("⚠️ Notifications blueprint not found")

    # Initialize database and seed data
with app.app_context():
        db.create_all()
        print("✅ Database tables created")
        # seed users, clases, paquetes, etc. (se mantiene lógica existente)
        
        # ==================== USUARIOS ====================
        from app.models.user import User
        from werkzeug.security import generate_password_hash
        
        # Admin
        admin = User.query.filter_by(email='admin@reformery.com').first()
        if not admin:
            admin = User(
                email='admin@reformery.com',
                password_hash=generate_password_hash('admin123'),
                full_name='Admin Reformery',
                phone='1234567890',
                role='admin',
                active=True
            )
            db.session.add(admin)
            print("✅ Admin user created")
        else:
            print("✅ Admin user already exists")
        
        # Client
        client = User.query.filter_by(email='client@reformery.com').first()
        if not client:
            client = User(
                email='client@reformery.com',
                password_hash=generate_password_hash('client123'),
                full_name='Cliente Demo',
                phone='1234567890',
                role='client',
                active=True
            )
            db.session.add(client)
            print("✅ Client user created")
        else:
            print("✅ Client user already exists")
        
        # Instructor
        instructor = User.query.filter_by(email='instructor@reformery.com').first()
        if not instructor:
            instructor = User(
                email='instructor@reformery.com',
                password_hash=generate_password_hash('instructor123'),
                full_name='Instructor Demo',
                phone='1234567890',
                role='instructor',
                active=True
            )
            db.session.add(instructor)
            print("✅ Instructor user created")
        else:
            print("✅ Instructor user already exists")
        
        db.session.commit()
        
        # ==================== CLASES ====================
        from app.models.pilates_class import PilatesClass
        
        clases_oficiales = [
            ('PLT FIT', 'Clase de Pilates enfocada en fitness', 60, 10, 'Fitness', 'Intermedio'),
            ('PLT BLAST', 'Clase intensiva con ejercicios explosivos', 50, 8, 'Intensivo', 'Avanzado'),
            ('PLT JUMP', 'Clase con trampolín', 45, 8, 'Cardio', 'Intermedio'),
            ('PLT HIT', 'High Intensity Training', 45, 8, 'HIIT', 'Avanzado'),
            ('PLT PRIVADA TRAPEZE', 'Sesión privada con trapecio', 60, 1, 'Privada', 'Personalizado'),
            ('PLT PRIVADAS Y SEMIPRIVADAS', 'Sesiones personalizadas', 60, 2, 'Privada', 'Personalizado'),
            ('PLT EMBARAZADAS', 'Clase para embarazadas', 60, 6, 'Prenatal', 'Suave')
        ]
        
        for name, desc, duration, capacity, category, intensity in clases_oficiales:
            clase = PilatesClass.query.filter_by(name=name).first()
            if not clase:
                clase = PilatesClass(
                    name=name,
                    description=desc,
                    duration=duration,
                    max_capacity=capacity,
                    category=category,
                    intensity_level=intensity,
                    active=True
                )
                db.session.add(clase)
                print(f"✅ Clase creada: {name}")
            else:
                print(f"✅ Clase ya existe: {name}")
        
        db.session.commit()
        
        # ==================== PAQUETES ====================
        from app.models.package import Package
        
        paquetes_oficiales = [
            ('PAQUETE 1 - CLASE MUESTRA', '1 clase Reformery Muestra', 1, 1, 0, 150.00, 30, 'reformer'),
            ('PAQUETE 2 - 1 CLASE', '1 clase Reformery', 1, 1, 0, 200.00, 30, 'reformer'),
            ('PAQUETE 3 - 5 CLASES', '5 clases Reformery', 5, 5, 0, 800.00, 30, 'reformer'),
            ('PAQUETE 4 - 8 CLASES', '8 clases Reformery', 8, 8, 0, 1000.00, 30, 'reformer'),
            ('PAQUETE 5 - 12 CLASES', '12 clases Reformery', 12, 12, 0, 1400.00, 30, 'reformer'),
            ('PAQUETE 6 - 20 CLASES', '20 clases Reformery', 20, 20, 0, 1900.00, 30, 'reformer'),
            ('PAQUETE DUO', '1 Reformery + 1 Top Barre', 2, 1, 1, 380.00, 30, 'combo'),
            ('PAQUETE 5+5', '5 Reformery + 5 Top Barre', 10, 5, 5, 1400.00, 30, 'combo'),
            ('PAQUETE 8+8', '8 Reformery + 8 Top Barre', 16, 8, 8, 1800.00, 30, 'combo')
        ]
        
        for name, desc, total, reformer, barre, price, validity, pkg_type in paquetes_oficiales:
            paquete = Package.query.filter_by(name=name).first()
            if not paquete:
                paquete = Package(
                    name=name,
                    description=desc,
                    total_classes=total,
                    total_classes_reformer=reformer,
                    total_classes_top_barre=barre,
                    price=price,
                    validity_days=validity,
                    package_type=pkg_type,
                    active=True
                )
                db.session.add(paquete)
                print(f"✅ Paquete creado: {name} - ${price} MXN")
            else:
                print(f"✅ Paquete ya existe: {name}")
        
        db.session.commit()
        
       print("✅ Database seeded successfully")

    # Healthcheck para Railway (DEBE estar dentro de create_app)
    @app.get("/health")
    def health():
        return {"status": "ok"}, 200

    return app
