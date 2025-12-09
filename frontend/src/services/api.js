import axios from 'axios';

// Derivar base URL de VITE_API_URL y asegurar sufijo /api/v1 si hace falta
const envUrl = import.meta.env.VITE_API_URL || '';
const normalizeRoot = (r) => {
  if (!r) return '';
  return r.replace(/\/+$/, '');
};

const ROOT = normalizeRoot(envUrl);

// Si ROOT no contiene /api o /api/vX, agregar /api/v1 por convención
const ensureApiPrefix = (root) => {
  if (!root) return '/api/v1'; // fallback para desarrollo
  if (!/\/api(\/v\d+)?$/i.test(root)) {
    return `${root}/api/v1`;
  }
  return root;
};

const API_BASE_URL = ensureApiPrefix(ROOT) || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor: adjunta token desde localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: no redirigir automáticamente en 401 — emitir evento
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Limpiar credenciales localmente
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      } catch (e) {
        // ignore
      }

      // Emitir evento global para que AuthContext gestione el logout y la UI
      try {
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { reason: error } }));
        }
      } catch (e) {
        // ignore
      }

      // No redirigimos aquí: dejamos que el AuthContext haga la acción apropiada
    }

    return Promise.reject(error);
  }
);

export default api;
