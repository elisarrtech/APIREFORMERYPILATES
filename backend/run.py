"""
REFORMERY - Application Entry Point
Flask application runner

@version 2.0.0
@author @elisarrtech
"""

import os
from dotenv import load_dotenv
from app import create_app

# Load environment variables
load_dotenv()

# Create Flask app
app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🏋️ REFORMERY API SERVER 🏋️                      ║
║                                                              ║
║  Version: 2.0.0                                              ║
║  Environment: {os.getenv('FLASK_ENV', 'development')}                                      ║
║  Running on: http://{host}:{port}                            ║
║                                                              ║
║  Endpoints:                                                  ║
║  • Health: /health                                           ║
║  • Auth: /api/v1/auth                                        ║
║  • Admin: /api/v1/admin-reformery                            ║
║                                                              ║
║  Demo Credentials:                                           ║
║  • Admin: admin@reformery.com / admin123                     ║
║  • Client: client@reformery.com / client123                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    """)
    
    app.run(host=host, port=port, debug=debug)
