"""
Script de población de base de datos - REFORMERY
Autor: @elisarrtech
Datos reales del centro fitness REFORMERY
"""

from app import create_app
from extensions import db
from models import User, Package, UserPackage, PilatesClass, Instructor, ClassSchedule, Reservation
from datetime import datetime, timedelta
import random
import logging

LOG = logging.getLogger(__name__)

def seed_reformery_data():
    """
    Puebla la base de datos con datos reales de REFORMERY
    7 clases + 9 paquetes (todos 30 días vigencia)
    """
    
    print("\n" + "="*80)
    print("🔥 INICIANDO POBLACIÓN DE BASE DE DATOS - REFORMERY")
    print("="*80 + "\n")
    
    # Limpiar base de datos
    print("🧹 Limpiando base de datos...")
    db.drop_all()
    db.create_all()
    print("   ✓ Base de datos limpia\n")
    
    # ========================================================================
    # CREAR USUARIOS
    # ========================================================================
    
    print("👤 Creando usuarios...")
    
    # Instructores REFORMERY
    instructors_data = [
        {
            'email': 'sofia.martinez@reformery.com',
            'password': 'instructor123',
            'full_name': 'Sofía Martínez',
            'specialization': 'PLT FIT, PLT BLAST, PLT JUMP',
            'bio': 'Instructora certificada con más de 8 años de experiencia en Pilates Reformer.'
        },
        {
            'email': 'carlos.rodriguez@reformery.com',
            'password': 'instructor123',
            'full_name': 'Carlos Rodríguez',
            'specialization': 'PLT HIT, PLT PRIVADA TRAPEZE',
            'bio': 'Instructor certificado con enfoque en entrenamiento de alta intensidad.'
        },
        {
            'email': 'laura.gomez@reformery.com',
            'password': 'instructor123',
            'full_name': 'Laura Gómez',
            'specialization': 'PLT PRIVADAS Y SEMIPRIVADAS, PLT EMBARAZADAS',
            'bio': 'Instructora certificada especializada en clases privadas y embarazadas.'
        },
        {
            'email': 'ana.lopez@reformery.com',
            'password': 'instructor123',
            'full_name': 'Ana López',
            'specialization': 'PLT FIT, PLT JUMP, PLT EMBARAZADAS',
            'bio': 'Instructora certificada con experiencia en fitness funcional y prenatal.'
        },
        {
            'email': 'miguel.santos@reformery.com',
            'password': 'instructor123',
            'full_name': 'Miguel Santos',
            'specialization': 'PLT BLAST, PLT HIT, PLT PRIVADA TRAPEZE',
            'bio': 'Instructor certificado con background en deportes de alto rendimiento.'
        }
    ]
    
    instructor_users = []
    for data in instructors_data:
        user = User(
            email=data['email'],
            full_name=data['full_name'],
            role='instructor',
            active=True
        )
        user.set_password(data['password'])
        db.session.add(user)
        db.session.flush()
        instructor_users.append((user, data))
    
    print(f"   ✓ {len(instructors_data)} instructores creados")
    
    # Clientes de prueba
    clients = []
    for i in range(1, 11):
        client = User(
            email=f'cliente{i}@example.com',
            full_name=f'Cliente {i}',
            role='client',
            active=True
        )
        client.set_password('cliente123')
        db.session.add(client)
        clients.append(client)
    
    print(f"   ✓ {len(clients)} clientes creados")
    
    # Admin
    admin = User(
        email='admin@reformery.com',
        full_name='Administrador REFORMERY',
        role='admin',
        active=True
    )
    admin.set_password('admin123')
    db.session.add(admin)
    print("   ✓ 1 administrador creado\n")
    
    db.session.commit()
    
    # ========================================================================
    # CREAR REGISTROS DE INSTRUCTORES
    # ========================================================================
    
    print("🧘 Creando registros de instructores...")
    instructors = []
    for user, data in instructor_users:
        instructor = Instructor(
            user_id=user.id,
            specialization=data['specialization'],
            bio=data['bio'],
            active=True
        )
        db.session.add(instructor)
        instructors.append(instructor)
    
    db.session.commit()
    print(f"   ✓ {len(instructors)} instructores creados\n")
    
    # ========================================================================
    # CREAR 9 PAQUETES REFORMERY - DATOS REALES
    # ========================================================================
    
    print("📦 Creando 9 paquetes REFORMERY (todos 30 días vigencia)...")
    
    packages_data = [
        {
            'name': 'PAQUETE 1 - REFORMERY MUESTRA',
            'description': 'Vale por 1 clase REFORMERY MUESTRA',
            'total_classes': 1,
            'validity_days': 30,
            'price': 150.00
        },
        {
            'name': 'PAQUETE 2 - REFORMERY',
            'description': 'Vale por 1 clase REFORMERY',
            'total_classes': 1,
            'validity_days': 30,
            'price': 200.00
        },
        {
            'name': 'PAQUETE 3 - 5 CLASES',
            'description': 'Vale por 5 clases REFORMERY',
            'total_classes': 5,
            'validity_days': 30,
            'price': 800.00
        },
        {
            'name': 'PAQUETE 4 - 8 CLASES',
            'description': 'Vale por 8 clases REFORMERY',
            'total_classes': 8,
            'validity_days': 30,
            'price': 1000.00
        },
        {
            'name': 'PAQUETE 5 - 12 CLASES',
            'description': 'Vale por 12 clases REFORMERY',
            'total_classes': 12,
            'validity_days': 30,
            'price': 1400.00
        },
        {
            'name': 'PAQUETE 6 - 20 CLASES',
            'description': 'Vale por 20 clases REFORMERY',
            'total_classes': 20,
            'validity_days': 30,
            'price': 1900.00
        },
        {
            'name': 'PAQUETE DUO',
            'description': '1 clase REFORMERY + 1 clase TOP BARRE',
            'total_classes': 2,
            'validity_days': 30,
            'price': 380.00
        },
        {
            'name': 'PAQUETE 5+5',
            'description': '5 clases REFORMERY + 5 clases TOP BARRE',
            'total_classes': 10,
            'validity_days': 30,
            'price': 1400.00
        },
        {
            'name': 'PAQUETE 8+8',
            'description': '8 clases REFORMERY + 8 clases TOP BARRE',
            'total_classes': 16,
            'validity_days': 30,
            'price': 1800.00
        }
    ]
    
    packages = []
    for package_data in packages_data:
        package = Package(
            name=package_data['name'],
            description=package_data['description'],
            total_classes=package_data['total_classes'],
            validity_days=package_data['validity_days'],
            price=package_data['price'],
            active=True
        )
        db.session.add(package)
        packages.append(package)
    
    db.session.commit()
    print(f"   ✓ 9 paquetes REFORMERY creados (todos con 30 días de vigencia)\n")
    
    # ========================================================================
    # CREAR 7 CLASES REFORMERY - DATOS REALES
    # ========================================================================
    
    print("🏋️ Creando 7 clases REFORMERY...")
    
    classes_data = [
        {
            'name': 'PLT FIT',
            'description': 'Clase de Pilates enfocada en fitness y tonificación muscular',
            'duration': 50,
            'difficulty_level': 'Intermedio',
            'max_participants': 10,
            'color': '#8BA88D'
        },
        {
            'name': 'PLT BLAST',
            'description': 'Clase intensa de Pilates con cardio de alto impacto',
            'duration': 50,
            'difficulty_level': 'Avanzado',
            'max_participants': 10,
            'color': '#E8B4B8'
        },
        {
            'name': 'PLT JUMP',
            'description': 'Clase de Pilates en trampolín para cardio y coordinación',
            'duration': 50,
            'difficulty_level': 'Intermedio',
            'max_participants': 8,
            'color': '#B8D4E8'
        },
        {
            'name': 'PLT HIT',
            'description': 'Entrenamiento de alta intensidad con Pilates',
            'duration': 50,
            'difficulty_level': 'Avanzado',
            'max_participants': 10,
            'color': '#E8D4B8'
        },
        {
            'name': 'PLT PRIVADA TRAPEZE',
            'description': 'Sesión privada de Pilates en trapecio',
            'duration': 50,
            'difficulty_level': 'Todos los niveles',
            'max_participants': 2,
            'color': '#D4E8B8'
        },
        {
            'name': 'PLT PRIVADAS Y SEMIPRIVADAS',
            'description': 'Sesiones privadas y semiprivadas personalizadas',
            'duration': 50,
            'difficulty_level': 'Todos los niveles',
            'max_participants': 4,
            'color': '#C8A8E8'
        },
        {
            'name': 'PLT EMBARAZADAS',
            'description': 'Clase de Pilates especializada para mujeres embarazadas',
            'duration': 50,
            'difficulty_level': 'Principiante',
            'max_participants': 8,
            'color': '#E8C8D4'
        }
    ]
    
    pilates_classes = []
    for class_data in classes_data:
        pilates_class = PilatesClass(
            name=class_data['name'],
            description=class_data['description'],
            duration=class_data['duration'],
            difficulty_level=class_data['difficulty_level'],
            max_participants=class_data['max_participants'],
            color=class_data['color'],
            active=True
        )
        db.session.add(pilates_class)
        pilates_classes.append(pilates_class)
    
    db.session.commit()
    print(f"   ✓ 7 clases REFORMERY creadas\n")
    
    # ========================================================================
    # ASIGNAR PAQUETES A CLIENTES
    # ========================================================================
    
    print("📋 Asignando paquetes a clientes de prueba...")
    for i, client in enumerate(clients):
        # Asignar diferentes paquetes para variedad
        package = packages[i % len(packages)]
        
        # Calcular fechas
        purchase_date = datetime.utcnow() - timedelta(days=random.randint(0, 10))
        expiry_date = purchase_date + timedelta(days=package.validity_days)
        
        # Usar algunas clases al azar
        used_classes = random.randint(0, min(3, package.total_classes))
        
        user_package = UserPackage(
            user_id=client.id,
            package_id=package.id,
            purchase_date=purchase_date,
            expiry_date=expiry_date,
            total_classes=package.total_classes,
            used_classes=used_classes,
            remaining_classes=package.total_classes - used_classes,
            status='active'
        )
        db.session.add(user_package)
    
    db.session.commit()
    print(f"   ✓ {len(clients)} paquetes asignados a clientes\n")
    
    # ========================================================================
    # CREAR HORARIOS PROGRAMADOS (4 SEMANAS)
    # ========================================================================
    
    print("📅 Creando horarios programados (próximas 4 semanas)...")
    
    schedules_created = 0
    start_date = datetime.utcnow()
    
    # Horarios típicos de un centro fitness
    # Lunes a Viernes: 6am, 7am, 8am, 9am, 10am, 5pm, 6pm, 7pm, 8pm
    # Sábado: 8am, 9am, 10am, 11am, 12pm
    # Domingo: 9am, 10am, 11am
    
    schedule_times = {
        0: [6, 7, 8, 9, 10, 17, 18, 19, 20],  # Lunes
        1: [6, 7, 8, 9, 10, 17, 18, 19, 20],  # Martes
        2: [6, 7, 8, 9, 10, 17, 18, 19, 20],  # Miércoles
        3: [6, 7, 8, 9, 10, 17, 18, 19, 20],  # Jueves
        4: [6, 7, 8, 9, 10, 17, 18, 19, 20],  # Viernes
        5: [8, 9, 10, 11, 12],                # Sábado
        6: [9, 10, 11]                        # Domingo
    }
    
    for week in range(4):
        for day in range(7):
            schedule_date = start_date + timedelta(days=(week * 7 + day))
            day_of_week = schedule_date.weekday()
            
            hours = schedule_times.get(day_of_week, [])
            
            for hour in hours:
                # Seleccionar clase e instructor
                pilates_class = random.choice(pilates_classes)
                instructor = random.choice(instructors)
                
                start_time = schedule_date.replace(
                    hour=hour, 
                    minute=0, 
                    second=0, 
                    microsecond=0
                )
                end_time = start_time + timedelta(minutes=pilates_class.duration)
                
                # Verificar que no haya conflicto de instructor
                conflict = ClassSchedule.query.filter(
                    ClassSchedule.instructor_id == instructor.id,
                    ClassSchedule.start_time < end_time,
                    ClassSchedule.end_time > start_time
                ).first()
                
                if not conflict:
                    schedule = ClassSchedule(
                        pilates_class_id=pilates_class.id,
                        instructor_id=instructor.id,
                        start_time=start_time,
                        end_time=end_time,
                        max_capacity=pilates_class.max_participants,
                        status='scheduled',
                        notes=''
                    )
                    db.session.add(schedule)
                    schedules_created += 1
    
    db.session.commit()
    print(f"   ✓ {schedules_created} horarios programados creados\n")
    
    # ========================================================================
    # CREAR ALGUNAS RESERVAS DE EJEMPLO
    # ========================================================================
    
    print("🎫 Creando reservas de ejemplo...")
    
    # Obtener horarios de la semana actual
    week_start = datetime.utcnow()
    week_end = week_start + timedelta(days=7)
    
    current_schedules = ClassSchedule.query.filter(
        ClassSchedule.start_time >= week_start,
        ClassSchedule.start_time < week_end,
        ClassSchedule.status == 'scheduled'
    ).limit(20).all()
    
    reservations_created = 0
    for schedule in current_schedules:
        # 50% de probabilidad de tener reservas
        if random.random() > 0.5:
            continue
        
        # Seleccionar clientes aleatorios (1-3 por clase)
        num_reservations = random.randint(1, min(3, schedule.max_capacity))
        selected_clients = random.sample(clients, num_reservations)
        
        for client in selected_clients:
            # Obtener paquete activo del cliente
            user_package = UserPackage.query.filter_by(
                user_id=client.id,
                status='active'
            ).first()
            
            if user_package and user_package.remaining_classes > 0:
                reservation = Reservation(
                    user_id=client.id,
                    schedule_id=schedule.id,
                    user_package_id=user_package.id,
                    status='confirmed',
                    reservation_date=datetime.utcnow() - timedelta(days=random.randint(1, 5))
                )
                db.session.add(reservation)
                
                # Usar clase del paquete
                user_package.use_class()
                
                reservations_created += 1
    
    db.session.commit()
    print(f"   ✓ {reservations_created} reservas de ejemplo creadas\n")
    
    # ========================================================================
    # RESUMEN FINAL
    # ========================================================================
    
    print("="*80)
    print("✅ ¡BASE DE DATOS POBLADA EXITOSAMENTE CON DATOS REALES DE REFORMERY!")
    print("="*80 + "\n")
    
    print("📊 RESUMEN DE DATOS:")
    print(f"   • Usuarios totales: {User.query.count()}")
    print(f"   • Instructores: {Instructor.query.count()}")
    print(f"   • Clientes: {User.query.filter_by(role='client').count()}")
    print(f"   • Administradores: {User.query.filter_by(role='admin').count()}")
    print(f"   • Paquetes REFORMERY: {Package.query.count()} (todos con 30 días)")
    print(f"   • Clases REFORMERY: {PilatesClass.query.count()}")
    print(f"   • Paquetes asignados: {UserPackage.query.count()}")
    print(f"   • Horarios programados: {ClassSchedule.query.count()}")
    print(f"   • Reservas activas: {Reservation.query.filter_by(status='confirmed').count()}\n")
    
    print("🏋️ 7 CLASES REFORMERY:")
    for cls in PilatesClass.query.all():
        print(f"   • {cls.name} ({cls.difficulty_level}) - Max: {cls.max_participants} personas")
    print()
    
    print("💰 9 PAQUETES REFORMERY (todos 30 días vigencia):")
    for pkg in Package.query.all():
        print(f"   • {pkg.name}: {pkg.total_classes} clases - ${pkg.price:.2f} MXN")
    print()
    
    print("🔐 CREDENCIALES DE ACCESO:")
    print("\n   👨‍💼 ADMINISTRADOR:")
    print("      Email: admin@reformery.com")
    print("      Password: admin123")
    
    print("\n   👤 CLIENTE DE PRUEBA:")
    print("      Email: cliente1@example.com")
    print("      Password: cliente123")
    
    print("\n   🧘 INSTRUCTOR DE PRUEBA:")
    print("      Email: sofia.martinez@reformery.com")
    print("      Password: instructor123")
    
    print("\n" + "="*80)
    print("🚀 SISTEMA LISTO PARA USAR")
    print("="*80 + "\n")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        seed_reformery_data()