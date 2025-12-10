# Backend Flask para autenticación (lista para Railway)

Instrucciones rápidas:

1) Variables de entorno recomendadas (defínelas en Railway -> Settings -> Environment Variables):
   - DATABASE_URL (Railway provee esto; Postgres)
   - JWT_SECRET_KEY (secreto fuerte)
   - JWT_ACCESS_EXPIRES_MIN (ej: 15)
   - JWT_REFRESH_EXPIRES_DAYS (ej: 30)
   - FRONTEND_URL (por defecto ya está puesto a https://ollinavances.netlify.app)

2) Migraciones:
   - Local:
     - export FLASK_APP=backend.app:create_app
     - flask db init
     - flask db migrate -m "init"
     - flask db upgrade

3) Ejecutar local:
   - pip install -r requirements.txt
   - flask run

4) Deploy en Railway:
   - Asegúrate de definir DATABASE_URL y JWT_SECRET_KEY en Railway.
   - Comando de inicio en Railway: `gunicorn backend.app:app`
   - Procfile: web: gunicorn backend.app:app

5) Endpoints:
   - POST /api/auth/register -> { email, password, role? }
   - POST /api/auth/login -> { email, password, remember? } -> responde { success, user, access_token, refresh_token }
   - POST /api/auth/refresh -> (Authorization Bearer refresh-token) -> { success, access_token }
   - POST /api/auth/logout -> revoca refresh token

6) CORS y Netlify:
   - FRONTEND_URL por defecto ya apunta a tu frontend: https://ollinavances.netlify.app
   - Si usas cookies httpOnly en vez de tokens en respuesta JSON, deberás:
     - En backend: setear la cookie del refresh token con secure, httponly, samesite.
     - En frontend: fetch(..., credentials: 'include') o axios withCredentials = true

7) Recomendaciones de seguridad:
   - Considera almacenar refresh tokens en httpOnly cookies (más seguro).
   - Implementar rate limiting (Flask-Limiter) en rutas sensibles (/login, /register).
   - Usar HTTPS (Railway lo maneja).
