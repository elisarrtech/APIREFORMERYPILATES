"""
Instructor Routes - Rutas para panel de instructor
@author @elisarrtech
@date 2025-10-28
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.schedule import Schedule
from app.models.reservation import Reservation
from app.models.class_note import ClassNote
from app.models.instructor_payment import InstructorPayment
from datetime import datetime, timedelta, date
from sqlalchemy import and_, func
from functools import wraps

instructor_bp = Blueprint('instructor', __name__)


def instructor_required(f):
    """Decorator para rutas que requieren rol de instructor"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404
        
        if current_user.role not in ['instructor', 'admin']:
            return jsonify({'success': False, 'message': 'Acceso denegado. Solo instructores.'}), 403
        
        return f(current_user, *args, **kwargs)
    return decorated_function


# ==================== HORARIOS ====================
@instructor_bp.route('/my-schedule', methods=['GET'])
@instructor_required
def get_my_schedule(current_user):
    """Obtener horario del instructor (semanal/mensual)"""
    try:
        # Parámetros
        view_type = request.args.get('view', 'week')  # week, month
        start_date_str = request.args.get('start_date')
        
        # Calcular fechas
        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        else:
            start_date = date.today()
        
        if view_type == 'week':
            # Semana actual
            end_date = start_date + timedelta(days=7)
        else:  # month
            # Mes actual
            end_date = start_date + timedelta(days=30)
        
        # Obtener horarios
        schedules = Schedule.query.filter(
            and_(
                Schedule.instructor_id == current_user.id,
                Schedule.date >= start_date,
                Schedule.date <= end_date
            )
        ).order_by(Schedule.date, Schedule.start_time).all()
        
        return jsonify({
            'success': True,
            'data': [s.to_dict() for s in schedules],
            'view_type': view_type,
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== LISTA DE ALUMNOS ====================
@instructor_bp.route('/class/<int:schedule_id>/students', methods=['GET'])
@instructor_required
def get_class_students(current_user, schedule_id):
    """Obtener lista de alumnos de una clase específica"""
    try:
        # Verificar que el instructor sea dueño de esta clase
        schedule = Schedule.query.get(schedule_id)
        if not schedule:
            return jsonify({'success': False, 'message': 'Clase no encontrada'}), 404
        
        if schedule.instructor_id != current_user.id and current_user.role != 'admin':
            return jsonify({'success': False, 'message': 'No tienes permiso para ver esta clase'}), 403
        
        # Obtener reservas confirmadas
        reservations = Reservation.query.filter_by(
            schedule_id=schedule_id,
            status='confirmed'
        ).all()
        
        students_data = []
        for res in reservations:
            if res.user:
                students_data.append({
                    'reservation_id': res.id,
                    'user_id': res.user.id,
                    'full_name': res.user.full_name,
                    'email': res.user.email,
                    'phone': res.user.phone,
                    'attended': res.attended,
                    'attendance_marked_at': res.attendance_marked_at.isoformat() if res.attendance_marked_at else None
                })
        
        return jsonify({
            'success': True,
            'data': {
                'schedule': schedule.to_dict(),
                'students': students_data,
                'total_students': len(students_data)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== PASAR LISTA (QR) ====================
@instructor_bp.route('/mark-attendance', methods=['POST'])
@instructor_required
def mark_attendance(current_user):
    """Marcar asistencia de un alumno (lectura de QR)"""
    try:
        data = request.get_json()
        reservation_id = data.get('reservation_id')
        user_id = data.get('user_id')  # Del QR
        schedule_id = data.get('schedule_id')
        
        if not reservation_id and not (user_id and schedule_id):
            return jsonify({'success': False, 'message': 'Datos insuficientes'}), 400
        
        # Buscar reserva
        if reservation_id:
            reservation = Reservation.query.get(reservation_id)
        else:
            reservation = Reservation.query.filter_by(
                user_id=user_id,
                schedule_id=schedule_id,
                status='confirmed'
            ).first()
        
        if not reservation:
            return jsonify({'success': False, 'message': 'Reserva no encontrada'}), 404
        
        # Verificar que el instructor sea dueño de esta clase
        if reservation.schedule.instructor_id != current_user.id and current_user.role != 'admin':
            return jsonify({'success': False, 'message': 'No tienes permiso'}), 403
        
        # Marcar asistencia
        reservation.mark_attended()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Asistencia marcada para {reservation.user.full_name}',
            'data': {
                'reservation_id': reservation.id,
                'user_name': reservation.user.full_name,
                'attended': reservation.attended,
                'attendance_marked_at': reservation.attendance_marked_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== NOTAS ====================
@instructor_bp.route('/notes', methods=['POST'])
@instructor_required
def create_note(current_user):
    """Crear nota de clase o alumno"""
    try:
        data = request.get_json()
        
        note = ClassNote(
            schedule_id=data.get('schedule_id'),
            instructor_id=current_user.id,
            user_id=data.get('user_id'),  # Opcional
            note_type=data.get('note_type', 'class_general'),
            title=data.get('title'),
            content=data.get('content'),
            rating=data.get('rating')
        )
        
        db.session.add(note)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Nota creada exitosamente',
            'data': note.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@instructor_bp.route('/notes', methods=['GET'])
@instructor_required
def get_my_notes(current_user):
    """Obtener notas del instructor"""
    try:
        notes = ClassNote.query.filter_by(instructor_id=current_user.id).order_by(ClassNote.created_at.desc()).all()
        return jsonify({'success': True, 'data': [n.to_dict() for n in notes]}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== ESTADÍSTICAS ====================
@instructor_bp.route('/statistics', methods=['GET'])
@instructor_required
def get_statistics(current_user):
    """Obtener estadísticas de desempeño del instructor"""
    try:
        # Fechas
        today = date.today()
        start_of_month = today.replace(day=1)
        
        # Total clases impartidas
        total_classes = Schedule.query.filter(
            and_(
                Schedule.instructor_id == current_user.id,
                Schedule.date < today,
                Schedule.status == 'completed'
            )
        ).count()
        
        # Clases este mes
        classes_this_month = Schedule.query.filter(
            and_(
                Schedule.instructor_id == current_user.id,
                Schedule.date >= start_of_month,
                Schedule.date <= today,
                Schedule.status.in_(['scheduled', 'completed'])
            )
        ).count()
        
        # Total alumnos atendidos (únicos)
        total_students = db.session.query(func.count(func.distinct(Reservation.user_id))).filter(
            Reservation.schedule_id.in_(
                db.session.query(Schedule.id).filter(Schedule.instructor_id == current_user.id)
            ),
            Reservation.status.in_(['confirmed', 'attended'])
        ).scalar()
        
        # Promedio de asistencia
        total_reservations = Reservation.query.join(Schedule).filter(
            Schedule.instructor_id == current_user.id,
            Reservation.status.in_(['confirmed', 'attended'])
        ).count()
        
        attended_reservations = Reservation.query.join(Schedule).filter(
            Schedule.instructor_id == current_user.id,
            Reservation.attended == True
        ).count()
        
        attendance_rate = (attended_reservations / total_reservations * 100) if total_reservations > 0 else 0
        
        return jsonify({
            'success': True,
            'data': {
                'total_classes': total_classes,
                'classes_this_month': classes_this_month,
                'total_students': total_students or 0,
                'total_reservations': total_reservations,
                'attended_reservations': attended_reservations,
                'attendance_rate': round(attendance_rate, 2)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# ==================== INGRESOS ====================
@instructor_bp.route('/earnings', methods=['GET'])
@instructor_required
def get_earnings(current_user):
    """Obtener ingresos (semanal, quincenal, mensual)"""
    try:
        # Fechas
        today = date.today()
        start_of_week = today - timedelta(days=today.weekday())
        start_of_fortnight = today - timedelta(days=14)
        start_of_month = today.replace(day=1)
        
        # Pagos por periodo
        def get_earnings_for_period(start_date, end_date):
            payments = InstructorPayment.query.filter(
                and_(
                    InstructorPayment.instructor_id == current_user.id,
                    InstructorPayment.created_at >= datetime.combine(start_date, datetime.min.time()),
                    InstructorPayment.created_at <= datetime.combine(end_date, datetime.max.time()),
                    InstructorPayment.status == 'paid'
                )
            ).all()
            
            total = sum(p.amount for p in payments)
            return {'total': total, 'count': len(payments), 'payments': [p.to_dict() for p in payments]}
        
        weekly = get_earnings_for_period(start_of_week, today)
        fortnightly = get_earnings_for_period(start_of_fortnight, today)
        monthly = get_earnings_for_period(start_of_month, today)
        
        return jsonify({
            'success': True,
            'data': {
                'weekly': weekly,
                'fortnightly': fortnightly,
                'monthly': monthly
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500