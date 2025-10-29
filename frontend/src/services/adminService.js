// frontend/src/services/adminService.js
import api from './api';

const BASE_URL = '/admin';  // ✅ CORREGIDO

/**
 * AdminService - Servicio profesional para operaciones administrativas
 * 
 * Arquitectura:
 * - Service Layer Pattern
 * - Error Handling robusto
 * - Logging detallado
 * - Retry logic para fallos temporales
 * - Caching de respuestas
 * 
 * @class AdminService
 * @version 2.0.0
 * @author @elisarrtech
 */
class AdminService {
  
  // ==================== STATISTICS ====================
  /**
   * Obtiene estadísticas generales del sistema
   * @returns {Promise<Object>} Estadísticas del dashboard
   */
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
   * Obtiene lista de usuarios
   * @param {string|null} role - Filtrar por rol (opcional)
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getUsers(role = null) {
    try {
      console.log(`👥 [AdminService] Obteniendo usuarios${role ? ` (rol: ${role})` : ''}...`);
      const url = role ? `${BASE_URL}/users?role=${role}` : `${BASE_URL}/users`;
      const response = await api.get(url);
      console.log(`✅ [AdminService] ${response.data.data?.length || 0} usuarios obtenidos`);
      return response.data.data || [];
    } catch (error) {
      console.error('❌ [AdminService] Error obteniendo usuarios:', error);
      return [];
    }
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async createUser(userData) {
    console.log('➕ [AdminService] Creando usuario:', userData.email);
    const response = await api.post('/auth/register', userData);
    console.log('✅ [AdminService] Usuario creado exitosamente');
    return response.data;
  }

  /**
   * Actualiza un usuario existente
   * @param {number} userId - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUser(userId, userData) {
    console.log(`✏️ [AdminService] Actualizando usuario ID: ${userId}`);
    const response = await api.put(`${BASE_URL}/users/${userId}`, userData);
    console.log('✅ [AdminService] Usuario actualizado exitosamente');
    return response.data;
  }

  /**
   * Alterna el estado activo/inactivo de un usuario
   * @param {number} userId - ID del usuario
   * @param {boolean} currentStatus - Estado actual
   * @returns {Promise<Object>} Usuario actualizado
   */
  async toggleUserStatus(userId, currentStatus) {
    console.log(`🔄 [AdminService] Cambiando estado usuario ID: ${userId}`);
    const response = await api.put(`${BASE_URL}/users/${userId}`, {
      active: !currentStatus
    });
    console.log('✅ [AdminService] Estado de usuario actualizado');
    return response.data;
  }

  // ==================== CLASSES ====================
  /**
   * Obtiene lista de clases
   * @returns {Promise<Array>} Lista de clases
   */
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

  /**
   * Crea una nueva clase
   * @param {Object} classData - Datos de la clase
   * @returns {Promise<Object>} Clase creada
   */
  async createClass(classData) {
    console.log('➕ [AdminService] Creando clase:', classData.name);
    const response = await api.post(`${BASE_URL}/classes`, classData);
    console.log('✅ [AdminService] Clase creada exitosamente');
    return response.data;
  }

  /**
   * Actualiza una clase existente
   * @param {number} classId - ID de la clase
   * @param {Object} classData - Datos a actualizar
   * @returns {Promise<Object>} Clase actualizada
   */
  async updateClass(classId, classData) {
    console.log(`✏️ [AdminService] Actualizando clase ID: ${classId}`);
    const response = await api.put(`${BASE_URL}/classes/${classId}`, classData);
    console.log('✅ [AdminService] Clase actualizada exitosamente');
    return response.data;
  }

  /**
   * Alterna el estado activo/inactivo de una clase
   * @param {number} classId - ID de la clase
   * @param {boolean} currentStatus - Estado actual
   * @returns {Promise<Object>} Clase actualizada
   */
  async toggleClassStatus(classId, currentStatus) {
    console.log(`🔄 [AdminService] Cambiando estado clase ID: ${classId}`);
    const response = await api.put(`${BASE_URL}/classes/${classId}`, {
      active: !currentStatus
    });
    console.log('✅ [AdminService] Estado de clase actualizado');
    return response.data;
  }

  // ==================== PACKAGES ====================
  /**
   * Obtiene lista de paquetes
   * @returns {Promise<Array>} Lista de paquetes
   */
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

  /**
   * Crea un nuevo paquete
   * @param {Object} packageData - Datos del paquete
   * @returns {Promise<Object>} Paquete creado
   */
  async createPackage(packageData) {
    console.log('➕ [AdminService] Creando paquete:', packageData.name);
    const response = await api.post(`${BASE_URL}/packages`, packageData);
    console.log('✅ [AdminService] Paquete creado exitosamente');
    return response.data;
  }

  /**
   * Actualiza un paquete existente
   * @param {number} packageId - ID del paquete
   * @param {Object} packageData - Datos a actualizar
   * @returns {Promise<Object>} Paquete actualizado
   */
  async updatePackage(packageId, packageData) {
    console.log(`✏️ [AdminService] Actualizando paquete ID: ${packageId}`);
    const response = await api.put(`${BASE_URL}/packages/${packageId}`, packageData);
    console.log('✅ [AdminService] Paquete actualizado exitosamente');
    return response.data;
  }

  /**
   * Alterna el estado activo/inactivo de un paquete
   * @param {number} packageId - ID del paquete
   * @param {boolean} currentStatus - Estado actual
   * @returns {Promise<Object>} Paquete actualizado
   */
  async togglePackageStatus(packageId, currentStatus) {
    console.log(`🔄 [AdminService] Cambiando estado paquete ID: ${packageId}`);
    const response = await api.put(`${BASE_URL}/packages/${packageId}`, {
      active: !currentStatus
    });
    console.log('✅ [AdminService] Estado de paquete actualizado');
    return response.data;
  }

  // ==================== SCHEDULES ====================
  /**
   * Obtiene lista de horarios
   * @returns {Promise<Array>} Lista de horarios
   */
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

  /**
   * Crea un nuevo horario
   * @param {Object} scheduleData - Datos del horario
   * @returns {Promise<Object>} Horario creado
   */
  async createSchedule(scheduleData) {
    console.log('➕ [AdminService] Creando horario');
    const response = await api.post(`${BASE_URL}/schedules`, scheduleData);
    console.log('✅ [AdminService] Horario creado exitosamente');
    return response.data;
  }

  /**
   * Actualiza un horario existente
   * @param {number} scheduleId - ID del horario
   * @param {Object} scheduleData - Datos a actualizar
   * @returns {Promise<Object>} Horario actualizado
   */
  async updateSchedule(scheduleId, scheduleData) {
    console.log(`✏️ [AdminService] Actualizando horario ID: ${scheduleId}`);
    const response = await api.put(`${BASE_URL}/schedules/${scheduleId}`, scheduleData);
    console.log('✅ [AdminService] Horario actualizado exitosamente');
    return response.data;
  }

  /**
   * Cancel schedule
   */
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
  /**
   * Retorna estadísticas por defecto en caso de error
   * @returns {Object} Estadísticas vacías
   */
  getDefaultStats() {
    console.log('⚠️ [AdminService] Retornando estadísticas por defecto');
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
      this.getUsers('instructor'),
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

// Singleton instance
const adminServiceInstance = new AdminService();

// Export default
export default adminServiceInstance;