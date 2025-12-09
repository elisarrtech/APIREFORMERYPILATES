# backend/restore_reformery_data.py
"""
Script de Restauración de Datos Reales REFORMERY
@version 1.0.0 - ÉLITE MUNDIAL
@author @elisarrtech
"""

from app import create_app, db
from app.models.user import User
from app.models.package import Package
from app.models.pilates_class import PilatesClass
from werkzeug.security import generate_password_hash

def restore_reformery_data():
    app = create_app('development')
    
    with app.app_context():
        print("="*70)
        print("🏋️ RESTAURACIÓN DE DATOS REALES - REFORMERY")
        print("="*70)
        
        # ==================== USUARIOS ====================
        print("\n👥 RESTAURANDO USUARIOS...")
        
        User.query.update({User.active: True})
        db.session.commit()
        
        users_data = [
            ('admin@reformery.com', 'admin123', 'Admin Reformery', 'admin'),
            ('client@reformery.com', 'client123', 'Cliente Demo', 'client'),
            ('instructor@reformery.com', 'instructor123', 'Instructor Demo', 'instructor')
        ]
        
        for email, password, name, role in users_data:
            user = User.query.filter_by(email=email).first()
            if not user:
                user = User(
                    email=email,
                    password_hash=generate_password_hash(password),
                    full_name=name,
                    phone='1234567890',
                    role=role,
                    active=True
                )
                db.session.add(user)
                print(f"✅ Usuario creado: {email}")
            else:
                user.active = True
                print(f"✅ Usuario restaurado: {email}")
        
        db.session.commit()
        
        # ==================== CLASES ====================
        print("\n🏋️ RESTAURANDO 7 CLASES OFICIALES...")
        
        PilatesClass.query.update({PilatesClass.active: True})
        db.session.commit()
        
        clases = [
            ('PLT FIT', 'Clase de Pilates enfocada en fitness', 60, 10, 'Fitness', 'Intermedio'),
            ('PLT BLAST', 'Clase intensiva con ejercicios explosivos', 50, 8, 'Intensivo', 'Avanzado'),
            ('PLT JUMP', 'Clase con trampolín', 45, 8, 'Cardio', 'Intermedio'),
            ('PLT HIT', 'High Intensity Training', 45, 8, 'HIIT', 'Avanzado'),
            ('PLT PRIVADA TRAPEZE', 'Sesión privada con trapecio', 60, 1, 'Privada', 'Personalizado'),
            ('PLT PRIVADAS Y SEMIPRIVADAS', 'Sesiones personalizadas', 60, 2, 'Privada', 'Personalizado'),
            ('PLT EMBARAZADAS', 'Clase para embarazadas', 60, 6, 'Prenatal', 'Suave')
        ]
        
        for name, desc, duration, capacity, category, intensity in clases:
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
                clase.active = True
                clase.description = desc
                clase.duration = duration
                clase.max_capacity = capacity
                print(f"✅ Clase restaurada: {name}")
        
        db.session.commit()
        
        # ==================== PAQUETES ====================
        print("\n📦 RESTAURANDO 9 PAQUETES OFICIALES...")
        
        Package.query.update({Package.active: True})
        db.session.commit()
        
        paquetes = [
            ('PAQUETE 1 - CLASE MUESTRA', '1 clase Reformery Muestra', 1, 0, 0, 150.00, 30, 'reformer'),
            ('PAQUETE 2 - 1 CLASE', '1 clase Reformery', 1, 0, 0, 200.00, 30, 'reformer'),
            ('PAQUETE 3 - 5 CLASES', '5 clases Reformery', 5, 0, 0, 800.00, 30, 'reformer'),
            ('PAQUETE 4 - 8 CLASES', '8 clases Reformery', 8, 0, 0, 1000.00, 30, 'reformer'),
            ('PAQUETE 5 - 12 CLASES', '12 clases Reformery', 12, 0, 0, 1400.00, 30, 'reformer'),
            ('PAQUETE 6 - 20 CLASES', '20 clases Reformery', 20, 0, 0, 1900.00, 30, 'reformer'),
            ('PAQUETE DUO', '1 Reformery + 1 Top Barre', 2, 1, 1, 380.00, 30, 'combo'),
            ('PAQUETE 5+5', '5 Reformery + 5 Top Barre', 10, 5, 5, 1400.00, 30, 'combo'),
            ('PAQUETE 8+8', '8 Reformery + 8 Top Barre', 16, 8, 8, 1800.00, 30, 'combo')
        ]
        
        for name, desc, total, reformer, barre, price, validity, pkg_type in paquetes:
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
                paquete.active = True
                paquete.description = desc
                paquete.total_classes = total
                paquete.total_classes_reformer = reformer
                paquete.total_classes_top_barre = barre
                paquete.price = price
                print(f"✅ Paquete restaurado: {name} - ${price} MXN")
        
        db.session.commit()
        
        # ==================== RESUMEN ====================
        print("\n" + "="*70)
        print("📊 RESUMEN")
        print("="*70)
        print(f"👥 Usuarios: {User.query.filter_by(active=True).count()}")
        print(f"🏋️ Clases: {PilatesClass.query.filter_by(active=True).count()}")
        print(f"📦 Paquetes: {Package.query.filter_by(active=True).count()}")
        print("\n✅ DATOS RESTAURADOS EXITOSAMENTE")
        print("="*70)

if __name__ == '__main__':
    restore_reformery_data()
