# services/admin_service.py
# Servicio de lógica de negocio para administración
# Autor: @elisarrtech con Elite AI Architect

from extensions import db
from models import User, Package, UserPackage, PilatesClass, ClassSchedule, Reservation
from utils.exceptions import ValidationError, NotFoundError
from datetime import datetime, timedelta


class AdminService:
    # Servicio para funciones administrativas
    
    @staticmethod
    def create_package(name, total_classes, validity_days, price, description='', active=True):
        # Crea un nuevo paquete
        
        package = Package(
            name=name,
            description=description,
            total_classes=total_classes,
            validity_days=validity_days,
            price=price,
            active=active
        )
        
        db.session.add(package)
        db.session.commit()
        
        return package
    
    @staticmethod
    def assign_package_to_user(user_id, package_id):
        # Asigna un paquete a un usuario
        
        # Verificar que el usuario existe
        user = User.query.get(user_id)
        if not user:
            raise NotFoundError("Usuario no encontrado")
        
        # Verificar que el paquete existe
        package = Package.query.get(package_id)
        if not package:
            raise NotFoundError("Paquete no encontrado")
        
        # Crear UserPackage
        user_package = UserPackage(
            user_id=user_id,
            package_id=package_id,
            purchase_date=datetime.utcnow(),
            expiry_date=datetime.utcnow() + timedelta(days=package.validity_days),
            total_classes=package.total_classes,
            used_classes=0,
            remaining_classes=package.total_classes,
            status='active'
        )
        
        db.session.add(user_package)
        db.session.commit()
        
        return user_package
    
    @staticmethod
    def create_class(name, description='', duration_minutes=50, max_capacity=10, color='#8BA88D', active=True):
        # Crea una nueva clase
        
        pilates_class = PilatesClass(
            name=name,
            description=description,
            duration_minutes=duration_minutes,
            max_capacity=max_capacity,
            color=color,
            active=active
        )
        
        db.session.add(pilates_class)
        db.session.commit()
        
        return pilates_class
    
    @staticmethod
    def create_schedule(pilates_class_id, instructor_id, start_time, end_time, max_capacity=10, notes=''):
        # Crea un nuevo horario
        
        schedule = ClassSchedule(
            pilates_class_id=pilates_class_id,
            instructor_id=instructor_id,
            start_time=start_time,
            end_time=end_time,
            max_capacity=max_capacity,
            current_reservations=0,
            status='scheduled',
            notes=notes
        )
        
        db.session.add(schedule)
        db.session.commit()
        
        return schedule
    
    @staticmethod
    def get_statistics():
        # Obtiene estadísticas del sistema
        
        stats = {
            'users': {
                'total': User.query.count(),
                'clients': User.query.filter_by(role='client').count(),
                'instructors': User.query.filter_by(role='instructor').count()
            },
            'packages': {
                'total': Package.query.count(),
                'active': Package.query.filter_by(active=True).count()
            },
            'classes': {
                'total': PilatesClass.query.count()
            },
            'reservations': {
                'total': Reservation.query.count(),
                'confirmed': Reservation.query.filter_by(status='confirmed').count(),
                'cancelled': Reservation.query.filter_by(status='cancelled').count()
            },
            'schedules': {
                'total': ClassSchedule.query.count(),
                'scheduled': ClassSchedule.query.filter_by(status='scheduled').count()
            }
        }
        
        return stats
