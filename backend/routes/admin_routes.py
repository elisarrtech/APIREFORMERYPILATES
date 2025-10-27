# routes/admin_routes_reformery.py
# Rutas de administración REFORMERY - 9 funcionalidades completas
# Autor: @elisarrtech con Elite AI Architect

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from extensions import db
from models import User, Package, UserPackage, PilatesClass, Instructor, ClassSchedule, Reservation
from utils.decorators import role_required
from utils.exceptions import ValidationError, NotFoundError
from datetime import datetime, timedelta

bp = Blueprint('admin_reformery', __name__)


# ============================================================================
# 1. ASIGNAR, QUITAR Y CAMBIAR VIGENCIA DE CLASES DE ALUMNOS
# ============================================================================

@bp.route('/user-packages/<int:user_id>', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_user_packages(user_id):
    """Obtiene todos los paquetes de un alumno"""
    try:
        user = User.query.get(user_id)
        if not user:
            raise NotFoundError("Usuario no encontrado")
        
        packages = UserPackage.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'success': True,
            'data': {
                'user': user.to_dict(),
                'packages': [pkg.to_dict() for pkg in packages]
            }
        }), 200
        
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al obtener paquetes'}), 500


@bp.route('/user-packages/<int:user_package_id>/update-expiry', methods=['PATCH'])
@jwt_required()
@role_required('admin')
def update_package_expiry(user_package_id):
    """Cambia la vigencia de un paquete de alumno"""
    try:
        data = request.get_json()
        
        if not data or 'expiry_date' not in data:
            raise ValidationError("expiry_date es requerido (formato: YYYY-MM-DD)")
        
        user_package = UserPackage.query.get(user_package_id)
        if not user_package:
            raise NotFoundError("Paquete no encontrado")
        
        # Parsear nueva fecha
        new_expiry = datetime.fromisoformat(data['expiry_date'])
        user_package.expiry_date = new_expiry
        user_package.update_status()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Vigencia actualizada exitosamente',
            'data': user_package.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al actualizar vigencia'}), 500


@bp.route('/user-packages/<int:user_package_id>/adjust-classes', methods=['PATCH'])
@jwt_required()
@role_required('admin')
def adjust_package_classes(user_package_id):
    """Asigna o quita clases de un paquete de alumno"""
    try:
        data = request.get_json()
        
        if not data or 'remaining_classes' not in data:
            raise ValidationError("remaining_classes es requerido")
        
        user_package = UserPackage.query.get(user_package_id)
        if not user_package:
            raise NotFoundError("Paquete no encontrado")
        
        # Actualizar clases restantes
        new_remaining = int(data['remaining_classes'])
        if new_remaining < 0:
            raise ValidationError("El número de clases no puede ser negativo")
        
        user_package.remaining_classes = new_remaining
        user_package.used_classes = user_package.total_classes - new_remaining
        user_package.update_status()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Clases ajustadas exitosamente',
            'data': user_package.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al ajustar clases'}), 500


@bp.route('/user-packages/<int:user_package_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_user_package(user_package_id):
    """Quita un paquete de un alumno"""
    try:
        user_package = UserPackage.query.get(user_package_id)
        if not user_package:
            raise NotFoundError("Paquete no encontrado")
        
        # Verificar si tiene reservas activas
        active_reservations = Reservation.query.filter_by(
            user_package_id=user_package_id,
            status='confirmed'
        ).count()
        
        if active_reservations > 0:
            raise ValidationError(f"No se puede eliminar. Tiene {active_reservations} reservas activas")
        
        db.session.delete(user_package)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Paquete eliminado exitosamente'
        }), 200
        
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al eliminar paquete'}), 500


# ============================================================================
# 2. PONER Y QUITAR CLASES GENERALES EN EL HORARIO
# ============================================================================

@bp.route('/schedules', methods=['POST'])
@jwt_required()
@role_required('admin')
def create_schedule():
    """Crea un nuevo horario de clase"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['pilates_class_id', 'instructor_id', 'start_time', 'end_time']
        for field in required_fields:
            if field not in data:
                raise ValidationError(f"Campo requerido: {field}")
        
        # Verificar que la clase existe
        pilates_class = PilatesClass.query.get(data['pilates_class_id'])
        if not pilates_class:
            raise NotFoundError("Clase no encontrada")
        
        # Verificar que el instructor existe
        instructor = Instructor.query.get(data['instructor_id'])
        if not instructor:
            raise NotFoundError("Instructor no encontrado")
        
        # Crear horario
        schedule = ClassSchedule(
            pilates_class_id=data['pilates_class_id'],
            instructor_id=data['instructor_id'],
            start_time=datetime.fromisoformat(data['start_time']),
            end_time=datetime.fromisoformat(data['end_time']),
            max_capacity=data.get('max_capacity', pilates_class.max_capacity),
            current_reservations=0,
            status='scheduled',
            notes=data.get('notes', '')
        )
        
        db.session.add(schedule)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Horario creado exitosamente',
            'data': schedule.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al crear horario'}), 500


@bp.route('/schedules/<int:schedule_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_schedule(schedule_id):
    """Elimina un horario de clase"""
    try:
        schedule = ClassSchedule.query.get(schedule_id)
        if not schedule:
            raise NotFoundError("Horario no encontrado")
        
        # Verificar si tiene reservas
        reservations_count = Reservation.query.filter_by(
            schedule_id=schedule_id,
            status='confirmed'
        ).count()
        
        if reservations_count > 0:
            raise ValidationError(f"No se puede eliminar. Tiene {reservations_count} reservas activas")
        
        db.session.delete(schedule)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Horario eliminado exitosamente'
        }), 200
        
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al eliminar horario'}), 500


@bp.route('/schedules/<int:schedule_id>', methods=['PUT'])
@jwt_required()
@role_required('admin')
def update_schedule(schedule_id):
    """Actualiza un horario de clase"""
    try:
        schedule = ClassSchedule.query.get(schedule_id)
        if not schedule:
            raise NotFoundError("Horario no encontrado")
        
        data = request.get_json()
        
        # Actualizar campos
        if 'pilates_class_id' in data:
            pilates_class = PilatesClass.query.get(data['pilates_class_id'])
            if not pilates_class:
                raise NotFoundError("Clase no encontrada")
            schedule.pilates_class_id = data['pilates_class_id']
        
        if 'instructor_id' in data:
            instructor = Instructor.query.get(data['instructor_id'])
            if not instructor:
                raise NotFoundError("Instructor no encontrado")
            schedule.instructor_id = data['instructor_id']
        
        if 'start_time' in data:
            schedule.start_time = datetime.fromisoformat(data['start_time'])
        
        if 'end_time' in data:
            schedule.end_time = datetime.fromisoformat(data['end_time'])
        
        if 'max_capacity' in data:
            schedule.max_capacity = data['max_capacity']
        
        if 'notes' in data:
            schedule.notes = data['notes']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Horario actualizado exitosamente',
            'data': schedule.to_dict()
        }), 200
        
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al actualizar horario'}), 500


# ============================================================================
# 3. EDITAR PAQUETES (CLASES, PRECIOS, VIGENCIA)
# ============================================================================

@bp.route('/packages', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_all_packages():
    """Obtiene todos los paquetes"""
    try:
        packages = Package.query.all()
        
        return jsonify({
            'success': True,
            'data': [pkg.to_dict() for pkg in packages],
            'total': len(packages)
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al obtener paquetes'}), 500


@bp.route('/packages', methods=['POST'])
@jwt_required()
@role_required('admin')
def create_package():
    """Crea un nuevo paquete"""
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['name', 'total_classes', 'validity_days', 'price']
        for field in required_fields:
            if field not in data:
                raise ValidationError(f"Campo requerido: {field}")
        
        package = Package(
            name=data['name'],
            description=data.get('description', ''),
            total_classes=data['total_classes'],
            validity_days=data['validity_days'],
            price=data['price'],
            active=data.get('active', True)
        )
        
        db.session.add(package)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Paquete creado exitosamente',
            'data': package.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al crear paquete'}), 500


@bp.route('/packages/<int:package_id>', methods=['PUT'])
@jwt_required()
@role_required('admin')
def update_package(package_id):
    """Actualiza un paquete existente"""
    try:
        package = Package.query.get(package_id)
        if not package:
            raise NotFoundError("Paquete no encontrado")
        
        data = request.get_json()
        
        # Actualizar campos
        if 'name' in data:
            package.name = data['name']
        if 'description' in data:
            package.description = data['description']
        if 'total_classes' in data:
            package.total_classes = data['total_classes']
        if 'validity_days' in data:
            package.validity_days = data['validity_days']
        if 'price' in data:
            package.price = data['price']
        if 'active' in data:
            package.active = data['active']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Paquete actualizado exitosamente',
            'data': package.to_dict()
        }), 200
        
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al actualizar paquete'}), 500


@bp.route('/packages/<int:package_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_package(package_id):
    """Elimina un paquete"""
    try:
        package = Package.query.get(package_id)
        if not package:
            raise NotFoundError("Paquete no encontrado")
        
        # Verificar si está en uso
        in_use = UserPackage.query.filter_by(package_id=package_id).count()
        if in_use > 0:
            raise ValidationError(f"No se puede eliminar. Está asignado a {in_use} usuarios")
        
        db.session.delete(package)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Paquete eliminado exitosamente'
        }), 200
        
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al eliminar paquete'}), 500


# ============================================================================
# 4. ABRIR O CERRAR CLASES PARA RESERVAS
# ============================================================================

@bp.route('/schedules/<int:schedule_id>/toggle-status', methods=['PATCH'])
@jwt_required()
@role_required('admin')
def toggle_schedule_status(schedule_id):
    """Abre o cierra una clase para reservas"""
    try:
        schedule = ClassSchedule.query.get(schedule_id)
        if not schedule:
            raise NotFoundError("Horario no encontrado")
        
        data = request.get_json()
        
        if 'status' not in data:
            raise ValidationError("Campo 'status' es requerido (scheduled, cancelled, completed)")
        
        valid_statuses = ['scheduled', 'cancelled', 'completed']
        if data['status'] not in valid_statuses:
            raise ValidationError(f"Estado inválido. Debe ser uno de: {', '.join(valid_statuses)}")
        
        schedule.status = data['status']
        db.session.commit()
        
        status_messages = {
            'scheduled': 'abierta para reservas',
            'cancelled': 'cerrada para reservas',
            'completed': 'marcada como completada'
        }
        
        return jsonify({
            'success': True,
            'message': f"Clase {status_messages[data['status']]}",
            'data': schedule.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al cambiar estado'}), 500


# ============================================================================
# 5. ASIGNAR NÚMERO DE ALUMNOS POR CLASE (CUPO)
# ============================================================================

@bp.route('/schedules/<int:schedule_id>/capacity', methods=['PATCH'])
@jwt_required()
@role_required('admin')
def update_schedule_capacity(schedule_id):
    """Cambia el cupo máximo de una clase"""
    try:
        schedule = ClassSchedule.query.get(schedule_id)
        if not schedule:
            raise NotFoundError("Horario no encontrado")
        
        data = request.get_json()
        
        if 'max_capacity' not in data:
            raise ValidationError("Campo 'max_capacity' es requerido")
        
        new_capacity = int(data['max_capacity'])
        if new_capacity < schedule.current_reservations:
            raise ValidationError(
                f"No se puede reducir el cupo por debajo de las reservas actuales ({schedule.current_reservations})"
            )
        
        schedule.max_capacity = new_capacity
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Cupo actualizado exitosamente',
            'data': schedule.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al actualizar cupo'}), 500


# ============================================================================
# 6. CONSULTAR Y MODIFICAR PERFILES (ALUMNOS E INSTRUCTORES)
# ============================================================================

@bp.route('/users', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_all_users():
    """Obtiene todos los usuarios"""
    try:
        role = request.args.get('role')
        
        query = User.query
        if role:
            query = query.filter_by(role=role)
        
        users = query.all()
        
        return jsonify({
            'success': True,
            'data': [user.to_dict() for user in users],
            'total': len(users)
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al obtener usuarios'}), 500


@bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_user_detail(user_id):
    """Obtiene detalle de un usuario"""
    try:
        user = User.query.get(user_id)
        if not user:
            raise NotFoundError("Usuario no encontrado")
        
        result = user.to_dict()
        
        # Si es instructor, agregar info adicional
        if user.role == 'instructor' and hasattr(user, 'instructor'):
            result['instructor_info'] = user.instructor.to_dict()
        
        # Si es cliente, agregar paquetes
        if user.role == 'client':
            packages = UserPackage.query.filter_by(user_id=user_id).all()
            result['packages'] = [pkg.to_dict() for pkg in packages]
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al obtener usuario'}), 500


@bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@role_required('admin')
def update_user(user_id):
    """Modifica perfil de un usuario"""
    try:
        user = User.query.get(user_id)
        if not user:
            raise NotFoundError("Usuario no encontrado")
        
        data = request.get_json()
        
        # Actualizar campos
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'email' in data:
            # Verificar que el email no esté en uso
            existing = User.query.filter(User.email == data['email'], User.id != user_id).first()
            if existing:
                raise ValidationError("El email ya está en uso")
            user.email = data['email']
        if 'role' in data:
            user.role = data['role']
        if 'active' in data:
            user.active = data['active']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Usuario actualizado exitosamente',
            'data': user.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al actualizar usuario'}), 500


# ============================================================================
# 7. CONSULTAR LISTAS DE RESERVAS POR CLASE
# ============================================================================

@bp.route('/schedules/<int:schedule_id>/reservations', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_schedule_reservations(schedule_id):
    """Obtiene lista de reservas de una clase"""
    try:
        schedule = ClassSchedule.query.get(schedule_id)
        if not schedule:
            raise NotFoundError("Horario no encontrado")
        
        reservations = Reservation.query.filter_by(schedule_id=schedule_id).all()
        
        result = []
        for reservation in reservations:
            data = reservation.to_dict()
            if reservation.user:
                data['user_info'] = {
                    'id': reservation.user.id,
                    'full_name': reservation.user.full_name,
                    'email': reservation.user.email
                }
            result.append(data)
        
        return jsonify({
            'success': True,
            'data': {
                'schedule': schedule.to_dict(),
                'reservations': result,
                'total_reservations': len(result)
            }
        }), 200
        
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al obtener reservas'}), 500


# ============================================================================
# 8. LEER LISTAS DE ASISTENCIA CON INSTRUCTOR
# ============================================================================

@bp.route('/schedules/<int:schedule_id>/attendance', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_attendance_list(schedule_id):
    """Obtiene lista de asistencia de una clase"""
    try:
        schedule = ClassSchedule.query.get(schedule_id)
        if not schedule:
            raise NotFoundError("Horario no encontrado")
        
        reservations = Reservation.query.filter_by(
            schedule_id=schedule_id,
            status='confirmed'
        ).all()
        
        result = []
        for reservation in reservations:
            data = {
                'reservation_id': reservation.id,
                'user_id': reservation.user_id,
                'user_name': reservation.user.full_name if reservation.user else None,
                'attended': reservation.attended,
                'notes': reservation.notes
            }
            result.append(data)
        
        return jsonify({
            'success': True,
            'data': {
                'schedule': schedule.to_dict(),
                'attendance_list': result,
                'total_students': len(result),
                'attended': len([r for r in reservations if r.attended == True]),
                'not_attended': len([r for r in reservations if r.attended == False]),
                'pending': len([r for r in reservations if r.attended is None])
            }
        }), 200
        
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al obtener asistencia'}), 500


# ============================================================================
# 9. ASIGNAR CLASES A INSTRUCTORES
# ============================================================================

@bp.route('/schedules/<int:schedule_id>/assign-instructor', methods=['PATCH'])
@jwt_required()
@role_required('admin')
def assign_instructor(schedule_id):
    """Asigna un instructor a una clase"""
    try:
        schedule = ClassSchedule.query.get(schedule_id)
        if not schedule:
            raise NotFoundError("Horario no encontrado")
        
        data = request.get_json()
        
        if 'instructor_id' not in data:
            raise ValidationError("Campo 'instructor_id' es requerido")
        
        instructor = Instructor.query.get(data['instructor_id'])
        if not instructor:
            raise NotFoundError("Instructor no encontrado")
        
        schedule.instructor_id = data['instructor_id']
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Instructor asignado exitosamente',
            'data': schedule.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'success': False, 'error': 'validation_error', 'message': str(e)}), 400
    except NotFoundError as e:
        return jsonify({'success': False, 'error': 'not_found', 'message': str(e)}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al asignar instructor'}), 500


# ============================================================================
# ENDPOINTS ADICIONALES DE SOPORTE
# ============================================================================

@bp.route('/statistics', methods=['GET'])
@jwt_required()
@role_required('admin')
def get_statistics():
    """Obtiene estadísticas del sistema"""
    try:
        stats = {
            'users': {
                'total': User.query.count(),
                'clients': User.query.filter_by(role='client').count(),
                'instructors': User.query.filter_by(role='instructor').count(),
                'active': User.query.filter_by(active=True).count()
            },
            'packages': {
                'total': Package.query.count(),
                'active': Package.query.filter_by(active=True).count(),
                'assigned': UserPackage.query.filter_by(status='active').count()
            },
            'classes': {
                'total': PilatesClass.query.count(),
                'active': PilatesClass.query.filter_by(active=True).count()
            },
            'schedules': {
                'total': ClassSchedule.query.count(),
                'scheduled': ClassSchedule.query.filter_by(status='scheduled').count(),
                'cancelled': ClassSchedule.query.filter_by(status='cancelled').count(),
                'completed': ClassSchedule.query.filter_by(status='completed').count()
            },
            'reservations': {
                'total': Reservation.query.count(),
                'confirmed': Reservation.query.filter_by(status='confirmed').count(),
                'cancelled': Reservation.query.filter_by(status='cancelled').count()
            }
        }
        
        return jsonify({
            'success': True,
            'data': stats
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': 'server_error', 'message': 'Error al obtener estadísticas'}), 500
