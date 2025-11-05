/**
 * Application Constants - REFORMERY
 * Centraliza todas las constantes de la aplicación
 * 
 * @version 2.0.0
 * @author @elisarrtech
 * @date 2025-10-27
 */

// ==================== DASHBOARD TABS ====================
export const TABS = {
  OVERVIEW: 'overview',
  USERS: 'users',
  PACKAGES: 'packages',
  CLASSES: 'classes',
  SCHEDULES: 'schedules',
  STATISTICS: 'statistics',  // ✅ NUEVO TAB
  NOTIFICATIONS: 'notificaciones'  
};


// ==================== USER ROLES ====================
export const ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  CLIENT: 'client',
};

// Alias para compatibilidad
export const USER_ROLES = ROLES;

// Labels para roles de usuario (para UI)
export const USER_ROLE_LABELS = {
  admin: '👑 Administrador',
  instructor: '🏋️ Instructor',
  client: '👤 Cliente',
};

// Array de roles para selects
export const USER_ROLES_ARRAY = [
  { value: 'admin', label: '👑 Administrador' },
  { value: 'instructor', label: '🏋️ Instructor' },
  { value: 'client', label: '👤 Cliente' },
];

// ==================== STATUS ====================
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  SCHEDULED: 'scheduled',
};

// ==================== PACKAGE TYPES ====================
export const PACKAGE_TYPES = {
  INDIVIDUAL: 'individual',
  DUO: 'duo',
  COMBO: 'combo',
};

// Labels para tipos de paquete (para UI)
export const PACKAGE_TYPE_LABELS = {
  individual: '📦 Individual',
  duo: '👥 Dúo',
  combo: '🎁 Combo',
};

// Array de tipos de paquete para selects
export const PACKAGE_TYPES_ARRAY = [
  { value: 'individual', label: '📦 Individual' },
  { value: 'duo', label: '👥 Dúo' },
  { value: 'combo', label: '🎁 Combo' },
];

// ==================== CLASS CATEGORIES ====================
export const CLASS_CATEGORIES = {
  GRUPAL: 'grupal',
  PRIVADA: 'privada',
  SEMIPRIVADA: 'semiprivada',
  ESPECIAL: 'especial',
};

// Labels para categorías de clase (para UI)
export const CLASS_CATEGORY_LABELS = {
  grupal: '👥 Grupal',
  privada: '👤 Privada',
  semiprivada: '👥 Semiprivada',
  especial: '⭐ Especial',
};

// Array de categorías para selects
export const CLASS_CATEGORIES_ARRAY = [
  { value: 'grupal', label: '👥 Grupal' },
  { value: 'privada', label: '👤 Privada' },
  { value: 'semiprivada', label: '👥 Semiprivada' },
  { value: 'especial', label: '⭐ Especial' },
];

// ==================== INTENSITY LEVELS ====================
export const INTENSITY_LEVELS = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
};

// Labels para niveles de intensidad (para UI)
export const INTENSITY_LEVEL_LABELS = {
  baja: '🟢 Baja',
  media: '🟡 Media',
  alta: '🔴 Alta',
};

// Array de intensidades para selects
export const INTENSITY_LEVELS_ARRAY = [
  { value: 'baja', label: '🟢 Baja' },
  { value: 'media', label: '🟡 Media' },
  { value: 'alta', label: '🔴 Alta' },
];

// ==================== SCHEDULE STATUS ====================
export const SCHEDULE_STATUS = {
  SCHEDULED: 'scheduled',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Labels para estados de horario (para UI)
export const SCHEDULE_STATUS_LABELS = {
  scheduled: '📅 Programado',
  cancelled: '❌ Cancelado',
  completed: '✅ Completado',
};

// ==================== COLORS ====================
export const COLORS = {
  PRIMARY: '#0EA5E9',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#3B82F6',
};

// ==================== API ENDPOINTS ====================
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  ADMIN: {
    STATISTICS: '/admin-reformery/statistics',
    USERS: '/admin-reformery/users',
    PACKAGES: '/admin-reformery/packages',
    CLASSES: '/admin-reformery/classes',
    SCHEDULES: '/admin-reformery/schedules',
  },
};

// ==================== VALIDATION RULES ====================
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
};

// ==================== PAGINATION ====================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// ==================== DATE FORMATS ====================
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
};

// ==================== DEFAULT VALUES ====================
export const DEFAULTS = {
  CLASS_DURATION: 50, // minutos
  CLASS_CAPACITY: 10, // personas
  PACKAGE_VALIDITY: 30, // días
  SCHEDULE_START_TIME: '06:00',
  SCHEDULE_END_TIME: '07:00',
};

// ==================== INITIAL STATES ====================

/**
 * Estado inicial para formulario de paquete
 */
export const INITIAL_PACKAGE_STATE = {
  name: '',
  description: '',
  total_classes: 1,
  total_classes_reformer: 1,
  total_classes_top_barre: 0,
  validity_days: 30,
  price: 0,
  package_type: 'individual',
  active: true,
  display_order: 0,
};

/**
 * Estado inicial para formulario de usuario
 */
export const INITIAL_USER_STATE = {
  email: '',
  full_name: '',
  phone: '',
  password: '',
  role: 'client',
  active: true,
};

/**
 * Estado inicial para formulario de clase
 */
export const INITIAL_CLASS_STATE = {
  name: '',
  description: '',
  duration: 50,
  max_capacity: 10,
  category: 'grupal',
  intensity_level: 'media',
  active: true,
};

/**
 * Estado inicial para formulario de horario
 */
export const INITIAL_SCHEDULE_STATE = {
  class_id: '',
  instructor_id: '',
  date: new Date().toISOString().split('T')[0],
  start_time: '06:00',
  end_time: '07:00',
  max_capacity: 10,
  notes: '',
};


// ==================== EXPORT DEFAULT ====================
export default {
  TABS,
  ROLES,
  USER_ROLES,
  USER_ROLE_LABELS,
  USER_ROLES_ARRAY,
  STATUS,
  PACKAGE_TYPES,
  PACKAGE_TYPE_LABELS,
  PACKAGE_TYPES_ARRAY,
  CLASS_CATEGORIES,
  CLASS_CATEGORY_LABELS,
  CLASS_CATEGORIES_ARRAY,
  INTENSITY_LEVELS,
  INTENSITY_LEVEL_LABELS,
  INTENSITY_LEVELS_ARRAY,
  SCHEDULE_STATUS,
  SCHEDULE_STATUS_LABELS,
  COLORS,
  API_ENDPOINTS,
  VALIDATION,
  PAGINATION,
  DATE_FORMATS,
  DEFAULTS,
  INITIAL_PACKAGE_STATE,
  INITIAL_USER_STATE,
  INITIAL_CLASS_STATE,
  INITIAL_SCHEDULE_STATE,
};