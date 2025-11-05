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


bp = Blueprint('admin_reformery_routes', __name__)


# ============================================================================
# ESTADÍSTICAS
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


# ============================================================================
# GESTIÓN DE USUARIOS
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
# GESTIÓN DE PAQUETES
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
    

