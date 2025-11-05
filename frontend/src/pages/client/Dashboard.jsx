import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  CheckCircle,
  Package,
  History,
  Bell,
  FileText,
  User as UserIcon,
  CreditCard,
  ArrowRight,
  Loader
} from 'lucide-react';
import api from '../../services/api';

/**
 * Client Dashboard
 * @version 2.0.0 - ÉLITE MUNDIAL
 * @author @elisarrtech
 */
const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [myPackages, setMyPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservar');

  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Carga todos los datos del dashboard
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar horarios disponibles próximos 7 días
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const schedulesResponse = await api.get('/schedules/public', {
        params: {
          start_date: today.toISOString().split('T')[0],
          end_date: nextWeek.toISOString().split('T')[0],
        }
      });

      setUpcomingSchedules(schedulesResponse.data.data || []);

      // Cargar mis reservas
      try {
        const reservationsResponse = await api.get('/reservations/my-reservations');
        setMyReservations(reservationsResponse.data.data || []);
      } catch (error) {
        console.log('No se pudieron cargar las reservas');
        setMyReservations([]);
      }

      // Cargar mis paquetes
      try {
        const packagesResponse = await api.get('/user-packages/my-packages');
        setMyPackages(packagesResponse.data.data || []);
      } catch (error) {
        console.log('No se pudieron cargar los paquetes');
        setMyPackages([]);
      }

    } catch (error) {
      console.error('❌ Error cargando datos del dashboard:', error);
      setUpcomingSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la reserva de una clase
   */
  const handleReserve = (scheduleId) => {
    navigate(`/schedule?id=${scheduleId}`);
  };

  /**
   * Formatea la fecha
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  /**
   * Agrupa horarios por fecha
   */
  const groupSchedulesByDate = () => {
    const grouped = {};
    upcomingSchedules.forEach(schedule => {
      const date = schedule.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });
    return grouped;
  };

  const groupedSchedules = groupSchedulesByDate();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-sage-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Welcome Header */}
          <div className="mb-8 bg-gradient-to-r from-sage-600 to-sage-700 rounded-2xl p-8 text-white shadow-xl">
            <h1 className="text-3xl font-bold mb-2">
              ¡Bienvenido, {user?.full_name || 'Cliente Demo'}!
            </h1>
            <p className="text-sage-100">
              Panel de Cliente REFORMERY
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-2 flex flex-wrap gap-2">
            {[
              { id: 'reservar', label: 'Reservar', icon: Calendar },
              { id: 'mis-reservas', label: 'Mis Reservas', icon: CheckCircle },
              { id: 'paquetes', label: 'Paquetes', icon: Package },
              { id: 'historial', label: 'Historial', icon: History },
              { id: 'perfil', label: 'Perfil', icon: UserIcon },
              { id: 'mi-qr', label: 'Mi QR', icon: CreditCard },
              { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
              { id: 'encuesta', label: 'Encuesta', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-sage-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-sage-50 hover:text-sage-700'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {activeTab === 'reservar' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Calendar size={28} className="text-sage-600" />
                  Clases Disponibles (Próximos 7 días)
                </h2>

                {loading ? (
                  // Loading skeleton
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-24 bg-gray-200 rounded-xl"></div>
                          <div className="h-24 bg-gray-200 rounded-xl"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : Object.keys(groupedSchedules).length === 0 ? (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-12 text-center">
                    <Calendar size={64} className="mx-auto text-amber-500 mb-4" />
                    <p className="text-amber-900 font-bold text-xl mb-2">
                      No hay clases disponibles
                    </p>
                    <p className="text-amber-700 text-base mb-6">
                      Los horarios se actualizan automáticamente cuando el administrador los agrega.
                    </p>
                    <button
                      onClick={loadDashboardData}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
                    >
                      <Loader size={18} />
                      Recargar Horarios
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(groupedSchedules).map(([date, schedules]) => (
                      <div key={date}>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3 pb-2 border-b-2 border-sage-200">
                          <div className="w-3 h-3 bg-sage-600 rounded-full"></div>
                          {formatDate(date)}
                        </h3>
                        <div className="space-y-4">
                          {schedules.map((schedule) => (
                            <div
                              key={schedule.id}
                              className="bg-gradient-to-r from-sage-50 via-white to-sage-50 border-2 border-sage-200 rounded-xl p-5 hover:shadow-xl hover:border-sage-400 transition-all duration-300"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                
                                {/* Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-4 mb-3">
                                    <div className="w-14 h-14 bg-gradient-to-br from-sage-500 to-sage-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                      {schedule.time.split(':')[0]}:{schedule.time.split(':')[1]}
                                    </div>
                                    <div>
                                      <h4 className="text-xl font-bold text-gray-800">
                                        {schedule.class_name}
                                      </h4>
                                      <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <Clock size={16} />
                                        {schedule.time} - {schedule.duration} min
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-sage-200">
                                      <Users size={16} className="text-sage-600" />
                                      <span className="font-semibold">{schedule.available || 0} lugares disponibles</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-sage-200">
                                      <UserIcon size={16} className="text-sage-600" />
                                      <span>{schedule.instructor_name || 'Instructor'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-sage-200">
                                      <MapPin size={16} className="text-sage-600" />
                                      <span>Sala {schedule.room || '1'}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Action */}
                                <button
                                  onClick={() => handleReserve(schedule.id)}
                                  disabled={schedule.available === 0}
                                  className={`px-8 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg flex items-center justify-center gap-2 ${
                                    schedule.available > 0
                                      ? 'bg-sage-600 hover:bg-sage-700 text-white hover:shadow-2xl'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                >
                                  {schedule.available > 0 ? (
                                    <>
                                      Reservar
                                      <ArrowRight size={20} />
                                    </>
                                  ) : (
                                    'Clase llena'
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Otros tabs */}
          {activeTab === 'mis-reservas' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CheckCircle size={28} className="text-sage-600" />
                Mis Reservas
              </h2>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
                <CheckCircle size={48} className="mx-auto text-blue-500 mb-3" />
                <p className="text-blue-800 font-semibold">Próximamente...</p>
              </div>
            </div>
          )}

          {activeTab === 'paquetes' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package size={28} className="text-sage-600" />
                Mis Paquetes
              </h2>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-8 text-center">
                <Package size={48} className="mx-auto text-purple-500 mb-3" />
                <p className="text-purple-800 font-semibold">Próximamente...</p>
              </div>
            </div>
          )}

          {activeTab === 'historial' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <History size={28} className="text-sage-600" />
                Historial
              </h2>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 text-center">
                <History size={48} className="mx-auto text-gray-500 mb-3" />
                <p className="text-gray-700 font-semibold">Próximamente...</p>
              </div>
            </div>
          )}

          {activeTab === 'perfil' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <UserIcon size={28} className="text-sage-600" />
                Mi Perfil
              </h2>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                <UserIcon size={48} className="mx-auto text-green-500 mb-3" />
                <p className="text-green-800 font-semibold">Próximamente...</p>
              </div>
            </div>
          )}

          {activeTab === 'mi-qr' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard size={28} className="text-sage-600" />
                Mi QR
              </h2>
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-8 text-center">
                <CreditCard size={48} className="mx-auto text-indigo-500 mb-3" />
                <p className="text-indigo-800 font-semibold">Próximamente...</p>
              </div>
            </div>
          )}

          {activeTab === 'notificaciones' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Bell size={28} className="text-sage-600" />
                Notificaciones
              </h2>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
                <Bell size={48} className="mx-auto text-yellow-500 mb-3" />
                <p className="text-yellow-800 font-semibold">Próximamente...</p>
              </div>
            </div>
          )}

          {activeTab === 'encuesta' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText size={28} className="text-sage-600" />
                Encuesta
              </h2>
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-8 text-center">
                <FileText size={48} className="mx-auto text-pink-500 mb-3" />
                <p className="text-pink-800 font-semibold">Próximamente...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;