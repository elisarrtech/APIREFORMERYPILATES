"""
Script para crear Cliente Demo con Paquete Activo
- Cliente con credenciales demo
- Paquete 5+5 (10 clases en total)
- 5 clases usadas, 5 clases disponibles
- Estado activo y funcional

@author @elisarrtech
@date 2025-10-28
@version 2.0.0 - ÉLITE MUNDIAL - CORREGIDO
"""

from app import create_app, db
from app.models.user import User
from app.models.package import Package
from app.models.user_package import UserPackage
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

def create_demo_client_with_package():
    """
    Crear cliente demo con paquete activo
    """
    app = create_app('development')
    
    with app.app_context():
        print("="*80)
        print("🚀 CREANDO CLIENTE DEMO CON PAQUETE ACTIVO")
        print("="*80)
        
        try:
            # 1. Verificar si el paquete 5+5 existe
            package_5_5 = Package.query.filter_by(name='Paquete 5+5').first()
            
            if not package_5_5:
                print("\n📦 Creando Paquete 5+5...")
                package_5_5 = Package(
                    name='Paquete 5+5',
                    description='10 clases en total: 5 clases base + 5 clases de bonificación',
                    total_classes=10,  # ✅ CORREGIDO: usar total_classes en lugar de classes_count
                    total_classes_reformer=10,
                    total_classes_top_barre=0,
                    price=200.00,
                    validity_days=60,
                    package_type='mixed',
                    active=True,
                    display_order=1
                )
                db.session.add(package_5_5)
                db.session.commit()
                print(f"   ✅ Paquete creado: {package_5_5.name} (ID: {package_5_5.id})")
            else:
                print(f"\n📦 Paquete existente: {package_5_5.name} (ID: {package_5_5.id})")
            
            # 2. Buscar o crear cliente demo
            demo_client = User.query.filter_by(email='demo@reformery.com').first()
            
            if demo_client:
                print(f"\n👤 Cliente demo existente: {demo_client.full_name} ({demo_client.email})")
            else:
                print("\n👤 Creando Cliente Demo...")
                demo_client = User(
                    email='demo@reformery.com',
                    password_hash=generate_password_hash('demo123'),
                    full_name='Cliente Demo Activo',
                    phone='5555555555',
                    role='client',
                    active=True
                )
                db.session.add(demo_client)
                db.session.commit()
                print(f"   ✅ Cliente creado: {demo_client.full_name}")
            
            # 3. Verificar si ya tiene un paquete activo
            existing_package = UserPackage.query.filter_by(
                user_id=demo_client.id,
                package_id=package_5_5.id,
                status='active',
                active=True
            ).first()
            
            if existing_package:
                print(f"\n⚠️  El cliente ya tiene un paquete activo:")
                print(f"   - Paquete: {existing_package.package.name if existing_package.package else 'N/A'}")
                print(f"   - Total clases: {existing_package.classes_total}")
                print(f"   - Clases usadas: {existing_package.classes_used}")
                print(f"   - Clases disponibles: {existing_package.classes_remaining}")
                print(f"   - Estado: {existing_package.status}")
                
                # Actualizar automáticamente
                print("\n🔄 Actualizando paquete existente...")
                existing_package.classes_total = 10
                existing_package.classes_used = 5
                existing_package.classes_remaining = 5
                existing_package.expiration_date = datetime.utcnow() + timedelta(days=60)
                existing_package.status = 'active'
                existing_package.active = True
                db.session.commit()
                print("   ✅ Paquete actualizado exitosamente")
                user_package = existing_package
            else:
                # 4. Crear UserPackage (paquete activo para el cliente)
                print("\n💳 Asignando paquete al cliente...")
                user_package = UserPackage(
                    user_id=demo_client.id,
                    package_id=package_5_5.id,
                    classes_total=10,
                    classes_used=5,
                    classes_remaining=5,
                    purchase_date=datetime.utcnow(),
                    expiration_date=datetime.utcnow() + timedelta(days=60),
                    status='active',
                    active=True
                )
                db.session.add(user_package)
                db.session.commit()
                print(f"   ✅ Paquete asignado exitosamente (ID: {user_package.id})")
            
            # 5. Mostrar resumen
            print("\n" + "="*80)
            print("✅ CLIENTE DEMO CREADO EXITOSAMENTE")
            print("="*80)
            print("\n📧 CREDENCIALES DE ACCESO:")
            print(f"   Email:    demo@reformery.com")
            print(f"   Password: demo123")
            print(f"   Rol:      client")
            print(f"   Nombre:   {demo_client.full_name}")
            
            print("\n📦 PAQUETE ACTIVO:")
            print(f"   Paquete:            {user_package.package.name if user_package.package else 'N/A'}")
            print(f"   Total clases:       {user_package.classes_total}")
            print(f"   Clases usadas:      {user_package.classes_used}")
            print(f"   Clases disponibles: {user_package.classes_remaining}")
            print(f"   Estado:             {user_package.status}")
            print(f"   Fecha compra:       {user_package.purchase_date.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"   Fecha expiración:   {user_package.expiration_date.strftime('%Y-%m-%d')}")
            
            print("\n🌐 ACCESO AL SISTEMA:")
            print(f"   URL Login:      http://localhost:5173/login")
            print(f"   URL Dashboard:  http://localhost:5173/client/dashboard")
            print(f"   URL Horarios:   http://localhost:5173/schedules")
            
            print("\n💡 FUNCIONALIDADES DISPONIBLES:")
            print(f"   ✅ Ver calendario de clases (7 días)")
            print(f"   ✅ Reservar clases (5 clases disponibles)")
            print(f"   ✅ Ver mis reservas")
            print(f"   ✅ Cancelar reservas (hasta 8 horas antes)")
            print(f"   ✅ Unirse a lista de espera")
            print(f"   ✅ Ver historial de clases")
            print(f"   ✅ Generar código QR personal")
            print(f"   ✅ Configurar notificaciones")
            
            print("\n" + "="*80)
            print("🎉 ¡LISTO PARA USAR EL SISTEMA COMPLETO!")
            print("="*80)
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ ERROR: {str(e)}")
            import traceback
            traceback.print_exc()


if __name__ == '__main__':
    create_demo_client_with_package()
