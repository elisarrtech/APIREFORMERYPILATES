# REFORMERY - API ENDPOINTS DOCUMENTATION

## 🔐 Autenticación
Todos los endpoints requieren JWT token excepto `/auth/login` y `/auth/register`

**Header:**



## 📋 ENDPOINTS ADMIN REFORMERY

### Base URL: `/api/v1/admin-reformery`

---

## 1️⃣ GESTIÓN DE PAQUETES DE ALUMNOS

### 📌 GET `/user-packages/<user_id>`
Obtiene todos los paquetes de un alumno

**Roles:** admin

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "packages": [...]
  }
}
📌 PATCH /user-packages/<user_package_id>/update-expiry
Cambia la vigencia de un paquete

Roles: admin

Body:

JSON
{
  "expiry_date": "2025-12-31"
}
📌 PATCH /user-packages/<user_package_id>/adjust-classes
Asigna o quita clases de un paquete

Roles: admin

Body:

JSON
{
  "remaining_classes": 10
}
📌 DELETE /user-packages/<user_package_id>
Elimina un paquete de alumno

Roles: admin

2️⃣ GESTIÓN DE HORARIOS
📌 POST /schedules
Crea un nuevo horario

Roles: admin

Body:

JSON
{
  "pilates_class_id": 1,
  "instructor_id": 1,
  "start_time": "2025-10-28T10:00:00",
  "end_time": "2025-10-28T10:50:00",
  "max_capacity": 10,
  "notes": "Opcional"
}
📌 DELETE /schedules/<schedule_id>
Elimina un horario

Roles: admin

📌 PUT /schedules/<schedule_id>
Actualiza un horario

Roles: admin

Body:

JSON
{
  "pilates_class_id": 1,
  "instructor_id": 2,
  "start_time": "2025-10-28T11:00:00",
  "end_time": "2025-10-28T11:50:00",
  "max_capacity": 12
}
3️⃣ GESTIÓN DE PAQUETES
📌 GET /packages
Obtiene todos los paquetes

Roles: admin

📌 POST /packages
Crea un nuevo paquete

Roles: admin

Body:

JSON
{
  "name": "PAQUETE 10 - 10 Clases",
  "description": "Vale por 10 clases REFORMERY",
  "total_classes": 10,
  "validity_days": 30,
  "price": 1200.00,
  "active": true
}
📌 PUT /packages/<package_id>
Actualiza un paquete

Roles: admin

📌 DELETE /packages/<package_id>
Elimina un paquete

Roles: admin

4️⃣ ABRIR/CERRAR CLASES
📌 PATCH /schedules/<schedule_id>/toggle-status
Abre o cierra una clase para reservas

Roles: admin

Body:

JSON
{
  "status": "scheduled"
}
Valores válidos:

scheduled - Abierta para reservas
cancelled - Cerrada para reservas
completed - Completada
5️⃣ GESTIÓN DE CUPOS
📌 PATCH /schedules/<schedule_id>/capacity
Cambia el cupo de una clase

Roles: admin

Body:

JSON
{
  "max_capacity": 15
}
6️⃣ GESTIÓN DE USUARIOS
📌 GET /users
Obtiene todos los usuarios

Roles: admin

Query params:

role (opcional): client, instructor, admin
📌 GET /users/<user_id>
Obtiene detalle de un usuario

Roles: admin

📌 PUT /users/<user_id>
Modifica perfil de usuario

Roles: admin

Body:

JSON
{
  "full_name": "Nuevo Nombre",
  "email": "nuevo@email.com",
  "role": "client",
  "active": true
}
7️⃣ LISTAS DE RESERVAS
📌 GET /schedules/<schedule_id>/reservations
Obtiene lista de reservas de una clase

Roles: admin

8️⃣ LISTAS DE ASISTENCIA
📌 GET /schedules/<schedule_id>/attendance
Obtiene lista de asistencia

Roles: admin

Response:

JSON
{
  "success": true,
  "data": {
    "schedule": {...},
    "attendance_list": [...],
    "total_students": 10,
    "attended": 8,
    "not_attended": 2,
    "pending": 0
  }
}
9️⃣ ASIGNAR INSTRUCTORES
📌 PATCH /schedules/<schedule_id>/assign-instructor
Asigna instructor a clase

Roles: admin

Body:

JSON
{
  "instructor_id": 2
}
📊 ESTADÍSTICAS
📌 GET /statistics
Obtiene estadísticas del sistema

Roles: admin

Response:

JSON
{
  "success": true,
  "data": {
    "users": {...},
    "packages": {...},
    "classes": {...},
    "schedules": {...},
    "reservations": {...}
  }
}
🏋️ CLASES REFORMERY
PLT FIT
PLT BLAST
PLT JUMP
PLT HIT
PLT PRIVADA TRAPEZE
PLT PRIVADAS Y SEMIPRIVADAS
PLT EMBARAZADAS
💰 PAQUETES REFORMERY
PAQUETE 1 - 1 Clase Muestra - $150
PAQUETE 2 - 1 Clase - $200
PAQUETE 3 - 5 Clases - $800
PAQUETE 4 - 8 Clases - $1,000
PAQUETE 5 - 12 Clases - $1,400
PAQUETE 6 - 20 Clases - $1,900
PAQUETE DUO - 1 Reformery + 1 Top Barre - $380
PAQUETE 5+5 - 5 Reformery + 5 Top Barre - $1,400
PAQUETE 8+8 - 8 Reformery + 8 Top Barre - $1,800
Todos con vigencia de 30 días.

Code

---

## **COMANDOS PARA EJECUTAR:**

```bash
# Backend
cd C:\Users\t470\Documents\GitHub\NUEVORESERVASREFORMERY\backend

# Activar venv
venv\Scripts\activate

# Poblar con datos REFORMERY reales
python seed_data_reformery.py

# Iniciar backend
python app.py
