# routes/instructors.py
# Rutas para instructores
# Autor: @elisarrtech con Elite AI Architect

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Instructor, ClassSchedule, Reservation
from utils.decorators import role_required
from utils.exceptions import NotFoundError
from datetime import datetime

bp = Blueprint('instructors', __name__)


@bp.route('/my-schedule', methods=['GET'])
@jwt_required()
@role_required('instructor')
def get_my_schedule():
    # Obtiene horarios del instructor autenticado
    try:
        user_id = get_jwt_identity()
        
        # Obtener instructor
        user = User.query.get(user_id)
        if not user or not hasattr(user, 'instructor'):
            raise NotFoundError("Instructor no encontrado")
        
        instructor = user.instructor
        
        # Filtrar por fecha
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = ClassSchedule.query.filter_by(instructor_id=instructor.id)
        
        if start_date:
            start = datetime.fromisoformat(start_date)
            query = query.filter(ClassSchedule.start_time >= start)
        
        if end_date:
            end = datetime.fromisoformat(end_date)
            query = query.filter(ClassSchedule.start_time <= end)
        
        schedules = query.order_by(ClassSchedule.start_time.asc()).all()
        
        return jsonify({
            'success': True,
            'data': [schedule.to_dict(include_reservations=True) for schedule in schedules],
            'total': len(schedules)
        }), 200
        
    except NotFoundError as e:
        return jsonify({
            'success': False,
            'error': 'not_found',
            'message': str(e)
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'server_error',
            'message': 'Error al obtener horarios'
        }), 500


@bp.route('/mark-attendance/<int:reservation_id>', methods=['PATCH'])
@jwt_required()
@role_required('instructor')
def mark_attendance(reservation_id):
    # Marca asistencia de una reserva
    try:
        reservation = Reservation.query.get(reservation_id)
        
        if not reservation:
            raise NotFoundError("Reserva no encontrada")
        
        data = request.get_json()
        reservation.attended = data.get('attended', True)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Asistencia registrada exitosamente',
            'data': reservation.to_dict()
        }), 200
        
    except NotFoundError as e:
        return jsonify({
            'success': False,
            'error': 'not_found',
            'message': str(e)
        }), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'server_error',
            'message': 'Error al registrar asistencia'
        }), 500


@bp.route('/profile', methods=['GET'])
@jwt_required()
@role_required('instructor')
def get_profile():
    # Obtiene perfil del instructor
    try:
        user_id = get_jwt_identity()
        
        user = User.query.get(user_id)
        if not user or not hasattr(user, 'instructor'):
            raise NotFoundError("Instructor no encontrado")
        
        instructor = user.instructor
        
        return jsonify({
            'success': True,
            'data': instructor.to_dict()
        }), 200
        
    except NotFoundError as e:
        return jsonify({
            'success': False,
            'error': 'not_found',
            'message': str(e)
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'server_error',
            'message': 'Error al obtener perfil'
        }), 500


@bp.route('/profile', methods=['PUT'])
@jwt_required()
@role_required('instructor')
def update_profile():
    # Actualiza perfil del instructor
    try:
        user_id = get_jwt_identity()
        
        user = User.query.get(user_id)
        if not user or not hasattr(user, 'instructor'):
            raise NotFoundError("Instructor no encontrado")
        
        instructor = user.instructor
        data = request.get_json()
        
        # Actualizar campos
        if 'bio' in data:
            instructor.bio = data['bio']
        if 'specialties' in data:
            instructor.specialties = data['specialties']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Perfil actualizado exitosamente',
            'data': instructor.to_dict()
        }), 200
        
    except NotFoundError as e:
        return jsonify({
            'success': False,
            'error': 'not_found',
            'message': str(e)
        }), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'server_error',
            'message': 'Error al actualizar perfil'
        }), 500
