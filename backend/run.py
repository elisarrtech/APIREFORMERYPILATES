"""
REFORMERY - Application Entry Point
Flask application runner

@version 2.0.0
@author @elisarrtech
"""

import os
import logging
from dotenv import load_dotenv
from flask_cors import CORS
from app import create_app

# Load environment variables
load_dotenv()

# Create Flask app
app = create_app(os.getenv('FLASK_ENV', 'development'))

# Enable CORS: allow Netlify site and localhost:3000 for development
CORS(
    app,
    resources={r"/api/*": {"origins": ["https://ollinavances.netlify.app", "http://localhost:3000"]}},
    supports_credentials=True,
)

# Configure basic logging to stdout (useful en hosting)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("Starting REFORMERY API app")

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    logger.info(f"Environment: {os.getenv('FLASK_ENV', 'development')}")
    logger.info(f"Running on: http://{host}:{port}")
    
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
