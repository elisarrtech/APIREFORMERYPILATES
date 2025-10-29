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
  Loader,
  Edit,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import QRCode from 'react-qr-code';

/**
 * Client Dashboard - COMPLETO CON TODA LA LÓGICA
 * @version 3.0.0 - ÉLITE MUNDIAL COMPLETO
 * @author @elisarrtech
 */
const ClientDashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [myPackages, setMyPackages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservar');
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    setProfileForm({
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  }, [user]);

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

      // Cargar notificaciones
      try {
        const notificationsResponse = await api.get('/notifications/my-notifications');
        setNotifications(notificationsResponse.data.data || []);
      } catch (error) {
        console.log('No se pudieron cargar las notificaciones');
        setNotifications([]);
      }

    } catch (error) {
      console.error('❌ Error cargando datos del dashboard:', error);
      setUpcomingSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la actualización del perfil
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/profile', profileForm);
      if (response.data.success) {
        updateUser(response.data.data);
        setIsEditingProfile(false);
        alert('✅ Perfil actualizado correctamente');
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      alert('❌ Error al actualizar perfil');
    }
  };

  /**
   * Cancela una reserva
   */
  const handleCancelReservation = async (reservationId) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;
    
    try {
      await api.delete(`/reservations/${reservationId}`);
      alert('✅ Reserva cancelada');
      loadDashboardData();
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      alert('❌ Error al cancelar reserva');
    }
  };

  /**
   * Maneja la reserva de una clase
   */
  const handleReserve = (scheduleId) => {
    navigate(`/schedules`);
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
      year: 'numeric',
    });
  };

  /**
   * Formatea la fecha corta
   */
  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
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
              ¡Bienvenido, {user?.full_name || 'Cliente'}!
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

          {/* TAB: RESERVAR */}
          {activeTab === 'reservar' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={28} className="text-sage-600" />
                    Clases Disponibles (Próximos 7 días)
                  </h2>
                  <button
                    onClick={() => navigate('/schedules')}
                    className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    Ver Todos los Horarios
                    <ArrowRight size={18} />
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                        <div className="h-24 bg-gray-200 rounded-xl"></div>
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
                    {Object.entries(groupedSchedules).slice(0, 3).map(([date, schedules]) => (
                      <div key={date}>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3 pb-2 border-b-2 border-sage-200">
                          <div className="w-3 h-3 bg-sage-600 rounded-full"></div>
                          {formatDate(date)}
                        </h3>
                        <div className="space-y-4">
                          {schedules.slice(0, 2).map((schedule) => (
                            <div
                              key={schedule.id}
                              className="bg-gradient-to-r from-sage-50 via-white to-sage-50 border-2 border-sage-200 rounded-xl p-5 hover:shadow-xl hover:border-sage-400 transition-all duration-300"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                                      <span className="font-semibold">{schedule.available || 0} disponibles</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-sage-200">
                                      <UserIcon size={16} className="text-sage-600" />
                                      <span>{schedule.instructor_name || 'Instructor'}</span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleReserve(schedule.id)}
                                  disabled={schedule.available === 0}
                                  className={`px-8 py-4 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-[1.05] shadow-lg flex items-center justify-center gap-2 ${
                                    schedule.available > 0
                                      ? 'bg-sage-600 hover:bg-sage-700 text-white'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                >
                                  {schedule.available > 0 ? 'Reservar' : 'Llena'}
                                  {schedule.available > 0 && <ArrowRight size={20} />}
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

          {/* TAB: MIS RESERVAS */}
          {activeTab === 'mis-reservas' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CheckCircle size={28} className="text-sage-600" />
                Mis Reservas
              </h2>
              {myReservations.length === 0 ? (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-12 text-center">
                  <CheckCircle size={64} className="mx-auto text-blue-500 mb-4" />
                  <p className="text-blue-900 font-bold text-xl mb-2">No tienes reservas activas</p>
                  <p className="text-blue-700 mb-6">Reserva tu primera clase ahora</p>
                  <button
                    onClick={() => setActiveTab('reservar')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Ver Clases Disponibles
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="bg-gradient-to-r from-blue-50 to-white border-2 border-blue-200 rounded-xl p-5"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800 mb-2">
                            {reservation.class_name}
                          </h4>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-blue-600" />
                              <span>{formatDate(reservation.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-blue-600" />
                              <span>{reservation.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <UserIcon size={16} className="text-blue-600" />
                              <span>{reservation.instructor_name}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                          <X size={18} />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PAQUETES */}
          {activeTab === 'paquetes' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package size={28} className="text-sage-600" />
                Mis Paquetes
              </h2>
              {myPackages.length === 0 ? (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-12 text-center">
                  <Package size={64} className="mx-auto text-purple-500 mb-4" />
                  <p className="text-purple-900 font-bold text-xl mb-2">No tienes paquetes activos</p>
                  <p className="text-purple-700 mb-6">Compra un paquete para comenzar</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    Ver Paquetes Disponibles
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {myPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{pkg.package_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          pkg.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {pkg.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="space-y-2 text-gray-700">
                        <div className="flex justify-between">
                          <span>Clases restantes:</span>
                          <span className="font-bold text-purple-700">{pkg.remaining_classes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vencimiento:</span>
                          <span className="font-semibold">{formatDateShort(pkg.expiry_date)}</span>
                        </div>
                      </div>
                      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(pkg.remaining_classes / pkg.total_classes) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: HISTORIAL */}
          {activeTab === 'historial' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <History size={28} className="text-sage-600" />
                Historial de Clases
              </h2>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-12 text-center">
                <History size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-semibold">Tu historial de clases aparecerá aquí</p>
              </div>
            </div>
          )}

          {/* TAB: PERFIL */}
          {activeTab === 'perfil' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <UserIcon size={28} className="text-sage-600" />
                  Mi Perfil
                </h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      Guardar Cambios
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-sage-50 border-2 border-sage-200 rounded-xl p-4">
                    <label className="text-sm font-semibold text-sage-700 mb-1 block">Nombre Completo</label>
                    <p className="text-lg text-gray-800">{user?.full_name}</p>
                  </div>
                  <div className="bg-sage-50 border-2 border-sage-200 rounded-xl p-4">
                    <label className="text-sm font-semibold text-sage-700 mb-1 block">Email</label>
                    <p className="text-lg text-gray-800">{user?.email}</p>
                  </div>
                  <div className="bg-sage-50 border-2 border-sage-200 rounded-xl p-4">
                    <label className="text-sm font-semibold text-sage-700 mb-1 block">Teléfono</label>
                    <p className="text-lg text-gray-800">{user?.phone || 'No especificado'}</p>
                  </div>
                  <div className="bg-sage-50 border-2 border-sage-200 rounded-xl p-4">
                    <label className="text-sm font-semibold text-sage-700 mb-1 block">Rol</label>
                    <p className="text-lg text-gray-800 capitalize">{user?.role}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: MI QR */}
          {activeTab === 'mi-qr' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard size={28} className="text-sage-600" />
                Mi Código QR
              </h2>
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-br from-sage-50 to-white border-2 border-sage-200 rounded-2xl p-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg inline-block mx-auto">
                    <QRCode value={user?.id?.toString() || 'user-id'} size={256} level="H" />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-gray-700 font-semibold mb-2">{user?.full_name}</p>
                    <p className="text-sm text-gray-600">ID: {user?.id}</p>
                  </div>
                </div>
                <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Presenta este código QR al instructor para registrar tu asistencia a las clases.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICACIONES */}
          {activeTab === 'notificaciones' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Bell size={28} className="text-sage-600" />
                Notificaciones
              </h2>
              {notifications.length === 0 ? (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-12 text-center">
                  <Bell size={64} className="mx-auto text-yellow-500 mb-4" />
                  <p className="text-yellow-900 font-bold text-xl">No tienes notificaciones</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="bg-gradient-to-r from-yellow-50 to-white border-2 border-yellow-200 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Bell size={20} className="text-yellow-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{notification.title}</h4>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{formatDate(notification.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ENCUESTA */}
          {activeTab === 'encuesta' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText size={28} className="text-sage-600" />
                Encuesta de Satisfacción
              </h2>
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-12 text-center">
                <FileText size={64} className="mx-auto text-pink-500 mb-4" />
                <p className="text-pink-900 font-bold text-xl mb-2">Encuesta de Satisfacción</p>
                <p className="text-pink-700 mb-6">Ayúdanos a mejorar tu experiencia</p>
                <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors duration-200">
                  Responder Encuesta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;