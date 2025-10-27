
/**
 * API Service - Cliente HTTP centralizado
 * Autor: @elisarrtech con Elite AI Architect
 * Código de Élite Mundial - Production Ready
 * 
 * Funcionalidades:
 * - Axios con interceptores
 * - Manejo automático de tokens JWT
 * - Refresh token automático
 * - Manejo de errores centralizado
 * - Retry logic
 */

import axios from 'axios';

// Configuración base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Crear instancia de Axios con configuración base
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor - Agregar token JWT automáticamente
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Manejar errores y refresh token
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          if (response.data.success) {
            const newAccessToken = response.data.data.access_token;
            localStorage.setItem('access_token', newAccessToken);

            // Reintentar request original con nuevo token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Si el refresh falla, limpiar tokens y redirigir a login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==========================================
// AUTH SERVICE - Autenticación
// ==========================================

export const authService = {
  /**
   * Login
   */
  login: (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  /**
   * Register
   */
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  /**
   * Refresh token
   */
  refresh: (refreshToken) => {
    return axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
  },

  /**
   * Logout
   */
  logout: () => {
    return apiClient.post('/auth/logout');
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    return apiClient.get('/auth/me');
  },

  /**
   * Change password
   */
  changePassword: (currentPassword, newPassword) => {
    return apiClient.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};

// ==========================================
// RESERVATIONS SERVICE - Sistema de Reservas
// ==========================================

export const reservationsService = {
  /**
   * Get weekly schedule
   */
  getWeeklySchedule: (startDate) => {
    const params = startDate ? { start_date: startDate } : {};
    return apiClient.get('/reservations/weekly-schedule', { params });
  },

  /**
   * Get package status
   */
  getPackageStatus: () => {
    return apiClient.get('/reservations/package-status');
  },

  /**
   * Create reservation
   */
  createReservation: (scheduleId) => {
    return apiClient.post('/reservations/', { schedule_id: scheduleId });
  },

  /**
   * Cancel reservation
   */
  cancelReservation: (reservationId, reason = null) => {
    return apiClient.post(`/reservations/${reservationId}/cancel`, { reason });
  },

  /**
   * Get my reservations
   */
  getMyReservations: (status = null, includePast = false) => {
    const params = {};
    if (status) params.status = status;
    if (includePast) params.include_past = 'true';
    
    return apiClient.get('/reservations/my-reservations', { params });
  },
};

// ==========================================
// ADMIN SERVICE - Panel de Administración
// ==========================================

export const adminService = {
  // ========== CLASES ==========
  
  /**
   * Get all classes
   */
  getAllClasses: () => {
    return apiClient.get('/admin/classes');
  },

  /**
   * Create class
   */
  createClass: (classData) => {
    return apiClient.post('/admin/classes', classData);
  },

  /**
   * Update class
   */
  updateClass: (classId, classData) => {
    return apiClient.put(`/admin/classes/${classId}`, classData);
  },

  /**
   * Delete class
   */
  deleteClass: (classId) => {
    return apiClient.delete(`/admin/classes/${classId}`);
  },

  // ========== HORARIOS ==========
  
  /**
   * Get schedules
   */
  getSchedules: (dateFrom, dateTo) => {
    return apiClient.get('/admin/schedules', {
      params: { from: dateFrom, to: dateTo },
    });
  },

  /**
   * Create schedule
   */
  createSchedule: (scheduleData) => {
    return apiClient.post('/admin/schedules', scheduleData);
  },

  /**
   * Update schedule
   */
  updateSchedule: (scheduleId, scheduleData) => {
    return apiClient.put(`/admin/schedules/${scheduleId}`, scheduleData);
  },

  /**
   * Delete schedule
   */
  deleteSchedule: (scheduleId) => {
    return apiClient.delete(`/admin/schedules/${scheduleId}`);
  },

  // ========== RESERVAS ==========
  
  /**
   * Get all reservations
   */
  getAllReservations: (filters = {}) => {
    return apiClient.get('/admin/reservations', { params: filters });
  },

  /**
   * Mark attendance
   */
  markAttendance: (reservationId, attended) => {
    return apiClient.post(`/admin/reservations/${reservationId}/attendance`, {
      attended,
    });
  },

  // ========== INSTRUCTORES ==========
  
  /**
   * Get all instructors
   */
  getAllInstructors: () => {
    return apiClient.get('/admin/instructors');
  },

  /**
   * Get instructor stats
   */
  getInstructorStats: (instructorId) => {
    return apiClient.get(`/admin/instructors/${instructorId}/stats`);
  },

  // ========== ESTADÍSTICAS ==========
  
  /**
   * Get statistics
   */
  getStatistics: () => {
    return apiClient.get('/admin/statistics');
  },

  /**
   * Get dashboard data
   */
  getDashboardData: () => {
    return apiClient.get('/admin/dashboard');
  },
};

// ==========================================
// INSTRUCTOR SERVICE - Panel de Instructor
// ==========================================

export const instructorService = {
  /**
   * Get my profile
   */
  getMyProfile: () => {
    return apiClient.get('/instructors/my-profile');
  },

  /**
   * Get my schedule
   */
  getMySchedule: (dateFrom = null, dateTo = null) => {
    const params = {};
    if (dateFrom) params.from = dateFrom;
    if (dateTo) params.to = dateTo;
    
    return apiClient.get('/instructors/my-schedule', { params });
  },

  /**
   * Get class reservations
   */
  getClassReservations: (scheduleId) => {
    return apiClient.get(`/instructors/my-classes/${scheduleId}/reservations`);
  },

  /**
   * Get my stats
   */
  getMyStats: () => {
    return apiClient.get('/instructors/my-stats');
  },
};

// ==========================================
// EXPORT DEFAULT
// ==========================================

export default apiClient;

