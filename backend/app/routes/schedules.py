"""
Schedules Public Routes
@author @elisarrtech
"""

from flask import Blueprint, jsonify
from app.models.schedule import Schedule
from datetime import date, timedelta

schedules_public_bp = Blueprint('schedules_public', __name__)


@schedules_public_bp.route('/available', methods=['GET'])
def get_available_schedules():
    """Obtener horarios disponibles (próximos 7 días)"""
    try:
        today = date.today()
        week_end = today + timedelta(days=7)
        
        schedules = Schedule.query.filter(
            Schedule.date >= today,
            Schedule.date <= week_end,
            Schedule.status == 'scheduled'
        ).order_by(Schedule.date, Schedule.start_time).all()
        
        return jsonify({
            'success': True,
            'data': [s.to_dict() for s in schedules]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500