# utils/exceptions.py
# Excepciones personalizadas
# Autor: @elisarrtech con Elite AI Architect

class FitnessClubException(Exception):
    # Excepción base de la aplicación
    status_code = 400
    
    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
    
    def to_dict(self):
        rv = dict(self.payload or ())
        rv['success'] = False
        rv['message'] = self.message
        rv['error'] = self.__class__.__name__
        return rv


class AuthenticationError(FitnessClubException):
    # Error de autenticación
    status_code = 401


class AuthorizationError(FitnessClubException):
    # Error de autorización
    status_code = 403


class ValidationError(FitnessClubException):
    # Error de validación
    status_code = 400


class NotFoundError(FitnessClubException):
    # Recurso no encontrado
    status_code = 404


class ConflictError(FitnessClubException):
    # Conflicto (ej: reserva duplicada)
    status_code = 409
