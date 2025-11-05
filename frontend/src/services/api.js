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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Optional: helpful logs for debugging deployed host/URL
    // console.debug(`🚀 Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Notificar o redirigir si corresponde
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
