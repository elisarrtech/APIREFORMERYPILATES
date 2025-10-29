"""
Models Package
Importa todos los modelos de la aplicación
"""

from extensions import db
from models.user import User
from models.schedule import Schedule
from models.reservation import Reservation
from models.package import Package
from models.user_package import UserPackage
from models.attendance import Attendance  # ← AGREGAR ESTA LÍNEA

__all__ = [
    'db',
    'User',
    'Schedule',
    'Reservation',
    'Package',
    'UserPackage',
    'Attendance'  # ← AGREGAR ESTA LÍNEA
]