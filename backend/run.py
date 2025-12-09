"""
REFORMERY - Application Entry Point
Flask application runner

@version 2.0.0
@author @elisarrtech
"""

import os
import logging
from dotenv import load_dotenv
from app import create_app
from flask import request, jsonify
from flask_cors import CORS

# Load environment variables from .env (if present)
load_dotenv()

# ===========================
# App creation
# ===========================
FLASK_ENV = os.getenv('FLASK_ENV', 'development')
app = create_app(FLASK_ENV)

# ===========================
# CORS configuration
# ===========================
# Use environment variable CORS_ALLOWED_ORIGINS as a comma separated list.
# If not provided, default to the production Netlify origin and localhost for dev.
_default_origins = "https://ollinavances.netlify.app, http://localhost:3000"
_raw = os.getenv('CORS_ALLOWED_ORIGINS') or os.getenv('ALLOWED_ORIGINS') or _default_origins
ALLOWED_ORIGINS = [o.strip() for o in _raw.split(",") if o.strip()]

# Apply CORS middleware to the Flask app.
# This will respond properly to preflight (OPTIONS) requests and add the
# necessary Access-Control-Allow-* headers.
CORS(
    app,
    origins=ALLOWED_ORIGINS,
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
)

# Add a small after_request hook to ensure Vary header and in case some
# blueprints bypass flask-cors for any reason.
@app.after_request
def _add_cors_headers(response):
    # Let browsers know the response may vary based on Origin
    response.headers.setdefault("Vary", "Origin")
    # Ensure Access-Control-Allow-Credentials is present when credentials are enabled
    if os.getenv('CORS_ALLOW_CREDENTIALS', 'true').lower() in ("1", "true", "yes"):
        response.headers.setdefault("Access-Control-Allow-Credentials", "true")
    return response

# ===========================
# Logging configuration
# ===========================
logging.basicConfig(
    level=logging.DEBUG if FLASK_ENV == "development" else logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

# Optional: simple health endpoint if not provided by the app
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "env": FLASK_ENV}), 200

# ===========================
# Run server
# ===========================
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "0.0.0.0")
    debug = os.getenv("FLASK_DEBUG", "True").lower() in ("1", "true", "yes")

    # Banner (clear and helpful)
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🏋️ REFORMERY API SERVER 🏋️                      ║
║                                                              ║
║  Version: 2.0.0                                              ║
║  Environment: {FLASK_ENV:<30}║
║  Running on: http://{host}:{port:<27}║
║                                                              ║
║  Allowed Origins:                                            ║
║  • {', '.join(ALLOWED_ORIGINS)}                            ║
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

    # Start the Flask development server (Railway uses host=0.0.0.0 and PORT)
    app.run(host=host, port=port, debug=debug)
