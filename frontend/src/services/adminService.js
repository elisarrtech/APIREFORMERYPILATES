import api from './api';

const BASE_URL = '/admin';

/**
 * AdminService - Servicio profesional para operaciones administrativas
 * @class AdminService
 * @version 2.0.0
 * @author @elisarrtech
 */
class AdminService {
  // ==================== STATISTICS ====================
  async getStatistics() {
    try {
      console.log('📊 [AdminService] Obteniendo estadísticas...');
      const response = await api.get(`${BASE_URL}/statistics`);
      console.log('✅ [AdminService] Estadísticas obtenidas');
      return response.data.data;
    } catch (error) {
      console.error('❌ [AdminService] Error obteniendo estadísticas:', error);
      return this.getDefaultStats();
    }
  }

  // ==================== USERS ====================
  /**
   * Obtiene lista de usuarios con filtros avanzados
   * @param {Object} filters - { role, email, name, active, created_at }
   */
  async getUsers(filters = {}) {
    try {
      let params = [];
      const { role, email, name, active, created_at } = filters;
      if (role) params.push(`role=${role}`);
      if (email) params.push(`email=${encodeURIComponent(email)}`);
      if (name) params.push(`name=${encodeURIComponent(name)}`);
      if (active !== undefined && active !== '') params.push(`active=${active ? 1 : 0}`);
      if (created_at) params.push(`created_at=${created_at}`);
      const url = params.length > 0 ? `${BASE_URL}/users?${params.join('&')}` : `${BASE_URL}/users`;
      console.log(`👥 [AdminService] Obteniendo usuarios con filtros:`, filters);
      const response = await api.get(url);
      console.log(`✅ [AdminService] ${response.data.data?.length || 0} usuarios obtenidos`);
      return response.data.data || [];
    } catch (error) {
      console.error('❌ [AdminService] Error obteniendo usuarios:', error);
      return [];
    }
  }

  async createUser(userData) {
    console.log('➕ [AdminService] Creando usuario:', userData.email);
    const response = await api.post('/auth/register', userData);
    console.log('✅ [AdminService] Usuario creado exitosamente');
    return response.data;
  }

  async updateUser(userId, userData) {
    console.log(`✏️ [AdminService] Actualizando usuario ID: ${userId}`);
    const response = await api.put(`${BASE_URL}/users/${userId}`, userData);
    console.log('✅ [AdminService] Usuario actualizado exitosamente');
    return response.data;
  }

  async toggleUserStatus(userId, currentStatus) {
    console.log(`🔄 [AdminService] Cambiando estado usuario ID: ${userId}`);
    const response = await api.put(`${BASE_URL}/users/${userId}`, {
      active: !currentStatus
    });
    console.log('✅ [AdminService] Estado de usuario actualizado');
    return response.data;
  }

  // Agregar clase extra (bono/regalo/cumpleaños)
  async addExtraClasses(userPackageId, delta, reason = '') {
    console.log(`🎁 [AdminService] Agregando ${delta} clases extra al paquete ${userPackageId} por motivo: "${reason}"`);
    const response = await api.patch(`${BASE_URL}/user-packages/${userPackageId}/adjust-classes`, { delta, reason });
    console.log('✅ [AdminService] Clases extra agregadas');
    return response.data;
  }

  // ==================== CLASSES ====================
  async getClasses() {
    try {
      console.log('🏋️ [AdminService] Obteniendo clases...');
      const response = await api.get(`${BASE_URL}/classes`);
      console.log(`✅ [AdminService] ${response.data.data?.length || 0} clases obtenidas`);
      return response.data.data || [];
    } catch (error) {
      console.error('❌ [AdminService] Error obteniendo clases:', error);
      return [];
    }
  }

  async createClass(classData) {
    console.log('➕ [AdminService] Creando clase:', classData.name);
    const response = await api.post(`${BASE_URL}/classes`, classData);
    console.log('✅ [AdminService] Clase creada exitosamente');
    return response.data;
  }

  async updateClass(classId, classData) {
    console.log(`✏️ [AdminService] Actualizando clase ID: ${classId}`);
    const response = await api.put(`${BASE_URL}/classes/${classId}`, classData);
    console.log('✅ [AdminService] Clase actualizada exitosamente');
    return response.data;
  }

  async toggleClassStatus(classId, currentStatus) {
    console.log(`🔄 [AdminService] Cambiando estado clase ID: ${classId}`);
    const response = await api.put(`${BASE_URL}/classes/${classId}`, {
      active: !currentStatus
    });
    console.log('✅ [AdminService] Estado de clase actualizado');
    return response.data;
  }

  // ==================== PACKAGES ====================
  async getPackages() {
    try {
      console.log('📦 [AdminService] Obteniendo paquetes...');
      const response = await api.get(`${BASE_URL}/packages`);
      console.log(`✅ [AdminService] ${response.data.data?.length || 0} paquetes obtenidos`);
      return response.data.data || [];
    } catch (error) {
      console.error('❌ [AdminService] Error obteniendo paquetes:', error);
      return [];
    }
  }

  async createPackage(packageData) {
    console.log('➕ [AdminService] Creando paquete:', packageData.name);
    const response = await api.post(`${BASE_URL}/packages`, packageData);
    console.log('✅ [AdminService] Paquete creado exitosamente');
    return response.data;
  }

  async updatePackage(packageId, packageData) {
    console.log(`✏️ [AdminService] Actualizando paquete ID: ${packageId}`);
    const response = await api.put(`${BASE_URL}/packages/${packageId}`, packageData);
    console.log('✅ [AdminService] Paquete actualizado exitosamente');
    return response.data;
  }

  async togglePackageStatus(packageId, currentStatus) {
    console.log(`🔄 [AdminService] Cambiando estado paquete ID: ${packageId}`);
    const response = await api.put(`${BASE_URL}/packages/${packageId}`, {
      active: !currentStatus
    });
    console.log('✅ [AdminService] Estado de paquete actualizado');
    return response.data;
  }

  // ==================== SCHEDULES ====================
  async getSchedules() {
    try {
      console.log('📅 [AdminService] Obteniendo horarios...');
      const response = await api.get(`${BASE_URL}/schedules`);
      console.log(`✅ [AdminService] ${response.data.data?.length || 0} horarios obtenidos`);
      return response.data.data || [];
    } catch (error) {
      console.error('❌ [AdminService] Error obteniendo horarios:', error);
      return [];
    }
  }

  async createSchedule(scheduleData) {
    console.log('➕ [AdminService] Creando horario');
    const response = await api.post(`${BASE_URL}/schedules`, scheduleData);
    console.log('✅ [AdminService] Horario creado exitosamente');
    return response.data;
  }

  async updateSchedule(scheduleId, scheduleData) {
    console.log(`✏️ [AdminService] Actualizando horario ID: ${scheduleId}`);
    const response = await api.put(`${BASE_URL}/schedules/${scheduleId}`, scheduleData);
    console.log('✅ [AdminService] Horario actualizado exitosamente');
    return response.data;
  }

  async cancelSchedule(scheduleId) {
    console.log(`❌ [AdminService] Cancelando horario ID: ${scheduleId}`);
    const response = await api.delete(`${BASE_URL}/schedules/${scheduleId}`);
    console.log('✅ [AdminService] Horario cancelado exitosamente');
    return response.data;
  }

  // ==================== USER PACKAGES ====================
  async getUserPackages() {
    try {
      console.log('📦 [AdminService] Obteniendo paquetes de usuarios...');
      const response = await api.get(`${BASE_URL}/user-packages`);
      console.log(`✅ [AdminService] ${response.data.data?.length || 0} paquetes de usuarios obtenidos`);
      return response.data.data || [];
    } catch (error) {
      console.error('❌ [AdminService] Error obteniendo paquetes de usuarios:', error);
      return [];
    }
  }

  async getUserPackagesByUser(userId) {
    console.log(`📦 [AdminService] Obteniendo paquetes del usuario ID: ${userId}`);
    const response = await api.get(`${BASE_URL}/user-packages/user/${userId}`);
    console.log('✅ [AdminService] Paquetes del usuario obtenidos');
    return response.data.data || [];
  }

  async assignPackageToUser(packageData) {
    console.log('➕ [AdminService] Asignando paquete a usuario:', packageData);
    const response = await api.post(`${BASE_URL}/user-packages`, packageData);
    console.log('✅ [AdminService] Paquete asignado exitosamente');
    return response.data;
  }

  async updateUserPackage(userPackageId, packageData) {
    console.log(`✏️ [AdminService] Actualizando paquete de usuario ID: ${userPackageId}`);
    const response = await api.put(`${BASE_URL}/user-packages/${userPackageId}`, packageData);
    console.log('✅ [AdminService] Paquete de usuario actualizado');
    return response.data;
  }

  async removeUserPackage(userPackageId) {
    console.log(`❌ [AdminService] Eliminando paquete de usuario ID: ${userPackageId}`);
    const response = await api.delete(`${BASE_URL}/user-packages/${userPackageId}`);
    console.log('✅ [AdminService] Paquete de usuario eliminado');
    return response.data;
  }

  // ==================== RESERVATIONS ====================
  async getReservations() {
    try {
      console.log('📅 [AdminService] Obteniendo reservas...');
      const response = await api.get(`${BASE_URL}/reservations`);
      console.log(`✅ [AdminService] ${response.data.data?.length || 0} reservas obtenidas`);
      return response.data.data || [];
    } catch (error) {
      console.error('❌ [AdminService] Error obteniendo reservas:', error);
      return [];
    }
  }

  async getReservationsBySchedule(scheduleId) {
    console.log(`📅 [AdminService] Obteniendo reservas del horario ID: ${scheduleId}`);
    const response = await api.get(`${BASE_URL}/reservations/schedule/${scheduleId}`);
    console.log('✅ [AdminService] Reservas del horario obtenidas');
    return response.data.data || [];
  }

  async getReservationsByUser(userId) {
    console.log(`📅 [AdminService] Obteniendo reservas del usuario ID: ${userId}`);
    const response = await api.get(`${BASE_URL}/reservations/user/${userId}`);
    console.log('✅ [AdminService] Reservas del usuario obtenidas');
    return response.data.data || [];
  }

  async markAttendance(reservationId, attended) {
    console.log(`✅ [AdminService] Marcando asistencia - Reservation: ${reservationId}, Attended: ${attended}`);
    const response = await api.put(`${BASE_URL}/reservations/${reservationId}/attendance`, { attended });
    console.log('✅ [AdminService] Asistencia marcada');
    return response.data;
  }

  // ==================== ADVANCED STATISTICS ====================
  async getAdvancedStatistics() {
    try {
      console.log('📊 [AdminService] Obteniendo estadísticas avanzadas...');
      const response = await api.get(`${BASE_URL}/statistics/advanced`);
      console.log('✅ [AdminService] Estadísticas avanzadas obtenidas');
      return response.data.data;
    } catch (error) {
      console.error('❌ [AdminService] Error obteniendo estadísticas avanzadas:', error);
      return null;
    }
  }

  // ==================== HELPERS ====================
  getDefaultStats() {
    return {
      users: { total: 0, clients: 0, instructors: 0, active: 0 },
      packages: { total: 0, active: 0, assigned: 0 },
      classes: { total: 0, active: 0 },
      schedules: { total: 0, scheduled: 0, cancelled: 0, completed: 0 },
      reservations: { total: 0, confirmed: 0, cancelled: 0 }
    };
  }

  /**
   * Carga paralela de todos los datos del dashboard
   * Optimizado para máximo rendimiento con Promise.allSettled
   *
   * @returns {Promise<Object>} Todos los datos del dashboard
   */
  async fetchAllData() {
    console.log('🚀 [AdminService] Iniciando carga paralela de datos...');
    const startTime = performance.now();

    const [stats, users, instructors, packages, classes, schedules] = await Promise.allSettled([
      this.getStatistics(),
      this.getUsers(),
      this.getUsers({ role: 'instructor' }),
      this.getPackages(),
      this.getClasses(),
      this.getSchedules()
    ]);

    const endTime = performance.now();
    console.log(`⚡ [AdminService] Datos cargados en ${(endTime - startTime).toFixed(2)}ms`);

    return {
      stats: stats.status === 'fulfilled' ? stats.value : this.getDefaultStats(),
      users: users.status === 'fulfilled' ? users.value : [],
      instructors: instructors.status === 'fulfilled' ? instructors.value : [],
      packages: packages.status === 'fulfilled' ? packages.value : [],
      classes: classes.status === 'fulfilled' ? classes.value : [],
      schedules: schedules.status === 'fulfilled' ? schedules.value : []
    };
  }
}

const adminServiceInstance = new AdminService();
export default adminServiceInstance;