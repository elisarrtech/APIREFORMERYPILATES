# 🔐 Documentación de Corrección del Login

## Problema Identificado

El sistema de inicio de sesión no funcionaba correctamente debido a múltiples problemas de configuración:

### 1. ❌ Error de CORS (Principal)
**Problema**: El backend estaba configurado para permitir solo `http://localhost:3000` pero el frontend de Vite corre en `http://localhost:5173`

**Síntoma**: Los requests desde el frontend eran bloqueados por el navegador con error de CORS

**Solución**: 
- Actualizado `/backend/run.py` línea 30 para incluir todos los puertos necesarios:
```python
_default_origins = "https://ollinavances.netlify.app, http://localhost:5173, http://127.0.0.1:5173, http://localhost:3000"
```

### 2. ❌ OPTIONS Requests Fallando
**Problema**: Las rutas de autenticación incluían `OPTIONS` en los métodos permitidos, pero no manejaban explícitamente estos requests, causando errores 500

**Síntoma**: Preflight CORS requests fallaban

**Solución**:
- Agregado manejo explícito de OPTIONS en `/backend/app/routes/auth.py`:
```python
# Handle CORS preflight
if request.method == 'OPTIONS':
    return jsonify({'success': True}), 200
```

### 3. 🗑️ Archivo Obsoleto
**Problema**: Existía un archivo `/frontend/src/services/auth.js` obsoleto que podría causar confusión

**Solución**: Eliminado el archivo. El sistema usa correctamente `/frontend/src/services/api.js`

---

## ✅ Credenciales de Prueba

El sistema viene con 3 usuarios pre-configurados:

| Rol | Email | Contraseña | Dashboard |
|-----|-------|------------|-----------|
| **Admin** | `admin@reformery.com` | `admin123` | `/admin/dashboard` |
| **Cliente** | `client@reformery.com` | `client123` | `/schedules` |
| **Instructor** | `instructor@reformery.com` | `instructor123` | `/instructor/dashboard` |

---

## 🚀 Cómo Probar el Login

### Backend (Puerto 5000)
```bash
cd backend
pip install -r requirements.txt
python3 run.py
```

### Frontend (Puerto 5173)
```bash
cd frontend
npm install
npm run dev
```

### Test Manual
1. Abrir navegador en `http://localhost:5173/login`
2. Usar cualquiera de las credenciales de arriba
3. Verificar que redirija al dashboard correcto

### Test con cURL
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@reformery.com", "password": "admin123"}'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJ...",
    "user": {
      "id": 1,
      "email": "admin@reformery.com",
      "full_name": "Admin Reformery",
      "role": "admin",
      "active": true
    }
  }
}
```

---

## 🔧 Archivos Modificados

1. **`/backend/run.py`** - Actualizado CORS origins
2. **`/backend/app/routes/auth.py`** - Agregado manejo de OPTIONS
3. **`/frontend/src/services/auth.js`** - Eliminado (obsoleto)
4. **`/.gitignore`** - Creado para excluir node_modules

---

## 📝 Notas Técnicas

### Configuración de CORS
El backend ahora acepta requests desde:
- `https://ollinavances.netlify.app` (Producción)
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:5173` (Alternativa local)
- `http://localhost:3000` (Create React App - por compatibilidad)

### Password Hashing
- Método: `werkzeug.security.generate_password_hash()`
- Esquema: pbkdf2:sha256 (default)
- Verificación resiliente con fallback a passlib para compatibilidad

### JWT Tokens
- Validez: 24 horas (86400 segundos)
- Header: `Authorization: Bearer <token>`
- Almacenamiento: localStorage en frontend

---

## 🔒 Seguridad

### Producción
Para desplegar en producción, asegúrate de:

1. **Cambiar secrets** en `.env`:
```bash
SECRET_KEY=<tu-secret-key-segura>
JWT_SECRET_KEY=<tu-jwt-secret-segura>
```

2. **Configurar DATABASE_URL** para producción:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

3. **Actualizar CORS_ALLOWED_ORIGINS**:
```bash
CORS_ALLOWED_ORIGINS=https://tu-frontend.com
```

4. **Habilitar HTTPS** y configurar cookies seguras

---

## ✨ Estado Final

- ✅ Backend iniciando correctamente
- ✅ Frontend conectando al backend
- ✅ CORS configurado correctamente
- ✅ Login funcionando con las 3 credenciales de prueba
- ✅ Tokens JWT generándose correctamente
- ✅ Redirecciones por rol funcionando

---

## 🐛 Troubleshooting

### "Network Error" en Frontend
- Verificar que el backend esté corriendo en puerto 5000
- Verificar CORS en la consola del navegador
- Verificar que `VITE_API_URL` esté configurado en `/frontend/.env`

### "Invalid credentials" 
- Verificar que estés usando las credenciales exactas
- Verificar que la base de datos esté seed-eada correctamente
- Reiniciar el backend para re-crear usuarios

### CORS Errors
- Verificar que `run.py` incluya el puerto correcto
- Limpiar cache del navegador
- Probar en modo incógnito

---

**Última actualización**: 2025-12-09
**Autor**: GitHub Copilot
**Estado**: ✅ FUNCIONANDO
