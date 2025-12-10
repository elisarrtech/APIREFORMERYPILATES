```markdown
# Backend Flask para autenticación (lista para Railway)

Instrucciones rápidas:

1. Variables de entorno recomendadas:
   - DATABASE_URL (Railway proporciona esto)
   - JWT_SECRET_KEY (cambiar por un secreto fuerte)
   - JWT_ACCESS_EXPIRES_MIN (ej: 15)
   - JWT_REFRESH_EXPIRES_DAYS (ej: 30)
   - FRONTEND_URL (URL del frontend, ej: https://mi-frontend.vercel.app)

2. Migraciones:
   - local:
     - export FLASK_APP=backend.app:create_app
     - flask db init
     - flask db migrate -m "init"
     - flask db upgrade

3. Ejecutar local:
   - pip install -r requirements.txt
   - flask run

4. Deploy en Railway:
   - Asegúrate de definir DATABASE_URL y JWT_SECRET_KEY en Railway.
   - Comando de inicio en Railway: `gunicorn backend.app:app`
   - Procfile: web: gunicorn backend.app:app

5. Endpoints:
   - POST /api/auth/register -> { email, password, role? }
   - POST /api/auth/login -> { email, password, remember? } -> responde { success, user, access_token, refresh_token }
   - POST /api/auth/refresh -> (enviar refresh token en Authorization Bearer) -> { success, access_token }
   - POST /api/auth/logout -> revoca refresh token

6. Seguridad y recomendaciones:
   - Forzar HTTPS (Railway lo maneja cuando usas su dominio).
   - Rotar refresh tokens si quieres reforzar seguridad.
   - Implementar rate limiting (Flask-Limiter) para /login.
   - Evitar almacenar access token en localStorage si te preocupa XSS; preferir cookies httpOnly si quieres mayor seguridad (necesita cambiar la manera en que frontend maneja tokens).
```
