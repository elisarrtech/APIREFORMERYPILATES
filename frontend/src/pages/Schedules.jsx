import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';
import api from '../services/api';

/**
 * Schedules Page - Public View
 * Muestra todos los horarios de clases disponibles
 * @version 1.0.0 - ÉLITE MUNDIAL
 * @author @elisarrtech
 */
const Schedules = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState('all');
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    generateWeekDays();
    loadSchedules();
  }, [selectedDate, selectedClass]);

  /**
   * Genera los días de la semana actual
   */
  const generateWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }

    setWeekDays(days);
  };

  /**
   * Carga los horarios desde la API
   */
  const loadSchedules = async () => {
    try {
      setLoading(true);
      
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const params = {
        date: formattedDate,
      };

      if (selectedClass !== 'all') {
        params.class_type = selectedClass;
      }

      const response = await api.get('/schedules/public', { params });
      
      setSchedules(response.data.data || []);
    } catch (error) {
      console.error('❌ Error cargando horarios:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la reserva de una clase
   */
  const handleReserve = (scheduleId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirigir a la página de reserva con el scheduleId
    navigate(`/schedule?id=${scheduleId}`);
  };

  /**
   * Cambia la semana
   */
  const changeWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

  /**
   * Selecciona un día específico
   */
  const selectDay = (day) => {
    setSelectedDate(day);
  };

  /**
   * Formatea la fecha
   */
  const formatDate = (date) => {
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Formatea el día corto
   */
  const formatDayShort = (date) => {
    return date.toLocaleDateString('es-MX', {
      weekday: 'short',
      day: 'numeric',
    });
  };

  /**
   * Verifica si un día está seleccionado
   */
  const isDaySelected = (day) => {
    return day.toDateString() === selectedDate.toDateString();
  };

  /**
   * Verifica si un día es hoy
   */
  const isToday = (day) => {
    return day.toDateString() === new Date().toDateString();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-sage-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Horarios de Clases</h1>
            <p className="text-gray-600">
              {isAuthenticated 
                ? 'Reserva tu clase de Pilates' 
                : 'Consulta nuestros horarios disponibles'}
            </p>
          </div>

          {/* Week Navigator */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => changeWeek(-1)}
                className="p-2 hover:bg-sage-50 rounded-lg transition-colors duration-200"
              >
                <ChevronLeft size={24} className="text-sage-600" />
              </button>

              <div className="text-center">
                <div className="text-xl font-bold text-gray-800 capitalize">
                  {formatDate(selectedDate)}
                </div>
              </div>

              <button
                onClick={() => changeWeek(1)}
                className="p-2 hover:bg-sage-50 rounded-lg transition-colors duration-200"
              >
                <ChevronRight size={24} className="text-sage-600" />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => selectDay(day)}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    isDaySelected(day)
                      ? 'bg-sage-600 text-white shadow-lg'
                      : isToday(day)
                      ? 'bg-sage-100 text-sage-700 border-2 border-sage-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-sage-50 hover:text-sage-600'
                  }`}
                >
                  <div className="text-xs uppercase font-semibold mb-1">
                    {day.toLocaleDateString('es-MX', { weekday: 'short' })}
                  </div>
                  <div className="text-2xl font-bold">
                    {day.getDate()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <Filter size={20} className="text-sage-600" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
              >
                <option value="all">Todas las clases</option>
                <option value="plt-fit">PLT FIT</option>
                <option value="plt-blast">PLT BLAST</option>
                <option value="plt-jump">PLT JUMP</option>
                <option value="plt-hit">PLT HIT</option>
              </select>
            </div>
          </div>

          {/* Schedules List */}
          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-12 w-32 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              ))
            ) : schedules.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg">No hay clases programadas para esta fecha</p>
              </div>
            ) : (
              schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    
                    {/* Left side - Class info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {schedule.time.split(':')[0]}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {schedule.class_name}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Clock size={14} />
                            {schedule.time} - {schedule.duration} min
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-sage-600" />
                          <span>
                            {schedule.reserved}/{schedule.capacity} reservados
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-sage-600" />
                          <span>Instructor: {schedule.instructor_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-sage-600" />
                          <span>Sala {schedule.room || '1'}</span>
                        </div>
                      </div>

                      {/* Availability bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Disponibilidad</span>
                          <span className={schedule.available > 0 ? 'text-sage-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {schedule.available > 0 ? `${schedule.available} lugares disponibles` : 'Clase llena'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              schedule.available > 3 ? 'bg-sage-500' : schedule.available > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(schedule.reserved / schedule.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Action button */}
                    <div>
                      {isAuthenticated ? (
                        <button
                          onClick={() => handleReserve(schedule.id)}
                          disabled={schedule.available === 0}
                          className={`px-8 py-3 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                            schedule.available > 0
                              ? 'bg-sage-600 hover:bg-sage-700 text-white hover:shadow-xl'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {schedule.available > 0 ? 'Reservar' : 'Clase llena'}
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/login')}
                          className="px-8 py-3 rounded-xl font-bold uppercase tracking-wide bg-sage-600 hover:bg-sage-700 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                        >
                          Iniciar Sesión
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Info message for non-authenticated users */}
          {!isAuthenticated && schedules.length > 0 && (
            <div className="mt-8 bg-sage-50 border border-sage-200 rounded-2xl p-6 flex items-start gap-4">
              <AlertCircle size={24} className="text-sage-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-sage-800 mb-2">
                  ¿Quieres reservar una clase?
                </h3>
                <p className="text-sage-700 mb-4">
                  Inicia sesión para poder reservar tus clases de Pilates. Si aún no tienes cuenta, regístrate gratis.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-2 bg-white hover:bg-gray-50 text-sage-600 font-semibold rounded-lg border-2 border-sage-600 transition-colors duration-200"
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Schedules;