import { useState, useEffect } from 'react';
import { useAdminData } from '../../hooks/useAdminData';
import { useModal } from '../../hooks/useModal';
import { useAuth } from '@context/AuthContext';
import adminService from '../../services/adminService';
import { TABS } from '../../utils/constants';
import api from '../../services/api';

// Layout
import Navbar from '../../components/layout/Navbar';

// Components
import Overview from '../../components/admin/Overview';
import UsersManagement from '../../components/admin/UsersManagement';
import PackagesManagement from '../../components/admin/PackagesManagement';
import SchedulesManagement from '../../components/admin/SchedulesManagement';
import ClassesManagement from '../../components/admin/ClassesManagement';
import AdvancedStatistics from '../../components/admin/AdvancedStatistics';
import NotificationsManagement from '../../components/admin/NotificationsManagement';

// Modals
import PackageModal from '../../components/admin/modals/PackageModal';
import UserModal from '../../components/admin/modals/UserModal';
import ScheduleModal from '../../components/admin/modals/ScheduleModal';
import ClassModal from '../../components/admin/modals/ClassModal';

// Icons
import { 
  BarChart3, 
  Users, 
  Package, 
  Calendar,
  Clock,
  Activity,
  Bell
} from 'lucide-react';

/**
 * AdminDashboard - Panel de Administración REFORMERY
 * Arquitectura empresarial con separación de responsabilidades
 * @version 3.0.0 - DISEÑO SAGE MEJORADO + LÓGICA COMPLETA + Bonos Regalo
 * @author @elisarrtech
 */
const AdminDashboard = () => {
  const { user } = useAuth();

  // State Management
  const {
    stats,
    users: initialUsers,
    instructors,
    packages,
    classes,
    schedules,
    loading,
    error,
    refetch
  } = useAdminData();

  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    setUsers(initialUsers); // Sincroniza cuando cambian los datos globales
  }, [initialUsers]);

  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activePackages: 0,
    scheduledClasses: 0,
    activeSchedules: 0,
    totalReservations: 0,
    totalRevenue: 0
  });

  // Modals
  const packageModal = useModal();
  const userModal = useModal();
  const scheduleModal = useModal();
  const classModal = useModal();

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Notification System
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  /**
   * Cargar estadísticas del dashboard
   */
  const loadDashboardData = async () => {
    try {
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        const serverStats = response.data.data;
        setDashboardData({
          totalUsers: serverStats.users?.total || 0,
          activePackages: serverStats.packages?.active || 0,
          scheduledClasses: serverStats.classes?.total || 0,
          activeSchedules: serverStats.schedules?.active_this_month || 0,
          totalReservations: serverStats.reservations?.total || 0,
          totalRevenue: serverStats.revenue?.total || 0
        });
      }
    } catch (error) {
      // Puedes mostrar una notificación de error si lo requieres
    }
  };

  // ==================== PACKAGE HANDLERS ====================
  const handleCreatePackage = async (packageData) => {
    try {
      await adminService.createPackage(packageData);
      showNotification('success', '✅ Paquete creado exitosamente');
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al crear paquete');
      throw error;
    }
  };

  const handleEditPackage = (pkg) => {
    packageModal.open(pkg);
  };

  const handleUpdatePackage = async (packageData) => {
    try {
      await adminService.updatePackage(packageModal.data.id, packageData);
      showNotification('success', '✅ Paquete actualizado exitosamente');
      packageModal.close();
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al actualizar paquete');
      throw error;
    }
  };

  const handleTogglePackageStatus = async (pkg) => {
    try {
      await adminService.togglePackageStatus(pkg.id, pkg.active);
      showNotification('success', `✅ Paquete ${pkg.active ? 'desactivado' : 'activado'} exitosamente`);
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al cambiar estado del paquete');
    }
  };

  // ==================== USER HANDLERS ====================
  const handleCreateUser = async (userData) => {
    try {
      await adminService.createUser(userData);
      showNotification('success', '✅ Usuario creado exitosamente');
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al crear usuario');
      throw error;
    }
  };

  const handleEditUser = (user) => {
    userModal.open(user);
  };

  const handleUpdateUser = async (userData) => {
    try {
      await adminService.updateUser(userModal.data.id, userData);
      showNotification('success', '✅ Usuario actualizado exitosamente');
      userModal.close();
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al actualizar usuario');
      throw error;
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      await adminService.toggleUserStatus(user.id, user.active);
      showNotification('success', `✅ Usuario ${user.active ? 'desactivado' : 'activado'} exitosamente`);
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al cambiar estado del usuario');
    }
  };

  // ==================== ADVANCED USER FILTERS & BONOS ====================
  const handleApplyFilters = async (filters) => {
    const filteredUsers = await adminService.getUsers(filters);
    setUsers(filteredUsers); // Esto sí actualiza la tabla
  };

  // Agregar clase extra (bono/regalo, cumpleaños)
  const handleAddExtraClass = async (userPackageId, amount, reason) => {
    await adminService.addExtraClasses(userPackageId, amount, reason);
    refetch();
    showNotification('success', 'Clase de regalo agregada exitosamente');
  };

  // ==================== CLASS HANDLERS ====================
  const handleCreateClass = async (classData) => {
    try {
      await adminService.createClass(classData);
      showNotification('success', '✅ Clase creada exitosamente');
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al crear clase');
      throw error;
    }
  };

  const handleEditClass = (classItem) => {
    classModal.open(classItem);
  };

  const handleUpdateClass = async (classData) => {
    try {
      await adminService.updateClass(classModal.data.id, classData);
      showNotification('success', '✅ Clase actualizada exitosamente');
      classModal.close();
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al actualizar clase');
      throw error;
    }
  };

  const handleToggleClassStatus = async (classItem) => {
    try {
      await adminService.toggleClassStatus(classItem.id, classItem.active);
      showNotification('success', `✅ Clase ${classItem.active ? 'desactivada' : 'activada'} exitosamente`);
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al cambiar estado de la clase');
    }
  };

  // ==================== SCHEDULE HANDLERS ====================
  const handleCreateSchedule = async (scheduleData) => {
    try {
      await adminService.createSchedule(scheduleData);
      showNotification('success', '✅ Horario creado exitosamente');
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al crear horario');
      throw error;
    }
  };

  const handleEditSchedule = (schedule) => {
    scheduleModal.open(schedule);
  };

  const handleUpdateSchedule = async (scheduleData) => {
    try {
      await adminService.updateSchedule(scheduleModal.data.id, scheduleData);
      showNotification('success', '✅ Horario actualizado exitosamente');
      scheduleModal.close();
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al actualizar horario');
      throw error;
    }
  };

  const handleCancelSchedule = async (schedule) => {
    try {
      await adminService.cancelSchedule(schedule.id);
      showNotification('success', '✅ Horario cancelado exitosamente');
      refetch();
      loadDashboardData();
    } catch (error) {
      showNotification('error', error.response?.data?.message || '❌ Error al cancelar horario');
    }
  };

  // Loading State
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-sage-50">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-sage-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-sage-100"></div>
              </div>
            </div>
            <p className="mt-8 text-xl text-gray-700 font-bold">Cargando Dashboard...</p>
            <p className="mt-2 text-sm text-gray-500">Obteniendo datos del sistema</p>
          </div>
        </div>
      </>
    );
  }

  // Error State
  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-4 border-red-500">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">Error al Cargar Dashboard</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                🔄 Reintentar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-sage-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header - DISEÑO SAGE */}
        <div className="mb-8 bg-gradient-to-r from-sage-600 to-sage-700 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Panel de Administración
              </h1>
              <p className="text-sage-100 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                REFORMERY - Sistema Activo
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-sage-200">Bienvenido</p>
              <p className="text-lg font-bold">{user?.full_name}</p>
              <p className="text-xs text-sage-300 mt-1">
                {new Date().toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notification.message && (
          <div className={`mb-6 px-6 py-4 rounded-xl shadow-lg border-l-4 animate-slideUp ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notification.type === 'success' ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <p className="font-bold">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification({ type: '', message: '' })}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Tabs Navigation - DISEÑO SAGE */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-2 flex flex-wrap gap-2">
          {[
            { key: TABS.OVERVIEW, label: 'Resumen', icon: BarChart3 },
            { key: TABS.USERS, label: 'Usuarios', icon: Users },
            { key: TABS.PACKAGES, label: 'Paquetes', icon: Package },
            { key: TABS.CLASSES, label: 'Clases', icon: Calendar },
            { key: TABS.SCHEDULES, label: 'Horarios', icon: Clock },
            { key: TABS.STATISTICS, label: 'Estadísticas', icon: Activity },
            { key: TABS.NOTIFICATIONS, label: 'Notificaciones', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.key
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

        {/* Tab Content */}
        {activeTab === TABS.OVERVIEW && (
          <Overview
            statistics={stats}
            dashboardData={dashboardData}
            onCreateUser={() => userModal.open()}
            onCreatePackage={() => packageModal.open()}
            onCreateClass={() => classModal.open()}
            onRefresh={loadDashboardData}
          />
        )}

        {activeTab === TABS.USERS && (
          <UsersManagement
            users={users}
            onCreateUser={() => userModal.open()}
            onEditUser={handleEditUser}
            onToggleStatus={handleToggleUserStatus}
            onApplyFilters={handleApplyFilters}
            onAddExtraClass={handleAddExtraClass}
          />
        )}

        {activeTab === TABS.PACKAGES && (
          <PackagesManagement
            packages={packages}
            onCreatePackage={() => packageModal.open()}
            onEditPackage={handleEditPackage}
            onToggleStatus={handleTogglePackageStatus}
          />
        )}

        {activeTab === TABS.CLASSES && (
          <ClassesManagement
            classes={classes}
            onCreateClass={() => classModal.open()}
            onEditClass={handleEditClass}
            onToggleStatus={handleToggleClassStatus}
          />
        )}

        {activeTab === TABS.SCHEDULES && (
          <SchedulesManagement
            schedules={schedules}
            onCreateSchedule={() => scheduleModal.open()}
            onEditSchedule={handleEditSchedule}
            onCancelSchedule={handleCancelSchedule}
          />
        )}

        {activeTab === TABS.STATISTICS && <AdvancedStatistics />}

        {activeTab === TABS.NOTIFICATIONS && <NotificationsManagement />}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>REFORMERY Admin Dashboard v3.0.0 | Desarrollado por @elisarrtech</p>
          <p className="mt-1">© 2025 - Todos los derechos reservados</p>
        </div>
      </div>

      {/* Modals */}
      <PackageModal
        isOpen={packageModal.isOpen}
        onClose={packageModal.close}
        onSubmit={packageModal.data ? handleUpdatePackage : handleCreatePackage}
        packageData={packageModal.data}
        isEdit={!!packageModal.data}
      />

      <UserModal
        isOpen={userModal.isOpen}
        onClose={userModal.close}
        onSubmit={userModal.data ? handleUpdateUser : handleCreateUser}
        userData={userModal.data}
        isEdit={!!userModal.data}
      />

      <ClassModal
        isOpen={classModal.isOpen}
        onClose={classModal.close}
        onSubmit={classModal.data ? handleUpdateClass : handleCreateClass}
        classData={classModal.data}
        isEdit={!!classModal.data}
      />

      <ScheduleModal
        isOpen={scheduleModal.isOpen}
        onClose={scheduleModal.close}
        onSubmit={scheduleModal.data ? handleUpdateSchedule : handleCreateSchedule}
        scheduleData={scheduleModal.data}
        isEdit={!!scheduleModal.data}
        classes={classes}
        instructors={instructors}
      />
    </div>
  );
};

export default AdminDashboard;