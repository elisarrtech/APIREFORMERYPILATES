from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Habilitar CORS
    CORS(app)
    
    # Health check endpoint
    @app.route('/health')
    def health():
        return {"status": "ok", "service": "OL-LIN Backend"}, 200
    
    # Login endpoint simple
    @app.route('/api/v1/auth/login', methods=['POST'])
    def login():
        return {
            "success": True,
            "user": {
                "id": 1,
                "email": "admin@ollin.com",
                "full_name": "Admin OL-LIN",
                "role": "admin"
            },
            "access_token": "jwt-token-tempora-123"
        }, 200
    
    # Register endpoint simple
    @app.route('/api/v1/auth/register', methods=['POST'])
    def register():
        return {
            "success": True,
            "user": {
                "id": 2,
                "email": "newuser@ollin.com",
                "full_name": "Nuevo Usuario",
                "role": "client"
            },
            "access_token": "jwt-token-tempora-456",
            "message": "Usuario registrado exitosamente"
        }, 201
    
    return app
