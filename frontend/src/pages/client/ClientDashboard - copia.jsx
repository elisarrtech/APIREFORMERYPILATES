import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';
import QRCode from 'qrcode';

/**
 * ClientDashboard - Panel Completo de Cliente
 * @version 3.0.0
 * @author @elisarrtech
 */
const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('reservar');
  const [schedules, setSchedules] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [myPackages, setMyPackages] = useState([]);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const TABS = {
    RESERVAR: 'reservar',
    MIS_RESERVAS: 'mis-reservas',
    PAQUETES: 'paquetes',
    PERFIL: 'perfil',
    QR_CODE: 'qr-code',
    HISTORIAL: 'historial',
    NOTIFICACIONES: 'notificaciones',
    ENCUESTA: 'encuesta'
  };

  useEffect(() => {
    loadData();
    generateQRCode();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [schedulesRes, reservationsRes, packagesRes, notificationsRes, paymentsRes] = await Promise.all([
        api.get('/schedules/available'),
        api.get('/reservations/my-reservations'),
        api.get('/packages'),
        api.get('/reservations/notifications'),
        api.get('/payments/my-payments').catch(() => ({ data: { data: [] } }))
      ]);

      setSchedules(schedulesRes.data.data || []);
      setMyReservations(reservationsRes.data.data || []);
      setAvailablePackages(packagesRes.data.data || []);
      setNotifications(notificationsRes.data.data || []);
      setPaymentHistory(paymentsRes.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const qrData = JSON.stringify({
        user_id: user?.id,
        email: user?.email,
        full_name: user?.full_name,
        role: user?.role,
        timestamp: new Date().toISOString()
      });
      const url = await QRCode.toDataURL(qrData, { width: 400, margin: 2 });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generando QR:', error);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `reformery-qr-${user?.full_name?.replace(/\s/g, '_')}.png`;
    link.click();
  };

  const handleReserve = async (scheduleId) => {
    try {
      const response = await api.post('/reservations/create', { schedule_id: scheduleId });
      if (response.data.success) {
        alert('✅ ' + response.data.message);
        loadData();
      } else {
        alert('❌ ' + response.data.message);
      }
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;
    try {
      const response = await api.put(`/reservations/${reservationId}/cancel`);
      if (response.data.success) {
        alert('✅ ' + response.data.message);
        loadData();
      } else {
        alert('❌ ' + response.data.message);
      }
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data.success) {
        alert('✅ Perfil actualizado exitosamente');
      }
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handlePurchasePackage = async (packageId) => {
    if (!confirm('¿Deseas comprar este paquete?')) return;
    try {
      const response = await api.post('/packages/purchase', { package_id: packageId });
      if (response.data.success) {
        alert('✅ Paquete comprado exitosamente');
        loadData();
      }
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-xl font-bold text-gray-700">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-8 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">¡Bienvenido, {user?.full_name}!</h1>
              <p className="text-lg text-purple-600 font-bold">Panel de Cliente REFORMERY</p>
            </div>
            <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold">
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <nav className="flex overflow-x-auto">
            {[
              { key: TABS.RESERVAR, label: 'Reservar', icon: '📅' },
              { key: TABS.MIS_RESERVAS, label: 'Mis Reservas', icon: '✅' },
              { key: TABS.PAQUETES, label: 'Paquetes', icon: '📦' },
              { key: TABS.PERFIL, label: 'Perfil', icon: '👤' },
              { key: TABS.QR_CODE, label: 'Mi QR', icon: '📱' },
              { key: TABS.HISTORIAL, label: 'Historial', icon: '📋' },
              { key: TABS.NOTIFICACIONES, label: 'Notificaciones', icon: '🔔' },
              { key: TABS.ENCUESTA, label: 'Encuesta', icon: '📝' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 flex items-center justify-center gap-2 py-4 px-6 font-bold transition-all border-b-4 ${
                  activeTab === tab.key
                    ? 'bg-purple-50 border-purple-600 text-purple-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* RESERVAR CLASES */}
          {activeTab === TABS.RESERVAR && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Clases Disponibles (Próximos 7 días)</h2>
              {schedules.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                  <p className="text-yellow-700 font-bold">No hay clases disponibles</p>
                </div>
              ) : (
                schedules.map(schedule => (
                  <div key={schedule.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">{schedule.class_name}</h3>
                        <p className="text-gray-600">📅 {schedule.date} - ⏰ {schedule.start_time}</p>
                        <p className="text-gray-600">👤 {schedule.instructor_name}</p>
                        <p className="text-gray-600">👥 Cupo: {schedule.current_capacity || 0}/{schedule.max_capacity}</p>
                      </div>
                      <button
                        onClick={() => handleReserve(schedule.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MIS RESERVAS */}
          {activeTab === TABS.MIS_RESERVAS && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Mis Reservas</h2>
              {myReservations.length === 0 ? (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                  <p className="text-blue-700 font-bold">No tienes reservas activas</p>
                </div>
              ) : (
                myReservations.map(reservation => (
                  <div key={reservation.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">{reservation.class_name}</h3>
                        <p className="text-gray-600">📅 {reservation.schedule_date} - ⏰ {reservation.schedule_time}</p>
                        <p className="text-gray-600">👤 {reservation.instructor_name}</p>
                        <p className="text-gray-600">Estado: <span className="font-bold text-green-600">{reservation.status}</span></p>
                      </div>
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* PAQUETES */}
          {activeTab === TABS.PAQUETES && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Paquetes Disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availablePackages.map(pkg => (
                  <div key={pkg.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-700"><strong>Clases:</strong> {pkg.classes_count}</p>
                      <p className="text-gray-700"><strong>Precio:</strong> ${pkg.price}</p>
                      <p className="text-gray-700"><strong>Validez:</strong> {pkg.validity_days} días</p>
                    </div>
                    <button
                      onClick={() => handlePurchasePackage(pkg.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold"
                    >
                      Comprar Paquete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PERFIL */}
          {activeTab === TABS.PERFIL && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Editar Perfil</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 rounded-lg"
                  />
                </div>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold">
                  Guardar Cambios
                </button>
              </form>
            </div>
          )}

          {/* QR CODE */}
          {activeTab === TABS.QR_CODE && (
            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Mi Código QR</h2>
              <p className="text-gray-600 mb-6">Usa este código para registrar tu asistencia</p>
              {qrCodeUrl && (
                <div className="inline-block">
                  <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-6 rounded-lg shadow-xl" />
                  <button
                    onClick={downloadQR}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar QR
                  </button>
                </div>
              )}
            </div>
          )}

          {/* HISTORIAL */}
          {activeTab === TABS.HISTORIAL && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Historial de Pagos y Reservas</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                <p className="text-blue-700 font-bold">Funcionalidad en desarrollo</p>
              </div>
            </div>
          )}

          {/* NOTIFICACIONES */}
          {activeTab === TABS.NOTIFICACIONES && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Configuración de Notificaciones</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 font-bold mb-4">Selecciona las notificaciones que deseas recibir:</p>
                <div className="space-y-3">
                  {['Recordatorios 24h antes', 'Recordatorios 1h antes', 'Nuevas clases', 'Ofertas especiales'].map((notif) => (
                    <label key={notif} className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5" />
                      <span className="text-gray-700">{notif}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ENCUESTA */}
          {activeTab === TABS.ENCUESTA && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">Encuesta de Satisfacción</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                <p className="text-yellow-700 font-bold">Encuesta mensual disponible próximamente</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;