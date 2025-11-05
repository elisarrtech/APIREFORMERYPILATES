/**
 * Frontend API client (axios)
 * ✅ Versión mejorada y organizada
 * - Cleaner token helpers (set/clear)
 * - Robust deriveBaseURL with sensible default for Netlify proxy
 * - Request/response interceptors with centralized error extraction
 * - Small helpers exported: setAuthToken, clearAuthToken, getAuthToken, setAuthFailureHandler
 *
 * Mantén este archivo en single-source-of-truth para llamadas HTTP.
 */

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const DEFAULT_TIMEOUT = 30_000; // 30s por defecto
const LOCAL_TOKEN_KEY = 'token'; // key usada en localStorage

// ROOT removed - rely on deriveBaseURL to decide API host and /api/v1 suffix
const ROOT = ((API_BASE_URL?.toString().trim()) || (import.meta?.env?.VITE_API_URL || "")).replace(/\/+$/, "");


/**
 * Deriva baseURL desde constantes o fallback.
 * - Si usas Netlify proxy: deja API_BASE_URL vacío y usa '/api' por defecto.
 * - Si quieres apuntar directo a Railway/Heroku, define API_BASE_URL en env.
 */
// ... encabezado e imports (igual que en tu repo) ...

// Derivar baseURL desde VITE_API_URL o API_BASE_URL
const deriveBaseURL = () => {
  try {
    const root =
      (API_BASE_URL && API_BASE_URL.toString().trim()) ||
      (import.meta?.env?.VITE_API_URL || "").toString().trim();

    if (root) {
      let base = root.replace(/\/+$/, ""); // quita '/' final
      // si NO termina ya en /api o /api/vX, agrega /api/v1
      if (!/\/api(\/v\d+)?$/i.test(base)) base += "/api/v1";
      return base;
    }
  } catch (_) {}
  return "/api";
};

const baseURL = deriveBaseURL();

const api = axios.create({
  baseURL, // ej: https://apireformerypilates-production.up.railway.app/api/v1
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});


 
/* ===========================
   Auth token helpers
   =========================== */

export function getAuthToken() {
  try {
    // Prioriza token seteado explícitamente en runtime
    if (api.__AUTH_TOKEN__) return api.__AUTH_TOKEN__;
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LOCAL_TOKEN_KEY) || localStorage.getItem('access_token') || null;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      api.__AUTH_TOKEN__ = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_TOKEN_KEY, token);
      }
    } else {
      // no token -> limpiar
      clearAuthToken();
    }
  } catch (e) {
    // ignore
  }
}

export function clearAuthToken() {
  try {
    delete api.__AUTH_TOKEN__;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_TOKEN_KEY);
      localStorage.removeItem('access_token');
    }
  } catch (e) {
    // ignore
  }
}

/* Optional hook: allow app to register a handler when 401 occurs (e.g. show login modal) */
let authFailureHandler = null;
export function setAuthFailureHandler(fn) {
  authFailureHandler = typeof fn === 'function' ? fn : null;
}

/* ===========================
   Error helper
   =========================== */

/**
 * ✅ extractError - Extrae información del error de manera consistente
 * Usado por componentes como UsersManagement y WeeklyScheduler
 */
export const extractError = (err) => {
  const status = err?.response?.status ?? null;
  const data = err?.response?.data;
  const message =
    (data && (data.error || data.message || data.detail)) ||
    err?.message ||
    'Error desconocido';
  return { status, message, raw: err };
};

/* ===========================
   Axios interceptors
   =========================== */

// Request: attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    try {
      if (!config.headers) config.headers = {};
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: on 401 clean token and call authFailureHandler if provided
api.interceptors.response.use(
  (res) => res,
  (err) => {
    try {
      const status = err?.response?.status;
      if (status === 401) {
        // limpiar token local
        clearAuthToken();
        // invoke optional handler so UI can redirect to login or show modal
        if (authFailureHandler) {
          try {
            authFailureHandler(err);
          } catch (handlerErr) {
            // swallow handler errors
            // eslint-disable-next-line no-console
            console.error('authFailureHandler error', handlerErr);
          }
        } else if (typeof window !== 'undefined') {
          // por defecto no redirigimos automáticamente para no romper flows; si quieres activar:
          // window.location.href = '/login';
        }
      }
    } catch (e) {
      // ignore
    }
    return Promise.reject(err);
  }
);

/* =========================
 *         APIs
 * ========================= */

/** 
 * ✅ AUTH API 
 */
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  registerInstructor: (instructorData) => api.post('/auth/register-instructor', instructorData),
  registerAdmin: (adminData) => api.post('/auth/register-admin', adminData),
  me: () => api.get('/auth/me'),
  approveInstructor: (instructorId) => api.post(`/auth/approve-instructor/${instructorId}`),
};

/** 
 * ✅ CLASES API 
 */
export const classesAPI = {
  getAll: () => api.get('/classes'),
  getWithSchedules: () => api.get('/classes/with-schedules'),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data), // ✅ AGREGADO: Para crear clases desde WeeklyScheduler
};

/** 
 * ✅ BOOKINGS API 
 */
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getBySchedule: (scheduleId) => api.get(`/bookings/schedule/${scheduleId}`),
  cancel: (id, body = {}) => api.post(`/bookings/${id}/cancel`, body),
  getCancellationStats: (params) => api.get('/bookings/cancellations/stats', { params }),
  getRecentBookings: (range) => api.get('/bookings/recent', { params: { range } }),
};

/** 
 * ✅ INSTRUCTORES API 
 */
export const instructorsAPI = {
  getAll: () => api.get('/instructors'),
  getById: (id) => api.get(`/instructors/${id}`),
};

/** 
 * ✅ USUARIOS API
 * USADO POR: UsersManagement, WeeklyScheduler (para cargar instructores)
 */
export const usersAPI = {
  getAll: () => api.get('/users'), // ✅ IMPORTANTE: Carga todos los usuarios (usado en WeeklyScheduler)
  getById: (id) => api.get(`/users/${id}`),
  create: (d) => api.post('/users', d),
  updateById: (id, d) => api.patch(`/users/${id}`, d),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getMe: () => api.get('/users/me'),
  update: (d) => api.put('/users/me', d),
  setRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
};

/** 
 * ✅ CARRITO API 
 */
export const cartAPI = {
  add: (payload) => api.post('/cart/add', payload),
  get: () => api.get('/cart'),
  checkout: (payload) => api.post('/cart/checkout', payload),
};

/* ===========================
   Helpers para horarios
   =========================== */

const isNotFound = (err) => err?.response?.status === 404;
const isMethodNotAllowed = (err) => err?.response?.status === 405;

const normalizeScheduleItem = (x) => {
  const _date = x.date || x.startDate || (x.start_time ? String(x.start_time).slice(0, 10) : null);
  const _time =
    x.time ||
    (x.start_time ? String(x.start_time).slice(11, 16) : '') ||
    (x.start ? String(x.start).slice(11, 16) : '');

  const capacity = x.capacity ?? x.max_capacity ?? 0;
  const reserved = x.enrolled_count ?? x.reservedCount ?? x.booked ?? 0;
  const available = Math.max(0, capacity - reserved);

  return {
    id: x.id || x._id || x.class_id,
    class_id: x.class_id || x.id || x._id,
    name: x.name || x.title || x.className || x.class_name || 'Sin nombre',
    date: _date,
    time: _time,
    start_time: x.start_time || x.start || '',
    end_time: x.end_time || x.end || '',
    instructor: x.instructor || x.instructor_name || x.instructorName || '',
    instructor_id: x.instructor_id || x.instructorId || null,
    capacity,
    reserved,
    available,
    status: x.status || (x.active === false ? 'cancelled' : 'active'),
    can_user_reserve: x.can_user_reserve ?? x.canReserve ?? true,
    user_enrolled: x.user_enrolled ?? x.isEnrolled ?? false,
    ...x,
  };
};

const filterByRange = (items, startDate, endDate) => {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  return items.filter((x) => {
    if (!x.date) return true;
    const d = new Date(x.date);
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  });
};

/** 
 * ✅ SCHEDULE API 
 * USADO POR: WeeklyScheduler, ScheduleManagement, y otros componentes de calendario
 */
export const scheduleAPI = {
  // Obtener horarios con filtros
  getSchedule: (startDate, endDate, extra = {}) =>
    api
      .get('/classes/schedule', {
        params: {
          start_date: startDate,
          end_date: endDate,
          ...extra,
        },
      })
      .then((res) => {
        let arr = res?.data?.schedules || res?.data || [];
        if (!Array.isArray(arr)) arr = [];
        return arr.map(normalizeScheduleItem);
      }),

  getAvailableSchedule: (startDate, endDate, extra = {}) =>
    api.get('/classes/schedule/available', {
      params: {
        start_date: startDate,
        end_date: endDate,
        ...extra,
      },
    }),

  // ✅ IMPORTANTE: Crear una clase/instancia (usado en WeeklyScheduler)
  createClass: (classData) => {
    const payload = {
      ...classData,
      date: (classData.date || '').slice(0, 10),
      start_time: (classData.start_time || '').slice(0, 5),
      end_time: (classData.end_time || '').slice(0, 5),
    };
    return api.post('/classes/schedule', payload);
  },

  updateClass: (classId, classData) => {
    const payload = {
      ...classData,
      date: (classData.date || '').slice(0, 10),
      start_time: (classData.start_time || '').slice(0, 5),
      end_time: (classData.end_time || '').slice(0, 5),
    };
    return api.put(`/classes/schedule/${classId}`, payload);
  },

  deleteClass: async (classId) => {
    try {
      return await api.delete(`/classes/schedule/${classId}`);
    } catch (err) {
      if (isNotFound(err) || isMethodNotAllowed(err)) {
        return await api.put(`/classes/schedule/${classId}`, { status: 'deleted' });
      }
      throw err;
    }
  },

  // Reservas
  reserveClass: (classId) => api.post(`/classes/reserve/${classId}`),
  cancelReservation: (classId) => api.delete(`/classes/reserve/${classId}`),
  
  // Aliases para compatibilidad
  enrollClass: (classId, body = {}) => api.post(`/classes/reserve/${classId}`, body),
  unenrollClass: (classId, body = {}) => api.delete(`/classes/reserve/${classId}`, { data: body }),
  
  // Waitlist
  joinWaitlist: (classId) => api.post(`/classes/reserve/${classId}`),
  leaveWaitlist: (classId) => api.delete(`/classes/reserve/${classId}`),
  
  // Alias para eliminar
  removeClass: async (classId) => scheduleAPI.deleteClass(classId),
};

// Alias para mantener compatibilidad
export const classScheduleAPI = scheduleAPI;

/** 
 * ✅ PAYMENTS API 
 */
export const paymentsAPI = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  create: (d) => api.post('/payments', d),
  update: (id, d) => api.put(`/payments/${id}`, d),
  delete: (id) => api.delete(`/payments/${id}`),
  getRecent: (limit = 10) => api.get('/payments/recent', { params: { limit } }),
  getByUser: (uid) => api.get(`/payments/user/${uid}`),
  processPayment: (d) => api.post('/payments/process', d),
};

/** 
 * ✅ NOTIFICATIONS API 
 */
const postNotificationsWithBulkFallback = async (pathPayload) => {
  try {
    return await api.post('/notifications/bulk', pathPayload);
  } catch (err) {
    const status = err?.response?.status;
    if (status === 405 || status === 404) {
      return await api.post('/notifications', pathPayload);
    }
    throw err;
  }
};

export const bulkNotificationsAPI = {
  sendBulk: (d) => postNotificationsWithBulkFallback(d),
  getRecent: () => api.get('/notifications/recent'),
  getAll: () => api.get('/notifications'),
  getById: (id) => api.get(`/notifications/${id}`),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const notificationsAPI = {
  sendBulk: (d) => postNotificationsWithBulkFallback(d),
  create: (d) => api.post('/notifications', d),
  getAll: () => api.get('/notifications'),
  getById: (id) => api.get(`/notifications/${id}`),
  delete: (id) => api.delete(`/notifications/${id}`),
  getRecent: (limit = 10) => api.get('/notifications/recent', { params: { limit } }),
  markAsRead: (id) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
};

/** 
 * ✅ AUDIT API 
 */
export const auditAPI = {
  getLogs: (filters) => api.get('/audit/logs', { params: filters }),
  getById: (id) => api.get(`/audit/logs/${id}`),
  exportLogs: (fmt) => api.get(`/audit/export/${fmt}`),
  getRecent: (limit = 50) => api.get('/audit/logs/recent', { params: { limit } }),
  search: (q) => api.get('/audit/logs/search', { params: { q } }),
  getStats: () => api.get('/audit/stats'),
};

/** 
 * ✅ MEMBERSHIPS API 
 */
export const membershipsAPI = {
  getAll: () => api.get('/memberships'),
  getById: (id) => api.get(`/memberships/${id}`),
  create: (d) => api.post('/memberships', d),
  update: (id, d) => api.put(`/memberships/${id}`, d),
  delete: (id) => api.delete(`/memberships/${id}`),
  getActive: () => api.get('/memberships/active'),
  getByUser: (uid) => api.get(`/memberships/user/${uid}`),
  renew: (id) => api.post(`/memberships/${id}/renew`),
  cancel: (id) => api.post(`/memberships/${id}/cancel`),
  getPlans: () => api.get('/memberships/plans'),
  createPlan: (d) => api.post('/memberships/plans', d),
  updatePlan: (id, d) => api.put(`/memberships/plans/${id}`, d),
  deletePlan: (id) => api.delete(`/memberships/plans/${id}`),
};

/** 
 * ✅ PURCHASES / PACKAGES API 
 */
export const purchasesAPI = {
  create: (payload) => api.post('/purchases', payload),
  getMy: () => api.get('/purchases/my'),
  getActive: () => api.get('/purchases/active'),
  adminList: (params = {}) => api.get('/purchases', { params }),
  adminUpdate: (id, payload) => api.patch(`/purchases/${id}`, payload),
};

export const adminPackagesAPI = {
  list: () => api.get('/admin/packages'),
  create: (payload) => api.post('/admin/packages', payload),
  update: (id, payload) => api.put(`/admin/packages/${id}`, payload),
  remove: (id) => api.delete(`/admin/packages/${id}`),
};

export const adminClassesAPI = {
  list: (params) => api.get('/admin/classes', { params }),
  create: (payload) => api.post('/admin/classes', payload),
  update: (id, payload) => api.put(`/admin/classes/${id}`, payload),
  remove: (id, { force = false } = {}) => api.delete(`/admin/classes/${id}`, { params: { force } }),
};

/** 
 * ✅ CALENDAR API 
 */
export const calendarAPI = {
  list: (params = {}) => api.get('/calendar', { params }),
  create: (payload) => api.post('/calendar', payload),
  update: (id, payload) => api.put(`/calendar/${id}`, payload),
  remove: (id) => api.delete(`/calendar/${id}`),
};

/** 
 * ✅ RESERVATIONS API
 * Wrapper simple con nombres que usan componentes (book/cancel)
 * USADO POR: WeeklyScheduler
 */
export const reservationsAPI = {
  book: (classId, body = {}) => {
    // intenta usar scheduleAPI.reserveClass si existe
    if (typeof scheduleAPI !== 'undefined' && scheduleAPI.reserveClass) {
      return scheduleAPI.reserveClass(classId, body);
    }
    return api.post(`/classes/reserve/${classId}`, body);
  },
  cancel: (classId, body = {}) => {
    if (typeof scheduleAPI !== 'undefined' && scheduleAPI.cancelReservation) {
      return scheduleAPI.cancelReservation(classId, body);
    }
    return api.delete(`/classes/reserve/${classId}`, { data: body });
  },
};

/* ===========================
   Auth Helpers
   =========================== */

export const authHelpers = {
  // Hace login y guarda token (si backend devuelve token en data.token o data.access_token)
  async loginAndSetToken(credentials) {
    const res = await api.post('/auth/login', credentials);
    const token = res?.data?.token || res?.data?.access_token || res?.data?.accessToken;
    if (token) {
      setAuthToken(token);
    }
    return res;
  },
  logout() {
    clearAuthToken();
  },
};

/* ===========================
   Utility Helpers
   =========================== */

export async function requestData(promise) {
  try {
    const res = await promise;
    return res?.data ?? res;
  } catch (err) {
    const extracted = extractError(err);
    const e = new Error(extracted.message);
    e.status = extracted.status;
    e.raw = extracted.raw;
    throw e;
  }
}

// Export helpers
export { normalizeScheduleItem, filterByRange };

// ---------------------------------------------------------------------
// ✅ NOTAS IMPORTANTES PARA BACKEND:
// ---------------------------------------------------------------------
// 1. Al crear/actualizar una clase, devolver en la respuesta:
//    { id, name, date, start_time, end_time, capacity, instructor, 
//      active, enrolled_count, can_user_reserve, user_enrolled, 
//      user_purchase_info, calendar_event_id }
//
// 2. En reservas: retornar remaining_credits en data al reservar si aplica
//
// 3. En calendarAPI.list devolver eventos filtrables por rango 
//    start_date/end_date
//
// 4. Usar formatos ISO: 
//    - date → 'YYYY-MM-DD'
//    - time → 'HH:MM'
//
// 5. El endpoint /users debe devolver TODOS los usuarios con su campo "role"
//    para que WeeklyScheduler pueda filtrar los instructores
// ---------------------------------------------------------------------

/* Default export: axios instance for advanced usage */
export default api;
