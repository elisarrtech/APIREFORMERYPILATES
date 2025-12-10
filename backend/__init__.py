"""
Marca el directorio 'backend' como un paquete Python
y expone la app de Flask para Gunicorn.
"""

from .run import app  # noqa: F401
