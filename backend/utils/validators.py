# utils/validators.py
# Validadores de datos
# Autor: @elisarrtech con Elite AI Architect

import re
from utils.exceptions import ValidationError

def validate_email(email):
    # Valida formato de email
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        raise ValidationError("Formato de email inválido")
    return True

def validate_password(password):
    # Valida contraseña (mínimo 6 caracteres)
    if len(password) < 6:
        raise ValidationError("La contraseña debe tener al menos 6 caracteres")
    return True

def validate_date_range(start_date, end_date):
    # Valida rango de fechas
    if start_date > end_date:
        raise ValidationError("La fecha de inicio debe ser anterior a la fecha de fin")
    return True
