"""
Admin Routes - CRUD Completo con Schedules
@version 2.0.0
@author @elisarrtech
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.pilates_class import PilatesClass
from app.models.package import Package
from app.models.schedule import Schedule
from app.models.user_package import UserPackage  # ✅ AGREGAR
from app.models.reservation import Reservation    # ✅ AGREGAR
from email_validator import validate_email, EmailNotValidError
from app.models.notification import Notification
from datetime import datetime, time, date
from functools import wraps

admin_bp = Blueprint('admin', __name__)


def admin_required(fn):
    """Decorator to require admin role"""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'success': False, 'message': 'Se requieren permisos de administrador'}), 403
        
        return fn(*args, **kwargs)
    return wrapper


# ==================== STATISTICS ====================
@admin_bp.route('/statistics', methods=['GET'])
@admin_required
def get_statistics():
    """Get dashboard statistics"""
    try:
        total_users = User.query.count()
        clients = User.query.filter_by(role='client').count()
        instructors = User.query.filter_by(role='instructor').count()
        active_users = User.query.filter_by(active=True).count()
        
        total_packages = Package.query.count()
        active_packages = Package.query.filter_by(active=True).count()
        
        total_classes = PilatesClass.query.count()
        active_classes = PilatesClass.query.filter_by(active=True).count()
        
        total_schedules = Schedule.query.count()
        scheduled = Schedule.query.filter_by(status='scheduled').count()
        cancelled = Schedule.query.filter_by(status='cancelled').count()
        completed = Schedule.query.filter_by(status='completed').count()
        
        stats = {
            'users': {'total': total_users, 'clients': clients, 'instructors': instructors, 'active': active_users},
            'packages': {'total': total_packages, 'active': active_packages, 'assigned': 0},
            'classes': {'total': total_classes, 'active': active_classes},
            'schedules': {'total': total_schedules, 'scheduled': scheduled, 'cancelled': cancelled, 'completed': completed},
            'reservations': {'total': 0, 'confirmed': 0, 'cancelled': 0}
        }
        
        return jsonify({'success': True, 'data': stats}), 200
        
    except Exception as e:
        print(f"❌ [ADMIN] Error getting statistics: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al obtener estadísticas', 'error': str(e)}), 500


# ==================== USERS CRUD ====================
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    """Get all users"""
    try:
        users = User.query.all()
        return jsonify({'success': True, 'data': [user.to_dict() for user in users]}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error al obtener usuarios', 'error': str(e)}), 500


@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    """Update user"""
    try:
        data = request.get_json()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404
        
        if 'email' in data and data['email'] != user.email:
            try:
                validate_email(data['email'])
            except EmailNotValidError:
                return jsonify({'success': False, 'message': 'Email inválido'}), 400
            
            existing = User.query.filter_by(email=data['email']).first()
            if existing and existing.id != user_id:
                return jsonify({'success': False, 'message': 'El email ya está registrado'}), 409
            user.email = data['email']
        
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'role' in data and data['role'] in ['admin', 'instructor', 'client']:
            user.role = data['role']
        if 'active' in data:
            user.active = data['active']
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        
        db.session.commit()
        print(f"✅ [ADMIN] Usuario actualizado: {user.email}")
        return jsonify({'success': True, 'message': 'Usuario actualizado exitosamente', 'data': user.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ [ADMIN] Error updating user: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al actualizar usuario', 'error': str(e)}), 500


# ==================== PACKAGES CRUD ====================
@admin_bp.route('/packages', methods=['GET'])
@admin_required
def get_packages():
    """Get all packages"""
    try:
        packages = Package.query.order_by(Package.display_order).all()
        return jsonify({'success': True, 'data': [pkg.to_dict() for pkg in packages]}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error al obtener paquetes', 'error': str(e)}), 500


@admin_bp.route('/packages', methods=['POST'])
@admin_required
def create_package():
    """Create new package"""
    try:
        data = request.get_json()
        required_fields = ['name', 'total_classes', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'message': f'Campo requerido: {field}'}), 400
        
        existing = Package.query.filter_by(name=data['name']).first()
        if existing:
            return jsonify({'success': False, 'message': 'Ya existe un paquete con ese nombre'}), 409
        
        package = Package(
            name=data['name'],
            description=data.get('description', ''),
            total_classes=data['total_classes'],
            total_classes_reformer=data.get('total_classes_reformer', data['total_classes']),
            total_classes_top_barre=data.get('total_classes_top_barre', 0),
            validity_days=data.get('validity_days', 30),
            price=data['price'],
            package_type=data.get('package_type', 'individual'),
            active=data.get('active', True),
            display_order=data.get('display_order', 0)
        )
        
        db.session.add(package)
        db.session.commit()
        print(f"✅ [ADMIN] Paquete creado: {package.name}")
        return jsonify({'success': True, 'message': 'Paquete creado exitosamente', 'data': package.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al crear paquete', 'error': str(e)}), 500


@admin_bp.route('/packages/<int:package_id>', methods=['PUT'])
@admin_required
def update_package(package_id):
    """Update package"""
    try:
        data = request.get_json()
        package = Package.query.get(package_id)
        if not package:
            return jsonify({'success': False, 'message': 'Paquete no encontrado'}), 404
        
        if 'name' in data and data['name'] != package.name:
            existing = Package.query.filter_by(name=data['name']).first()
            if existing and existing.id != package_id:
                return jsonify({'success': False, 'message': 'Ya existe un paquete con ese nombre'}), 409
        
        updateable_fields = ['name', 'description', 'total_classes', 'total_classes_reformer', 'total_classes_top_barre', 'validity_days', 'price', 'package_type', 'active', 'display_order']
        for field in updateable_fields:
            if field in data:
                setattr(package, field, data[field])
        
        db.session.commit()
        print(f"✅ [ADMIN] Paquete actualizado: {package.name}")
        return jsonify({'success': True, 'message': 'Paquete actualizado exitosamente', 'data': package.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al actualizar paquete', 'error': str(e)}), 500


# ==================== CLASSES ====================
@admin_bp.route('/classes', methods=['GET'])
@admin_required
def get_classes():
    """Get all classes"""
    try:
        classes = PilatesClass.query.filter_by(active=True).all()
        return jsonify({'success': True, 'data': [cls.to_dict() for cls in classes]}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error al obtener clases', 'error': str(e)}), 500


@admin_bp.route('/classes', methods=['POST'])
@admin_required
def create_class():
    """Create new class"""
    try:
        data = request.get_json()
        
        print(f"📝 [ADMIN] Datos recibidos para crear clase: {data}")
        
        # Validate required fields
        if 'name' not in data or not data['name']:
            return jsonify({'success': False, 'message': 'El nombre es requerido'}), 400
        
        # Check if class name already exists
        existing = PilatesClass.query.filter_by(name=data['name']).first()
        if existing:
            return jsonify({'success': False, 'message': 'Ya existe una clase con ese nombre'}), 409
        
        # Create class
        pilates_class = PilatesClass(
            name=data['name'],
            description=data.get('description', ''),
            duration=data.get('duration', 50),
            max_capacity=data.get('max_capacity', 10),
            category=data.get('category', 'grupal'),
            intensity_level=data.get('intensity_level', 'media'),
            active=data.get('active', True)
        )
        
        db.session.add(pilates_class)
        db.session.commit()
        
        print(f"✅ [ADMIN] Clase creada: {pilates_class.name}")
        return jsonify({'success': True, 'message': 'Clase creada exitosamente', 'data': pilates_class.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ [ADMIN] Error creating class: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error al crear clase', 'error': str(e)}), 500


@admin_bp.route('/classes/<int:class_id>', methods=['PUT'])
@admin_required
def update_class(class_id):
    """Update class"""
    try:
        data = request.get_json()
        pilates_class = PilatesClass.query.get(class_id)
        if not pilates_class:
            return jsonify({'success': False, 'message': 'Clase no encontrada'}), 404
        
        # Check if name already exists (if changing name)
        if 'name' in data and data['name'] != pilates_class.name:
            existing = PilatesClass.query.filter_by(name=data['name']).first()
            if existing and existing.id != class_id:
                return jsonify({'success': False, 'message': 'Ya existe una clase con ese nombre'}), 409
        
        # Update fields
        updateable_fields = ['name', 'description', 'duration', 'max_capacity', 'category', 'intensity_level', 'active']
        for field in updateable_fields:
            if field in data:
                setattr(pilates_class, field, data[field])
        
        db.session.commit()
        print(f"✅ [ADMIN] Clase actualizada: {pilates_class.name}")
        return jsonify({'success': True, 'message': 'Clase actualizada exitosamente', 'data': pilates_class.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ [ADMIN] Error updating class: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al actualizar clase', 'error': str(e)}), 500


@admin_bp.route('/classes/<int:class_id>', methods=['DELETE'])
@admin_required
def delete_class(class_id):
    """Delete class (soft delete - set inactive)"""
    try:
        pilates_class = PilatesClass.query.get(class_id)
        if not pilates_class:
            return jsonify({'success': False, 'message': 'Clase no encontrada'}), 404
        
        pilates_class.active = False
        db.session.commit()
        
        print(f"✅ [ADMIN] Clase desactivada: {pilates_class.name}")
        return jsonify({'success': True, 'message': 'Clase desactivada exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al eliminar clase', 'error': str(e)}), 500

# ==================== SCHEDULES CRUD COMPLETO ====================
@admin_bp.route('/schedules', methods=['GET'])
@admin_required
def get_schedules():
    """Get all schedules"""
    try:
        schedules = Schedule.query.order_by(Schedule.date.desc(), Schedule.start_time.desc()).all()
        return jsonify({'success': True, 'data': [schedule.to_dict() for schedule in schedules]}), 200
    except Exception as e:
        print(f"❌ [ADMIN] Error getting schedules: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al obtener horarios', 'error': str(e)}), 500


@admin_bp.route('/schedules', methods=['POST'])
@admin_required
def create_schedule():
    """Create new schedule"""
    try:
        data = request.get_json()
        
        print(f"📅 [ADMIN] Schedule data received: {data}")
        
        # Validate required fields
        required_fields = ['class_id', 'instructor_id', 'date', 'start_time', 'end_time']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'message': f'Campo requerido: {field}'}), 400
        
        # Validate class exists
        pilates_class = PilatesClass.query.get(data['class_id'])
        if not pilates_class:
            return jsonify({'success': False, 'message': 'Clase no encontrada'}), 404
        
        # Validate instructor exists and is actually an instructor
        instructor = User.query.get(data['instructor_id'])
        if not instructor:
            return jsonify({'success': False, 'message': 'Instructor no encontrado'}), 404
        if instructor.role != 'instructor':
            return jsonify({'success': False, 'message': 'El usuario seleccionado no es un instructor'}), 400
        
        # Parse date and times
        schedule_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        start_time_obj = datetime.strptime(data['start_time'], '%H:%M').time()
        end_time_obj = datetime.strptime(data['end_time'], '%H:%M').time()
        
        # Create schedule
        schedule = Schedule(
            class_id=data['class_id'],
            instructor_id=data['instructor_id'],
            date=schedule_date,
            start_time=start_time_obj,
            end_time=end_time_obj,
            max_capacity=data.get('max_capacity', pilates_class.max_capacity),
            current_capacity=0,
            available_spots=data.get('max_capacity', pilates_class.max_capacity),
            status='scheduled',
            active=True,
            notes=data.get('notes', '')
        )
        
        db.session.add(schedule)
        db.session.commit()
        
        print(f"✅ [ADMIN] Horario creado: {pilates_class.name} - {schedule_date} {start_time_obj}")
        return jsonify({'success': True, 'message': 'Horario creado exitosamente', 'data': schedule.to_dict()}), 201
        
    except ValueError as e:
        print(f"❌ [ADMIN] Validation error: {str(e)}")
        return jsonify({'success': False, 'message': 'Formato de fecha u hora inválido', 'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        print(f"❌ [ADMIN] Error creating schedule: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error al crear horario', 'error': str(e)}), 500


@admin_bp.route('/schedules/<int:schedule_id>', methods=['PUT'])
@admin_required
def update_schedule(schedule_id):
    """Update schedule"""
    try:
        data = request.get_json()
        schedule = Schedule.query.get(schedule_id)
        if not schedule:
            return jsonify({'success': False, 'message': 'Horario no encontrado'}), 404
        
        # Update fields
        if 'class_id' in data:
            pilates_class = PilatesClass.query.get(data['class_id'])
            if not pilates_class:
                return jsonify({'success': False, 'message': 'Clase no encontrada'}), 404
            schedule.class_id = data['class_id']
        
        if 'instructor_id' in data:
            instructor = User.query.get(data['instructor_id'])
            if not instructor or instructor.role != 'instructor':
                return jsonify({'success': False, 'message': 'Instructor inválido'}), 400
            schedule.instructor_id = data['instructor_id']
        
        if 'date' in data:
            schedule.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'start_time' in data:
            schedule.start_time = datetime.strptime(data['start_time'], '%H:%M').time()
        if 'end_time' in data:
            schedule.end_time = datetime.strptime(data['end_time'], '%H:%M').time()
        if 'status' in data:
            schedule.status = data['status']
        if 'notes' in data:
            schedule.notes = data['notes']
        
        db.session.commit()
        print(f"✅ [ADMIN] Horario actualizado: {schedule.id}")
        return jsonify({'success': True, 'message': 'Horario actualizado exitosamente', 'data': schedule.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al actualizar horario', 'error': str(e)}), 500


@admin_bp.route('/schedules/<int:schedule_id>', methods=['DELETE'])
@admin_required
def delete_schedule(schedule_id):
    """Delete schedule (soft delete)"""
    try:
        schedule = Schedule.query.get(schedule_id)
        if not schedule:
            return jsonify({'success': False, 'message': 'Horario no encontrado'}), 404
        
        schedule.active = False
        schedule.status = 'cancelled'
        db.session.commit()
        
        print(f"✅ [ADMIN] Horario cancelado: {schedule.id}")
        return jsonify({'success': True, 'message': 'Horario cancelado exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al eliminar horario', 'error': str(e)}), 500
    
    
# ==================== USER PACKAGES (Paquetes de Alumnos) ====================
@admin_bp.route('/user-packages', methods=['GET'])
@admin_required
def get_user_packages():
    """Get all user packages"""
    try:
        user_packages = UserPackage.query.all()
        return jsonify({'success': True, 'data': [up.to_dict() for up in user_packages]}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error al obtener paquetes de usuarios', 'error': str(e)}), 500


@admin_bp.route('/user-packages/user/<int:user_id>', methods=['GET'])
@admin_required
def get_user_packages_by_user(user_id):
    """Get user packages by user ID"""
    try:
        user_packages = UserPackage.query.filter_by(user_id=user_id).all()
        return jsonify({'success': True, 'data': [up.to_dict() for up in user_packages]}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error al obtener paquetes del usuario', 'error': str(e)}), 500


@admin_bp.route('/user-packages', methods=['POST'])
@admin_required
def assign_package_to_user():
    """Assign package to user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'package_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'message': f'Campo requerido: {field}'}), 400
        
        # Get user and package
        user = User.query.get(data['user_id'])
        package = Package.query.get(data['package_id'])
        
        if not user:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404
        if not package:
            return jsonify({'success': False, 'message': 'Paquete no encontrado'}), 404
        
        # Create user package
        from datetime import datetime, timedelta
        
        user_package = UserPackage(
            user_id=data['user_id'],
            package_id=data['package_id'],
            classes_total=package.total_classes,
            classes_used=0,
            classes_remaining=package.total_classes,
            purchase_date=datetime.utcnow(),
            expiration_date=datetime.utcnow() + timedelta(days=package.validity_days),
            status='active',
            active=True,
            price_paid=data.get('price_paid', package.price),
            notes=data.get('notes', '')
        )
        
        db.session.add(user_package)
        db.session.commit()
        
        print(f"✅ [ADMIN] Paquete asignado: User {user.email} - Package {package.name}")
        return jsonify({'success': True, 'message': 'Paquete asignado exitosamente', 'data': user_package.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ [ADMIN] Error assigning package: {str(e)}")
        return jsonify({'success': False, 'message': 'Error al asignar paquete', 'error': str(e)}), 500


@admin_bp.route('/user-packages/<int:user_package_id>', methods=['PUT'])
@admin_required
def update_user_package(user_package_id):
    """Update user package (change expiration, classes, etc)"""
    try:
        data = request.get_json()
        user_package = UserPackage.query.get(user_package_id)
        
        if not user_package:
            return jsonify({'success': False, 'message': 'Paquete de usuario no encontrado'}), 404
        
        # Update fields
        if 'expiration_date' in data:
            from datetime import datetime
            user_package.expiration_date = datetime.fromisoformat(data['expiration_date'])
        
        if 'classes_used' in data:
            user_package.classes_used = data['classes_used']
            user_package.classes_remaining = user_package.classes_total - user_package.classes_used
        
        if 'status' in data:
            user_package.status = data['status']
        
        if 'active' in data:
            user_package.active = data['active']
        
        if 'notes' in data:
            user_package.notes = data['notes']
        
        db.session.commit()
        print(f"✅ [ADMIN] Paquete de usuario actualizado: ID {user_package_id}")
        return jsonify({'success': True, 'message': 'Paquete actualizado exitosamente', 'data': user_package.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al actualizar paquete', 'error': str(e)}), 500


@admin_bp.route('/user-packages/<int:user_package_id>', methods=['DELETE'])
@admin_required
def remove_user_package(user_package_id):
    """Remove (deactivate) user package"""
    try:
        user_package = UserPackage.query.get(user_package_id)
        
        if not user_package:
            return jsonify({'success': False, 'message': 'Paquete de usuario no encontrado'}), 404
        
        user_package.active = False
        user_package.status = 'cancelled'
        db.session.commit()
        
        print(f"✅ [ADMIN] Paquete de usuario eliminado: ID {user_package_id}")
        return jsonify({'success': True, 'message': 'Paquete eliminado exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al eliminar paquete', 'error': str(e)}), 500


# ==================== RESERVATIONS (Reservas) ====================
@admin_bp.route('/reservations', methods=['GET'])
@admin_required
def get_reservations():
    """Get all reservations"""
    try:
        reservations = Reservation.query.all()
        return jsonify({'success': True, 'data': [r.to_dict() for r in reservations]}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error al obtener reservas', 'error': str(e)}), 500


@admin_bp.route('/reservations/schedule/<int:schedule_id>', methods=['GET'])
@admin_required
def get_reservations_by_schedule(schedule_id):
    """Get reservations by schedule (lista de alumnos por clase)"""
    try:
        reservations = Reservation.query.filter_by(schedule_id=schedule_id).all()
        return jsonify({'success': True, 'data': [r.to_dict() for r in reservations]}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error al obtener reservas de la clase', 'error': str(e)}), 500


@admin_bp.route('/reservations/user/<int:user_id>', methods=['GET'])
@admin_required
def get_reservations_by_user(user_id):
    """Get reservations by user"""
    try:
        reservations = Reservation.query.filter_by(user_id=user_id).all()
        return jsonify({'success': True, 'data': [r.to_dict() for r in reservations]}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error al obtener reservas del usuario', 'error': str(e)}), 500


@admin_bp.route('/reservations/<int:reservation_id>/attendance', methods=['PUT'])
@admin_required
def mark_attendance(reservation_id):
    """Mark attendance for a reservation"""
    try:
        data = request.get_json()
        reservation = Reservation.query.get(reservation_id)
        
        if not reservation:
            return jsonify({'success': False, 'message': 'Reserva no encontrada'}), 404
        
        attended = data.get('attended', True)
        
        if attended:
            reservation.mark_attended()
        else:
            reservation.mark_no_show()
        
        db.session.commit()
        
        print(f"✅ [ADMIN] Asistencia marcada: Reservation {reservation_id} - Attended: {attended}")
        return jsonify({'success': True, 'message': 'Asistencia marcada exitosamente', 'data': reservation.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al marcar asistencia', 'error': str(e)}), 500


# ==================== STATISTICS (Estadísticas Avanzadas) ====================
@admin_bp.route('/statistics/advanced', methods=['GET'])
@admin_required
def get_advanced_statistics():
    """Get advanced statistics for dashboard"""
    try:
        from sqlalchemy import func
        
        # 1. Clases por instructor
        classes_by_instructor = db.session.query(
            User.id,
            User.full_name,
            func.count(Schedule.id).label('total_classes')
        ).join(Schedule, User.id == Schedule.instructor_id)\
         .filter(User.role == 'instructor')\
         .group_by(User.id, User.full_name)\
         .all()
        
        # 2. Reservas y asistencias por clase
        reservations_by_class = db.session.query(
            PilatesClass.id,
            PilatesClass.name,
            func.count(Reservation.id).label('total_reservations'),
            func.sum(func.cast(Reservation.attended, db.Integer)).label('total_attended')
        ).join(Schedule, PilatesClass.id == Schedule.class_id)\
         .join(Reservation, Schedule.id == Reservation.schedule_id)\
         .group_by(PilatesClass.id, PilatesClass.name)\
         .all()
        
        # 3. Reservas y asistencias por instructor
        reservations_by_instructor = db.session.query(
            User.id,
            User.full_name,
            func.count(Reservation.id).label('total_reservations'),
            func.sum(func.cast(Reservation.attended, db.Integer)).label('total_attended')
        ).join(Schedule, User.id == Schedule.instructor_id)\
         .join(Reservation, Schedule.id == Reservation.schedule_id)\
         .filter(User.role == 'instructor')\
         .group_by(User.id, User.full_name)\
         .all()
        
        # 4. Asistencias por alumno
        attendance_by_student = db.session.query(
            User.id,
            User.full_name,
            func.count(Reservation.id).label('total_reservations'),
            func.sum(func.cast(Reservation.attended, db.Integer)).label('total_attended')
        ).join(Reservation, User.id == Reservation.user_id)\
         .filter(User.role == 'client')\
         .group_by(User.id, User.full_name)\
         .all()
        
        # 5. Paquetes comprados por alumno
        packages_by_student = db.session.query(
            User.id,
            User.full_name,
            func.count(UserPackage.id).label('total_packages'),
            func.sum(UserPackage.price_paid).label('total_spent')
        ).join(UserPackage, User.id == UserPackage.user_id)\
         .filter(User.role == 'client')\
         .group_by(User.id, User.full_name)\
         .all()
        
        # 6. Porcentaje de compra de paquetes
        package_purchases = db.session.query(
            Package.id,
            Package.name,
            func.count(UserPackage.id).label('total_purchases')
        ).join(UserPackage, Package.id == UserPackage.package_id)\
         .group_by(Package.id, Package.name)\
         .all()
        
        # 7. Alumnos activos e inactivos
        active_students = User.query.filter_by(role='client', active=True).count()
        inactive_students = User.query.filter_by(role='client', active=False).count()
        
        # Format data
        stats = {
            'classes_by_instructor': [
                {
                    'instructor_id': row.id,
                    'instructor_name': row.full_name,
                    'total_classes': row.total_classes
                } for row in classes_by_instructor
            ],
            'reservations_by_class': [
                {
                    'class_id': row.id,
                    'class_name': row.name,
                    'total_reservations': row.total_reservations,
                    'total_attended': row.total_attended or 0,
                    'attendance_percentage': round((row.total_attended or 0) / row.total_reservations * 100, 2) if row.total_reservations > 0 else 0
                } for row in reservations_by_class
            ],
            'reservations_by_instructor': [
                {
                    'instructor_id': row.id,
                    'instructor_name': row.full_name,
                    'total_reservations': row.total_reservations,
                    'total_attended': row.total_attended or 0,
                    'attendance_percentage': round((row.total_attended or 0) / row.total_reservations * 100, 2) if row.total_reservations > 0 else 0
                } for row in reservations_by_instructor
            ],
            'attendance_by_student': [
                {
                    'student_id': row.id,
                    'student_name': row.full_name,
                    'total_reservations': row.total_reservations,
                    'total_attended': row.total_attended or 0,
                    'attendance_percentage': round((row.total_attended or 0) / row.total_reservations * 100, 2) if row.total_reservations > 0 else 0
                } for row in attendance_by_student
            ],
            'packages_by_student': [
                {
                    'student_id': row.id,
                    'student_name': row.full_name,
                    'total_packages': row.total_packages,
                    'total_spent': float(row.total_spent or 0)
                } for row in packages_by_student
            ],
            'package_purchases': [
                {
                    'package_id': row.id,
                    'package_name': row.name,
                    'total_purchases': row.total_purchases
                } for row in package_purchases
            ],
            'students_status': {
                'active': active_students,
                'inactive': inactive_students,
                'total': active_students + inactive_students
            }
        }
        
        return jsonify({'success': True, 'data': stats}), 200
        
    except Exception as e:
        print(f"❌ [ADMIN] Error getting advanced statistics: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': 'Error al obtener estadísticas avanzadas', 'error': str(e)}), 500
    
    
# Actualizar en backend/app/routes/admin.py

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_dashboard_stats(current_user):
    """
    Obtener estadísticas completas del dashboard
    ✅ MEJORADO: Cuenta TODOS los registros (activos e inactivos)
    """
    try:
        from datetime import date
        from sqlalchemy import and_, func
        from app.models.package import Package
        from app.models.pilates_class import PilatesClass
        from app.models.schedule import Schedule
        from app.models.reservation import Reservation
        from app.models.user_package import UserPackage
        
        print("📊 [ADMIN STATS] Calculando estadísticas...")
        
        # ==================== USUARIOS ====================
        # ✅ CORREGIDO: Contar TODOS los usuarios (sin filtro active)
        total_users = User.query.count()
        total_clients = User.query.filter_by(role='client').count()
        total_instructors = User.query.filter_by(role='instructor').count()
        total_admins = User.query.filter_by(role='admin').count()
        
        # También contar usuarios activos
        active_users = User.query.filter_by(active=True).count()
        
        print(f"   ✅ Usuarios: {total_users} totales ({active_users} activos)")
        print(f"      - Clientes: {total_clients}")
        print(f"      - Instructores: {total_instructors}")
        print(f"      - Admins: {total_admins}")
        
        # ==================== PAQUETES ====================
        # ✅ CORREGIDO: Contar TODOS los paquetes
        total_packages = Package.query.count()
        active_packages = Package.query.filter_by(active=True).count()
        sold_packages = UserPackage.query.count()
        
        print(f"   ✅ Paquetes: {total_packages} totales ({active_packages} activos, {sold_packages} vendidos)")
        
        # ==================== CLASES ====================
        # ✅ CORREGIDO: Contar TODAS las clases
        total_classes = PilatesClass.query.count()
        active_classes = PilatesClass.query.filter_by(active=True).count()
        
        print(f"   ✅ Clases: {total_classes} totales ({active_classes} activas)")
        
        # ==================== HORARIOS ====================
        today = date.today()
        start_of_month = today.replace(day=1)
        
        total_schedules = Schedule.query.count()
        active_schedules = Schedule.query.filter(
            and_(
                Schedule.date >= start_of_month,
                Schedule.date >= today,
                Schedule.status == 'scheduled'
            )
        ).count()
        
        print(f"   ✅ Horarios: {total_schedules} totales ({active_schedules} activos este mes)")
        
        # ==================== RESERVAS ====================
        total_reservations = Reservation.query.count()
        confirmed_reservations = Reservation.query.filter_by(status='confirmed').count()
        
        print(f"   ✅ Reservas: {total_reservations} totales ({confirmed_reservations} confirmadas)")
        
        # ==================== INGRESOS ====================
        total_revenue = db.session.query(
            func.sum(UserPackage.classes_total * 20)
        ).scalar() or 0
        
        print(f"   ✅ Ingresos estimados: ${total_revenue}")
        
        # ==================== RESPUESTA ====================
        stats = {
            'users': {
                'total': total_users,  # ✅ CORREGIDO: Todos los usuarios
                'active': active_users,
                'clients': total_clients,
                'instructors': total_instructors,
                'admins': total_admins
            },
            'packages': {
                'total': total_packages,  # ✅ AGREGADO
                'active': active_packages,
                'sold': sold_packages
            },
            'classes': {
                'total': total_classes,  # ✅ CORREGIDO: Todas las clases
                'active': active_classes
            },
            'schedules': {
                'total': total_schedules,  # ✅ AGREGADO
                'active_this_month': active_schedules
            },
            'reservations': {
                'total': total_reservations,
                'confirmed': confirmed_reservations
            },
            'revenue': {
                'total': float(total_revenue),
                'currency': 'USD'
            }
        }
        
        print(f"✅ [ADMIN STATS] Estadísticas calculadas exitosamente")
        
        return jsonify({
            'success': True,
            'data': stats,
            'timestamp': date.today().isoformat()
        }), 200
        
    except Exception as e:
        print(f"❌ [ADMIN STATS] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500
      

# ==================== NOTIFICACIONES ====================

@admin_bp.route('/notifications/preview', methods=['POST', 'OPTIONS'])
@admin_required
def preview_notification_recipients(current_user):
    """
    Previsualizar cuántos usuarios recibirán la notificación
    """
    try:
        data = request.get_json()
        send_type = data.get('type')
        user_ids = data.get('user_ids', [])
        role = data.get('role')
        
        print(f"📊 [ADMIN PREVIEW] Tipo: {send_type}")
        
        count = 0
        recipients = []
        
        if send_type == 'all':
            users = User.query.filter_by(active=True).all()
            count = len(users)
            recipients = [{'id': u.id, 'name': u.full_name, 'email': u.email} for u in users[:10]]
            print(f"   → Enviará a TODOS: {count} usuarios")
            
        elif send_type == 'specific':
            if not user_ids:
                return jsonify({'success': False, 'message': 'user_ids requerido'}), 400
            users = User.query.filter(User.id.in_(user_ids)).all()
            count = len(users)
            recipients = [{'id': u.id, 'name': u.full_name, 'email': u.email} for u in users]
            print(f"   → Enviará a específicos: {count} usuarios")
            
        elif send_type == 'role':
            if not role:
                return jsonify({'success': False, 'message': 'role requerido'}), 400
            users = User.query.filter_by(role=role, active=True).all()
            count = len(users)
            recipients = [{'id': u.id, 'name': u.full_name, 'email': u.email} for u in users[:10]]
            print(f"   → Enviará a rol {role}: {count} usuarios")
        else:
            return jsonify({'success': False, 'message': 'Tipo inválido'}), 400
        
        print(f"✅ [ADMIN PREVIEW] Retornando: {count} usuarios")
        
        return jsonify({
            'success': True,
            'data': {
                'count': count,
                'recipients': recipients,
                'showing': f'{len(recipients)} de {count}'
            }
        }), 200
        
    except Exception as e:
        print(f"❌ [ADMIN PREVIEW] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500


@admin_bp.route('/notifications/send', methods=['POST', 'OPTIONS'])
@admin_required
def send_notification(current_user):
    """
    Enviar notificaciones a usuarios
    """
    try:
        from app.models.notification import Notification
        
        data = request.get_json()
        
        send_type = data.get('type')
        user_ids = data.get('user_ids', [])
        role = data.get('role')
        notification_type = data.get('notification_type', 'info')
        title = data.get('title')
        message = data.get('message')
        link = data.get('link')
        
        print(f"📨 [ADMIN SEND] Iniciando envío...")
        print(f"   Tipo: {send_type}")
        print(f"   Título: {title}")
        print(f"   Mensaje: {message}")
        
        if not title or not message:
            return jsonify({'success': False, 'message': 'Título y mensaje requeridos'}), 400
        
        recipients = []
        
        if send_type == 'all':
            recipients = User.query.filter_by(active=True).all()
            print(f"   → Enviando a TODOS: {len(recipients)} usuarios")
            
        elif send_type == 'specific':
            if not user_ids:
                return jsonify({'success': False, 'message': 'user_ids requerido'}), 400
            recipients = User.query.filter(User.id.in_(user_ids)).all()
            print(f"   → Enviando a específicos: {len(recipients)} usuarios")
            
        elif send_type == 'role':
            if not role:
                return jsonify({'success': False, 'message': 'role requerido'}), 400
            recipients = User.query.filter_by(role=role, active=True).all()
            print(f"   → Enviando a rol {role}: {len(recipients)} usuarios")
        else:
            return jsonify({'success': False, 'message': 'Tipo inválido'}), 400
        
        if not recipients:
            print(f"❌ [ADMIN SEND] No se encontraron usuarios")
            return jsonify({
                'success': False,
                'message': 'No se encontraron usuarios para enviar notificaciones'
            }), 400
        
        notifications_created = 0
        for recipient in recipients:
            notification = Notification(
                user_id=recipient.id,
                type=notification_type,
                title=title,
                message=message,
                link=link,
                read=False
            )
            db.session.add(notification)
            notifications_created += 1
        
        db.session.commit()
        
        print(f"✅ [ADMIN SEND] {notifications_created} notificaciones creadas exitosamente")
        
        return jsonify({
            'success': True,
            'message': f'{notifications_created} notificaciones enviadas exitosamente',
            'data': {
                'count': notifications_created,
                'recipients': [r.email for r in recipients[:10]]
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ [ADMIN SEND] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500