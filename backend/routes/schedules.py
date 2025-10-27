from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'tu-clave-secreta-aqui'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pilates.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Modelos de Base de Datos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    rol = db.Column(db.String(20), nullable=False)  # 'usuario', 'instructor', 'admin'
    paquete_id = db.Column(db.Integer, db.ForeignKey('paquete.id'), nullable=True)
    fecha_inicio_paquete = db.Column(db.DateTime, nullable=True)
    clases_restantes = db.Column(db.Integer, default=0)
    
    reservas = db.relationship('Reserva', backref='usuario', lazy=True)

class Paquete(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    numero_clases = db.Column(db.Integer, nullable=False)
    duracion_dias = db.Column(db.Integer, default=30)
    precio = db.Column(db.Float, nullable=False)
    descripcion = db.Column(db.String(200))

class Instructor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True)
    especialidad = db.Column(db.String(100))
    
    clases = db.relationship('Clase', backref='instructor', lazy=True)

class Clase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    instructor_id = db.Column(db.Integer, db.ForeignKey('instructor.id'), nullable=False)
    dia_semana = db.Column(db.Integer, nullable=False)  # 0=Lunes, 5=Sábado
    hora_inicio = db.Column(db.String(5), nullable=False)  # formato "HH:MM"
    hora_fin = db.Column(db.String(5), nullable=False)
    capacidad_maxima = db.Column(db.Integer, default=15)
    descripcion = db.Column(db.String(200))
    activa = db.Column(db.Boolean, default=True)
    
    reservas = db.relationship('Reserva', backref='clase', lazy=True)

class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    clase_id = db.Column(db.Integer, db.ForeignKey('clase.id'), nullable=False)
    fecha_clase = db.Column(db.Date, nullable=False)
    fecha_reserva = db.Column(db.DateTime, default=datetime.utcnow)
    estado = db.Column(db.String(20), default='confirmada')  # confirmada, cancelada

# Decorador para verificar token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token no encontrado'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token inválido'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Rutas de Autenticación
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'El email ya está registrado'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    
    new_user = User(
        nombre=data['nombre'],
        email=data['email'],
        password=hashed_password,
        rol=data.get('rol', 'usuario')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Usuario registrado exitosamente'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Credenciales inválidas'}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'nombre': user.nombre,
            'email': user.email,
            'rol': user.rol,
            'clases_restantes': user.clases_restantes,
            'paquete_id': user.paquete_id
        }
    })

# Rutas de Paquetes
@app.route('/api/paquetes', methods=['GET'])
def get_paquetes():
    paquetes = Paquete.query.all()
    return jsonify([{
        'id': p.id,
        'nombre': p.nombre,
        'numero_clases': p.numero_clases,
        'duracion_dias': p.duracion_dias,
        'precio': p.precio,
        'descripcion': p.descripcion
    } for p in paquetes])

@app.route('/api/usuario/comprar-paquete', methods=['POST'])
@token_required
def comprar_paquete(current_user):
    data = request.get_json()
    paquete = Paquete.query.get(data['paquete_id'])
    
    if not paquete:
        return jsonify({'message': 'Paquete no encontrado'}), 404
    
    current_user.paquete_id = paquete.id
    current_user.clases_restantes = paquete.numero_clases
    current_user.fecha_inicio_paquete = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Paquete adquirido exitosamente',
        'clases_restantes': current_user.clases_restantes
    })

# Rutas de Clases
@app.route('/api/clases', methods=['GET'])
def get_clases():
    clases = Clase.query.filter_by(activa=True).all()
    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'instructor': c.instructor.nombre,
        'instructor_id': c.instructor_id,
        'dia_semana': c.dia_semana,
        'hora_inicio': c.hora_inicio,
        'hora_fin': c.hora_fin,
        'capacidad_maxima': c.capacidad_maxima,
        'descripcion': c.descripcion
    } for c in clases])

@app.route('/api/clases', methods=['POST'])
@token_required
def crear_clase(current_user):
    if current_user.rol not in ['admin']:
        return jsonify({'message': 'No autorizado'}), 403
    
    data = request.get_json()
    
    nueva_clase = Clase(
        nombre=data['nombre'],
        instructor_id=data['instructor_id'],
        dia_semana=data['dia_semana'],
        hora_inicio=data['hora_inicio'],
        hora_fin=data['hora_fin'],
        capacidad_maxima=data.get('capacidad_maxima', 15),
        descripcion=data.get('descripcion', '')
    )
    
    db.session.add(nueva_clase)
    db.session.commit()
    
    return jsonify({'message': 'Clase creada exitosamente'}), 201

@app.route('/api/clases/<int:clase_id>', methods=['PUT'])
@token_required
def actualizar_clase(current_user, clase_id):
    if current_user.rol not in ['admin']:
        return jsonify({'message': 'No autorizado'}), 403
    
    clase = Clase.query.get(clase_id)
    if not clase:
        return jsonify({'message': 'Clase no encontrada'}), 404
    
    data = request.get_json()
    
    clase.nombre = data.get('nombre', clase.nombre)
    clase.instructor_id = data.get('instructor_id', clase.instructor_id)
    clase.dia_semana = data.get('dia_semana', clase.dia_semana)
    clase.hora_inicio = data.get('hora_inicio', clase.hora_inicio)
    clase.hora_fin = data.get('hora_fin', clase.hora_fin)
    clase.capacidad_maxima = data.get('capacidad_maxima', clase.capacidad_maxima)
    clase.descripcion = data.get('descripcion', clase.descripcion)
    
    db.session.commit()
    
    return jsonify({'message': 'Clase actualizada exitosamente'})

@app.route('/api/clases/<int:clase_id>', methods=['DELETE'])
@token_required
def eliminar_clase(current_user, clase_id):
    if current_user.rol not in ['admin']:
        return jsonify({'message': 'No autorizado'}), 403
    
    clase = Clase.query.get(clase_id)
    if not clase:
        return jsonify({'message': 'Clase no encontrada'}), 404
    
    clase.activa = False
    db.session.commit()
    
    return jsonify({'message': 'Clase eliminada exitosamente'})

# Rutas de Reservas
@app.route('/api/reservas', methods=['POST'])
@token_required
def crear_reserva(current_user):
    data = request.get_json()
    
    # Verificar si el usuario tiene clases disponibles
    if current_user.clases_restantes <= 0:
        return jsonify({'message': 'No tienes clases disponibles'}), 400
    
    # Verificar si el paquete ha expirado
    if current_user.fecha_inicio_paquete:
        dias_transcurridos = (datetime.utcnow() - current_user.fecha_inicio_paquete).days
        paquete = Paquete.query.get(current_user.paquete_id)
        if dias_transcurridos > paquete.duracion_dias:
            return jsonify({'message': 'Tu paquete ha expirado'}), 400
    
    clase = Clase.query.get(data['clase_id'])
    fecha_clase = datetime.strptime(data['fecha_clase'], '%Y-%m-%d').date()
    
    # Verificar capacidad
    reservas_existentes = Reserva.query.filter_by(
        clase_id=clase.id,
        fecha_clase=fecha_clase,
        estado='confirmada'
    ).count()
    
    if reservas_existentes >= clase.capacidad_maxima:
        return jsonify({'message': 'La clase está llena'}), 400
    
    # Verificar si ya tiene reserva para esa clase
    reserva_existente = Reserva.query.filter_by(
        usuario_id=current_user.id,
        clase_id=clase.id,
        fecha_clase=fecha_clase,
        estado='confirmada'
    ).first()
    
    if reserva_existente:
        return jsonify({'message': 'Ya tienes una reserva para esta clase'}), 400
    
    nueva_reserva = Reserva(
        usuario_id=current_user.id,
        clase_id=clase.id,
        fecha_clase=fecha_clase
    )
    
    current_user.clases_restantes -= 1
    
    db.session.add(nueva_reserva)
    db.session.commit()
    
    return jsonify({
        'message': 'Reserva creada exitosamente',
        'clases_restantes': current_user.clases_restantes
    }), 201

@app.route('/api/reservas/usuario', methods=['GET'])
@token_required
def get_reservas_usuario(current_user):
    reservas = Reserva.query.filter_by(usuario_id=current_user.id, estado='confirmada').all()
    return jsonify([{
        'id': r.id,
        'clase': r.clase.nombre,
        'instructor': r.clase.instructor.nombre,
        'fecha_clase': r.fecha_clase.isoformat(),
        'hora_inicio': r.clase.hora_inicio,
        'hora_fin': r.clase.hora_fin
    } for r in reservas])

@app.route('/api/reservas', methods=['GET'])
@token_required
def get_todas_reservas(current_user):
    if current_user.rol not in ['admin', 'instructor']:
        return jsonify({'message': 'No autorizado'}), 403
    
    reservas = Reserva.query.filter_by(estado='confirmada').all()
    return jsonify([{
        'id': r.id,
        'usuario': r.usuario.nombre,
        'usuario_email': r.usuario.email,
        'clase': r.clase.nombre,
        'instructor': r.clase.instructor.nombre,
        'fecha_clase': r.fecha_clase.isoformat(),
        'hora_inicio': r.clase.hora_inicio,
        'hora_fin': r.clase.hora_fin,
        'fecha_reserva': r.fecha_reserva.isoformat()
    } for r in reservas])

@app.route('/api/reservas/<int:reserva_id>', methods=['DELETE'])
@token_required
def cancelar_reserva(current_user, reserva_id):
    reserva = Reserva.query.get(reserva_id)
    
    if not reserva:
        return jsonify({'message': 'Reserva no encontrada'}), 404
    
    if reserva.usuario_id != current_user.id and current_user.rol not in ['admin']:
        return jsonify({'message': 'No autorizado'}), 403
    
    reserva.estado = 'cancelada'
    current_user.clases_restantes += 1
    
    db.session.commit()
    
    return jsonify({
        'message': 'Reserva cancelada exitosamente',
        'clases_restantes': current_user.clases_restantes
    })

# Ruta para alertas
@app.route('/api/usuario/alertas', methods=['GET'])
@token_required
def get_alertas(current_user):
    alertas = []
    
    if current_user.paquete_id and current_user.fecha_inicio_paquete:
        paquete = Paquete.query.get(current_user.paquete_id)
        dias_transcurridos = (datetime.utcnow() - current_user.fecha_inicio_paquete).days
        dias_restantes = paquete.duracion_dias - dias_transcurridos
        
        # Alerta por clases restantes
        if current_user.clases_restantes == 1:
            alertas.append({
                'tipo': 'clases',
                'mensaje': f'¡Solo te queda 1 clase disponible en tu paquete!',
                'nivel': 'warning'
            })
        
        # Alerta por días restantes
        if dias_restantes <= 5 and dias_restantes > 0 and current_user.clases_restantes > 0:
            alertas.append({
                'tipo': 'dias',
                'mensaje': f'Tu paquete vence en {dias_restantes} días y aún tienes {current_user.clases_restantes} clases sin usar.',
                'nivel': 'warning'
            })
        
        if dias_restantes <= 0:
            alertas.append({
                'tipo': 'vencido',
                'mensaje': 'Tu paquete ha vencido. Adquiere uno nuevo para seguir reservando.',
                'nivel': 'error'
            })
    
    return jsonify(alertas)

# Rutas de Instructores
@app.route('/api/instructores', methods=['GET'])
def get_instructores():
    instructores = Instructor.query.all()
    return jsonify([{
        'id': i.id,
        'nombre': i.nombre,
        'email': i.email,
        'especialidad': i.especialidad
    } for i in instructores])
    
    
@bp.route('', methods=['GET'])
@jwt_required()
def get_schedules():
    """Obtiene horarios de la semana actual"""
    try:
        LOG.info("📋 Obteniendo horarios de la semana...")
        
        # Obtener fecha actual
        now = datetime.utcnow()
        
        # Calcular inicio y fin de la semana
        start_of_week = now - timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_week = start_of_week + timedelta(days=7)
        
        LOG.info(f"📅 Buscando horarios entre {start_of_week} y {end_of_week}")
        
        # Obtener horarios de la semana
        schedules = ClassSchedule.query.filter(
            ClassSchedule.start_time >= start_of_week,
            ClassSchedule.start_time < end_of_week,
            ClassSchedule.status == 'scheduled'
        ).order_by(ClassSchedule.start_time).all()
        
        LOG.info(f"✅ Encontrados {len(schedules)} horarios")
        
        schedules_data = []
        for schedule in schedules:
            schedules_data.append({
                'id': schedule.id,
                'pilates_class_id': schedule.pilates_class_id,
                'class_name': schedule.pilates_class.name if schedule.pilates_class else None,
                'instructor_id': schedule.instructor_id,
                'instructor_name': schedule.instructor.user.full_name if schedule.instructor and schedule.instructor.user else None,
                'start_time': schedule.start_time.isoformat() if schedule.start_time else None,
                'end_time': schedule.end_time.isoformat() if schedule.end_time else None,
                'duration': schedule.pilates_class.duration if schedule.pilates_class else None,
                'max_capacity': schedule.max_capacity,
                'available_spots': schedule.available_spots,
                'status': schedule.status,
                'is_full': schedule.available_spots <= 0
            })
        
        return jsonify({
            'success': True,
            'data': schedules_data,
            'total': len(schedules_data)
        }), 200
        
    except Exception as e:
        LOG.error(f"❌ Error al obtener horarios: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'server_error', 'message': str(e)}), 500

# Inicialización de datos demo
def init_db():
    with app.app_context():
        db.create_all()
        
        # Verificar si ya existen datos
        if Paquete.query.first():
            return
        
        # Crear paquetes
        paquetes = [
            Paquete(nombre='Básico - 5 clases', numero_clases=5, duracion_dias=30, precio=50.00, descripcion='Ideal para principiantes'),
            Paquete(nombre='Estándar - 8 clases', numero_clases=8, duracion_dias=30, precio=75.00, descripcion='El más popular'),
            Paquete(nombre='Premium - 12 clases', numero_clases=12, duracion_dias=30, precio=100.00, descripcion='Máxima flexibilidad'),
            Paquete(nombre='Intensivo - 16 clases', numero_clases=16, duracion_dias=30, precio=120.00, descripcion='Para usuarios avanzados'),
            Paquete(nombre='Unlimited - 20 clases', numero_clases=20, duracion_dias=30, precio=150.00, descripcion='Acceso casi ilimitado'),
            Paquete(nombre='Weekend - 4 clases', numero_clases=4, duracion_dias=30, precio=40.00, descripcion='Solo fines de semana'),
            Paquete(nombre='Trial - 3 clases', numero_clases=3, duracion_dias=15, precio=30.00, descripcion='Prueba nuestro servicio')
        ]
        
        for p in paquetes:
            db.session.add(p)
        
        # Crear instructores
        instructores = [
            Instructor(nombre='María González', email='maria@pilates.com', especialidad='Pilates Reformer'),
            Instructor(nombre='Carlos Ruiz', email='carlos@pilates.com', especialidad='Mat Pilates'),
            Instructor(nombre='Ana Martínez', email='ana@pilates.com', especialidad='Pilates Terapéutico')
        ]
        
        for i in instructores:
            db.session.add(i)
        
        db.session.commit()
        
        # Crear clases para la semana
        clases_demo = [
            # Lunes (0)
            Clase(nombre='Mat Pilates Mañana', instructor_id=2, dia_semana=0, hora_inicio='09:00', hora_fin='10:00', capacidad_maxima=15),
            Clase(nombre='Reformer Intermedio', instructor_id=1, dia_semana=0, hora_inicio='18:00', hora_fin='19:00', capacidad_maxima=10),
            # Martes (1)
            Clase(nombre='Pilates Terapéutico', instructor_id=3, dia_semana=1, hora_inicio='10:00', hora_fin='11:00', capacidad_maxima=12),
            Clase(nombre='Mat Pilates Avanzado', instructor_id=2, dia_semana=1, hora_inicio='19:00', hora_fin='20:00', capacidad_maxima=15),
            # Miércoles (2)
            Clase(nombre='Reformer Principiantes', instructor_id=1, dia_semana=2, hora_inicio='09:00', hora_fin='10:00', capacidad_maxima=10),
            Clase(nombre='Mat Pilates Tarde', instructor_id=2, dia_semana=2, hora_inicio='17:00', hora_fin='18:00', capacidad_maxima=15),
            # Jueves (3)
            Clase(nombre='Pilates Postural', instructor_id=3, dia_semana=3, hora_inicio='10:00', hora_fin='11:00', capacidad_maxima=12),
            Clase(nombre='Reformer Avanzado', instructor_id=1, dia_semana=3, hora_inicio='18:30', hora_fin='19:30', capacidad_maxima=10),
            # Viernes (4)
            Clase(nombre='Mat Pilates Mañana', instructor_id=2, dia_semana=4, hora_inicio='09:00', hora_fin='10:00', capacidad_maxima=15),
            Clase(nombre='Reformer Intermedio', instructor_id=1, dia_semana=4, hora_inicio='18:00', hora_fin='19:00', capacidad_maxima=10),
            # Sábado (5)
            Clase(nombre='Mat Pilates Weekend', instructor_id=2, dia_semana=5, hora_inicio='10:00', hora_fin='11:00', capacidad_maxima=20),
            Clase(nombre='Reformer Weekend', instructor_id=1, dia_semana=5, hora_inicio='11:30', hora_fin='12:30', capacidad_maxima=12),
        ]
        
        for c in clases_demo:
            db.session.add(c)
        
        # Crear usuarios demo
        admin = User(
            nombre='Admin',
            email='admin@pilates.com',
            password=generate_password_hash('admin123'),
            rol='admin'
        )
        
        instructor_user = User(
            nombre='Instructor Demo',
            email='instructor@pilates.com',
            password=generate_password_hash('instructor123'),
            rol='instructor'
        )
        
        usuario = User(
            nombre='Usuario Demo',
            email='usuario@pilates.com',
            password=generate_password_hash('usuario123'),
            rol='usuario',
            paquete_id=2,
            clases_restantes=8,
            fecha_inicio_paquete=datetime.utcnow()
        )
        
        db.session.add(admin)
        db.session.add(instructor_user)
        db.session.add(usuario)
        
        db.session.commit()
        
        print("Base de datos inicializada con datos demo")

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=8000)
