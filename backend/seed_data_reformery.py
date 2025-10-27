from app import create_app, db
from models import User, Package, UserPackage, PilatesClass, Instructor, ClassSchedule, Reservation
from datetime import datetime, timedelta
import random

def seed_reformery_data():
    """
    Puebla la base de datos con datos reales de REFORMERY
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
            'bio': 'Instructor certificado con más de 8 años de experiencia en Pilates Reformer.'
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
            'bio': 'Instructor certificado especializado en clases privadas y embarazadas.'
        },
        {
            'email': 'ana.lopez@reformery.com',
            'password': 'instructor123',
            'full_name': 'Ana López',
            'specialization': 'PLT FIT, PLT JUMP, PLT EMBARAZADAS',
            'bio': 'Instructor certificado con experiencia en fitness funcional y prenatal.'
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
    
    # Clientes
    clients = []
    for i in range(1, 11):
        client = User(
            email=f'cliente{i}@example.com',
            full_name=f'Cliente {i}',
            role='client',
            active=True
        )
        client.set_password('client123')
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
    for user, data in instructor_users:
        instructor = Instructor(
            user_id=user.id,
            specialization=data['specialization'],
            bio=data['bio'],
            active=True
        )
        db.session.add(instructor)
    
    db.session.commit()
    print(f"   ✓ {len(instructor_users)} instructores creados\n")
    
    # ========================================================================
    # CREAR PAQUETES REFORMERY (DATOS REALES)
    # ========================================================================
    
    print("📦 Creando paquetes REFORMERY...")
    packages_data = [
        {
            'name': 'PAQUETE 1',
            'description': '1 clase REFORMERY MUESTRA',
            'total_classes': 1,
            'validity_days': 30,
            'price': 150.00
        },
        {
            'name': 'PAQUETE 2',
            'description': '1 clase REFORMERY',
            'total_classes': 1,
            'validity_days': 30,
            'price': 200.00
        },
        {
            'name': 'PAQUETE 3',
            'description': '5 clases REFORMERY',
            'total_classes': 5,
            'validity_days': 30,
            'price': 800.00
        },
        {
            'name': 'PAQUETE 4',
            'description': '8 clases REFORMERY',
            'total_classes': 8,
            'validity_days': 30,
            'price': 1000.00
        },
        {
            'name': 'PAQUETE 5',
            'description': '12 clases REFORMERY',
            'total_classes': 12,
            'validity_days': 30,
            'price': 1400.00
        },
        {
            'name': 'PAQUETE 6',
            'description': '20 clases REFORMERY',
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
    print(f"   ✓ {len(packages)} paquetes REFORMERY creados\n")
    
    # ========================================================================
    # CREAR CLASES REFORMERY (DATOS REALES)
    # ========================================================================
    
    print("🏋️ Creando clases REFORMERY...")
    classes_data = [
        {
            'name': 'PLT FIT',
            'description': 'Clase de Pilates enfocada en fitness y tonificación muscular',
            'duration': 50,
            'difficulty_level': 'intermedio',
            'max_participants': 10
        },
        {
            'name': 'PLT BLAST',
            'description': 'Clase intensa de Pilates con cardio de alto impacto',
            'duration': 50,
            'difficulty_level': 'avanzado',
            'max_participants': 10
        },
        {
            'name': 'PLT JUMP',
            'description': 'Clase de Pilates en trampolín para cardio y coordinación',
            'duration': 50,
            'difficulty_level': 'intermedio',
            'max_participants': 8
        },
        {
            'name': 'PLT HIT',
            'description': 'Entrenamiento de alta intensidad con Pilates',
            'duration': 50,
            'difficulty_level': 'avanzado',
            'max_participants': 10
        },
        {
            'name': 'PLT PRIVADA TRAPEZE',
            'description': 'Sesión privada de Pilates en trapecio',
            'duration': 50,
            'difficulty_level': 'todos',
            'max_participants': 2
        },
        {
            'name': 'PLT PRIVADAS Y SEMIPRIVADAS',
            'description': 'Sesiones privadas y semiprivadas personalizadas',
            'duration': 50,
            'difficulty_level': 'todos',
            'max_participants': 4
        },
        {
            'name': 'PLT EMBARAZADAS',
            'description': 'Clase de Pilates especializada para mujeres embarazadas',
            'duration': 50,
            'difficulty_level': 'principiante',
            'max_participants': 8
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
            active=True
        )
        db.session.add(pilates_class)
        pilates_classes.append(pilates_class)
    
    db.session.commit()
    print(f"   ✓ {len(pilates_classes)} clases REFORMERY creadas\n")
    
    # ========================================================================
    # ASIGNAR PAQUETES A CLIENTES
    # ========================================================================
    
    print("📋 Asignando paquetes a clientes...")
    for client in clients:
        # Asignar paquete aleatorio
        package = random.choice(packages[:6])  # Solo paquetes regulares para demo
        
        # Calcular fecha de expiración
        purchase_date = datetime.utcnow()
        expiry_date = purchase_date + timedelta(days=package.validity_days)
        
        # Crear user_package con TODOS los campos requeridos
        user_package = UserPackage(
            user_id=client.id,
            package_id=package.id,
            purchase_date=purchase_date,
            expiry_date=expiry_date,
            total_classes=package.total_classes,
            used_classes=0,
            remaining_classes=package.total_classes,
            status='active'
        )
        db.session.add(user_package)
    
    db.session.commit()
    print(f"   ✓ Paquetes asignados a clientes\n")
    
    # ========================================================================
    # CREAR HORARIOS PROGRAMADOS
    # ========================================================================
    
    print("📅 Creando horarios programados...")
    
    # Obtener instructores creados
    instructors = Instructor.query.all()
    
    # Crear horarios para las próximas 4 semanas
    schedules_created = 0
    start_date = datetime.utcnow()
    
    for week in range(4):
        for day in range(7):  # Lunes a Domingo
            schedule_date = start_date + timedelta(days=(week * 7 + day))
            
            # Horarios del día: 7am, 8am, 9am, 10am, 5pm, 6pm, 7pm
            hours = [7, 8, 9, 10, 17, 18, 19]
            
            for hour in hours:
                # Seleccionar clase e instructor aleatorios
                pilates_class = random.choice(pilates_classes)
                instructor = random.choice(instructors)
                
                start_time = schedule_date.replace(hour=hour, minute=0, second=0, microsecond=0)
                end_time = start_time + timedelta(minutes=pilates_class.duration)
                
                schedule = ClassSchedule(
                    pilates_class_id=pilates_class.id,
                    instructor_id=instructor.id,
                    start_time=start_time,
                    end_time=end_time,
                    max_capacity=pilates_class.max_participants,
                    available_spots=pilates_class.max_participants,
                    status='scheduled',
                    notes=''
                )
                db.session.add(schedule)
                schedules_created += 1
    
    db.session.commit()
    print(f"   ✓ {schedules_created} horarios creados\n")
    
    # ========================================================================
    # RESUMEN
    # ========================================================================
    
    print("="*80)
    print("✅ ¡BASE DE DATOS POBLADA EXITOSAMENTE CON DATOS REFORMERY!")
    print("="*80 + "\n")
    
    print("📊 RESUMEN:")
    print(f"   • Usuarios totales: {User.query.count()}")
    print(f"   • Instructores: {User.query.filter_by(role='instructor').count()}")
    print(f"   • Clientes: {User.query.filter_by(role='client').count()}")
    print(f"   • Administradores: {User.query.filter_by(role='admin').count()}")
    print(f"   • Paquetes REFORMERY: {Package.query.count()}")
    print(f"   • Clases REFORMERY: {PilatesClass.query.count()}")
    print(f"   • Paquetes asignados: {UserPackage.query.count()}")
    print(f"   • Horarios programados: {ClassSchedule.query.count()}\n")
    
    print("📦 CLASES REFORMERY:")
    for cls in PilatesClass.query.all():
        print(f"   • {cls.name}")
    print()
    
    print("💰 PAQUETES REFORMERY:")
    for pkg in Package.query.all():
        print(f"   • {pkg.name} - {pkg.total_classes} clases - ${pkg.price}")
    print()
    
    print("🔐 CREDENCIALES DE PRUEBA:")
    print("   Admin:")
    print("   • Email: admin@reformery.com")
    print("   • Password: admin123\n")
    print("   Cliente de prueba:")
    print("   • Email: cliente1@example.com")
    print("   • Password: client123\n")
    print("   Instructor de prueba:")
    print("   • Email: sofia.martinez@reformery.com")
    print("   • Password: instructor123\n")
    print("="*80 + "\n")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        seed_reformery_data()