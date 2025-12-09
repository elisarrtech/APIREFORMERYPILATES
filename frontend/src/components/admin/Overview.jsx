import PropTypes from 'prop-types';

/**
 * Overview Component - Resumen General del Dashboard
 * Muestra estadísticas clave del sistema REFORMERY
 * 
 * @version 3.0.0 - MEJORADO CON dashboardData
 * @author elisarrtech
 * @date 2025-10-28
 */
const Overview = ({ statistics, dashboardData, onCreateUser, onCreatePackage, onCreateClass, onRefresh }) => {
  
  // ✅ MEJORADO: Usar dashboardData si está disponible, sino usar statistics
  const stats = {
    totalUsers: dashboardData?.totalUsers || statistics?.total_users || 0,
    totalClients: statistics?.total_clients || 0,
    totalInstructors: statistics?.total_instructors || 0,
    totalAdmins: statistics?.total_admins || 0,
    activePackages: dashboardData?.activePackages || statistics?.active_packages || 0,
    scheduledClasses: dashboardData?.scheduledClasses || statistics?.scheduled_classes || 0,
    activeSchedules: dashboardData?.activeSchedules || statistics?.active_schedules || 0,
    totalReservations: dashboardData?.totalReservations || statistics?.total_reservations || 0,
    totalRevenue: dashboardData?.totalRevenue || statistics?.total_revenue || 0
  };

  return (
    <div className="space-y-8">
      {/* Header con botón de refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Resumen General
          </h2>
          <p className="text-gray-600 mt-2">Vista general del sistema REFORMERY</p>
        </div>
        
        {/* Botón Actualizar */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            title="Actualizar estadísticas"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Usuarios */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-30 p-3 rounded-xl">
              <span className="text-4xl">👥</span>
            </div>
          </div>
          <h3 className="text-white text-opacity-90 font-medium mb-2">Total Usuarios</h3>
          <p className="text-5xl font-black text-white">{stats.totalUsers}</p>
          <p className="text-blue-100 text-sm mt-2">Registrados en el sistema</p>
          <div className="mt-4 flex items-center gap-2 text-white text-sm">
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
              👤 Clientes: {stats.totalClients}
            </span>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
              🏋️ Instructores: {stats.totalInstructors}
            </span>
          </div>
        </div>

        {/* Paquetes Activos */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-30 p-3 rounded-xl">
              <span className="text-4xl">📦</span>
            </div>
          </div>
          <h3 className="text-white text-opacity-90 font-medium mb-2">Paquetes Activos</h3>
          <p className="text-5xl font-black text-white">{stats.activePackages}</p>
          <p className="text-purple-100 text-sm mt-2">Disponibles para compra</p>
          <button
            onClick={onCreatePackage}
            className="mt-4 w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 rounded-lg font-bold transition-all"
          >
            + Crear Paquete
          </button>
        </div>

        {/* Clases Programadas */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-30 p-3 rounded-xl">
              <span className="text-4xl">🏋️</span>
            </div>
          </div>
          <h3 className="text-white text-opacity-90 font-medium mb-2">Clases en Catálogo</h3>
          <p className="text-5xl font-black text-white">{stats.scheduledClasses}</p>
          <p className="text-green-100 text-sm mt-2">Disponibles en el sistema</p>
          <button
            onClick={onCreateClass}
            className="mt-4 w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 rounded-lg font-bold transition-all"
          >
            + Crear Clase
          </button>
        </div>

        {/* Horarios Activos */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-30 p-3 rounded-xl">
              <span className="text-4xl">📅</span>
            </div>
          </div>
          <h3 className="text-white text-opacity-90 font-medium mb-2">Horarios Activos</h3>
          <p className="text-5xl font-black text-white">{stats.activeSchedules}</p>
          <p className="text-orange-100 text-sm mt-2">Programados este mes</p>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Reservas Totales */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-4 rounded-xl">
              <span className="text-5xl">📋</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-gray-900 mb-1">{stats.totalReservations}</h3>
              <p className="text-gray-600 font-medium">Reservas Totales</p>
            </div>
          </div>
          <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.min((stats.totalReservations / 100) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Sistema de reservas activo</p>
        </div>

        {/* Ingresos Totales */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-100">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-xl">
              <span className="text-5xl">💰</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-gray-900 mb-1">
                ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-gray-600 font-medium">Ingresos Totales Estimados</p>
            </div>
          </div>
          <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: '85%' }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Basado en paquetes vendidos</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-xl p-6 border-2 border-purple-200">
        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onCreateUser}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-2xl">👤</span>
            Crear Usuario
          </button>
          <button
            onClick={onCreatePackage}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📦</span>
            Crear Paquete
          </button>
          <button
            onClick={onCreateClass}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-2xl">🏋️</span>
            Crear Clase
          </button>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">ℹ️</span>
          Información del Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
            <span className="text-3xl">✅</span>
            <div>
              <p className="font-black text-green-900">Estado del Sistema</p>
              <p className="text-green-700 font-medium">Activo y Operando</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
            <span className="text-3xl">🔒</span>
            <div>
              <p className="font-black text-purple-900">Seguridad</p>
              <p className="text-purple-700 font-medium">Protegido con JWT</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <span className="text-3xl">📡</span>
            <div>
              <p className="font-black text-blue-900">API Status</p>
              <p className="text-blue-700 font-medium">Conectado</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
            <span className="text-3xl">🗄️</span>
            <div>
              <p className="font-black text-orange-900">Base de Datos</p>
              <p className="text-orange-700 font-medium">PostgreSQL/SQLite</p>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 rounded-xl p-4 border-2 border-gray-300">
          <details className="cursor-pointer">
            <summary className="font-bold text-gray-700">🔍 Debug Info (Development Only)</summary>
            <pre className="mt-2 text-xs overflow-auto bg-gray-800 text-green-400 p-4 rounded">
              {JSON.stringify({ statistics, dashboardData, stats }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

// PropTypes para validación
Overview.propTypes = {
  statistics: PropTypes.object,
  dashboardData: PropTypes.shape({
    totalUsers: PropTypes.number,
    activePackages: PropTypes.number,
    scheduledClasses: PropTypes.number,
    activeSchedules: PropTypes.number,
    totalReservations: PropTypes.number,
    totalRevenue: PropTypes.number
  }),
  onCreateUser: PropTypes.func,
  onCreatePackage: PropTypes.func,
  onCreateClass: PropTypes.func,
  onRefresh: PropTypes.func
};

export default Overview;