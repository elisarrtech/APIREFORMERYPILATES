# backend/routes/attendance.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Attendance, Schedule, User

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/mark', methods=['POST'])
@jwt_required()
def mark_attendance():
    """
    Registra la asistencia de un alumno a una clase
    """
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        schedule_id = data.get('schedule_id')
        
        # Validar que exista el alumno
        student = User.query.get(student_id)
        if not student:
            return jsonify({
                'success': False,
                'message': 'Alumno no encontrado'
            }), 404
        
        # Validar que exista la clase
        schedule = Schedule.query.get(schedule_id)
        if not schedule:
            return jsonify({
                'success': False,
                'message': 'Clase no encontrada'
            }), 404
        
        # Verificar si ya registró asistencia
        existing = Attendance.query.filter_by(
            student_id=student_id,
            schedule_id=schedule_id
        ).first()
        
        if existing:
            return jsonify({
                'success': False,
                'message': 'Asistencia ya registrada'
            }), 400
        
        # Registrar asistencia
        attendance = Attendance(
            student_id=student_id,
            schedule_id=schedule_id,
            status='present',
            marked_at=datetime.utcnow()
        )
        
        db.session.add(attendance)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Asistencia registrada correctamente',
            'data': {
                'student_name': student.full_name,
                'class_name': schedule.class_name,
                'date': schedule.date.isoformat(),
                'time': schedule.time.isoformat()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500