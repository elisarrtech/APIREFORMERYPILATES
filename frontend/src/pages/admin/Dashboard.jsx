import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import adminService from '../../services/adminService';
import { 
  Users, 
  Package, 
  Dumbbell, 
  Calendar, 
  TrendingUp,
  RefreshCw,
  Activity
} from 'lucide-react';

/**
 * Admin Dashboard - Reformery Pilates Studio
 * @version 3.0.0 - SAGE COLORS
 * @author @elisarrtech
 */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Usuarios',
      value: stats?.users?.total || 0,
      subtitle: `${stats?.users?.active || 0} activos`,
      icon: Users,
      gradient: 'from-sage-500 to-sage-600',
      bgGradient: 'from-white to-sage-50',
      iconBg: 'bg-sage-100',
      iconColor: 'text-sage-600',
    },
    {
      title: 'Paquetes',
      value: stats?.packages?.total || 0,
      subtitle: `${stats?.packages?.active || 0} activos`,
      icon: Package,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-white to-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Clases',
      value: stats?.classes?.total || 0,
      subtitle: `${stats?.classes?.active || 0} activas`,
      icon: Dumbbell,
      gradient: 'from-teal-500 to-teal-600',
      bgGradient: 'from-white to-teal-50',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
    },
    {
      title: 'Horarios',
      value: stats?.schedules?.total || 0,
      subtitle: `${stats?.schedules?.scheduled || 0} programados`,
      icon: Calendar,
      gradient: 'from-cyan-500 to-cyan-600',
      bgGradient: 'from-white to-cyan-50',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                🏋️
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Activity size={16} className="text-sage-600" />
                  <span className="font-semibold text-sage-600">REFORMERY</span> - Sistema Activo
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={loadStatistics}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-xl uppercase tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          Bienvenido,{' '}
          <span className="font-semibold text-sage-700">Admin Reformery</span>
          <br />
          {new Date().toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))
        ) : (
          statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-${card.gradient.split('-')[1]}-500 transform hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${card.iconBg} rounded-xl flex items-center justify-center ${card.iconColor} shadow-md`}>
                    <Icon size={28} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      {card.title}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-4xl font-bold text-gray-800 mb-1">
                    {card.value}
                  </p>
                  <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                    <TrendingUp size={14} className={card.iconColor} />
                    {card.subtitle}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity size={24} className="text-sage-600" />
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-br from-sage-50 to-sage-100 hover:from-sage-100 hover:to-sage-200 rounded-xl text-left transition-all duration-200 group border border-sage-200">
            <Users size={24} className="text-sage-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-gray-800">Gestionar Usuarios</p>
            <p className="text-sm text-gray-600">Ver y editar usuarios</p>
          </button>

          <button className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-xl text-left transition-all duration-200 group border border-emerald-200">
            <Package size={24} className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-gray-800">Crear Paquete</p>
            <p className="text-sm text-gray-600">Nuevo paquete de clases</p>
          </button>

          <button className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 rounded-xl text-left transition-all duration-200 group border border-teal-200">
            <Dumbbell size={24} className="text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-gray-800">Agregar Clase</p>
            <p className="text-sm text-gray-600">Nueva clase de pilates</p>
          </button>

          <button className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 rounded-xl text-left transition-all duration-200 group border border-cyan-200">
            <Calendar size={24} className="text-cyan-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-gray-800">Programar Horario</p>
            <p className="text-sm text-gray-600">Nuevo horario de clase</p>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;