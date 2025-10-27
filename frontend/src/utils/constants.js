/**
 * Application Constants
 * Autor: @elisarrtech con Elite AI Architect
 */

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  CLIENT: 'client'
};

// Estados de reserva
export const RESERVATION_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show'
};

// Estados de horario
export const SCHEDULE_STATUS = {
  SCHEDULED: 'scheduled',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Días de la semana
export const WEEK_DAYS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

// Horarios disponibles (7:00 AM - 8:00 PM)
export const AVAILABLE_HOURS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
];

// Colores predefinidos para clases
export const CLASS_COLORS = [
  '#8BA88D', // Verde principal
  '#B4A7D6', // Púrpura
  '#D4A574', // Naranja claro
  '#A8C5DD', // Azul claro
  '#E8A87C', // Naranja
  '#F4B5D1', // Rosa
  '#C38E70', // Marrón
  '#9ABCA7'  // Verde claro
];

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'FitnessClub',
  VERSION: '2.0.0',
  MIN_HOURS_TO_CANCEL: 2,
  MAX_RESERVATIONS_PER_USER: 10,
  PACKAGE_VALIDITY_DAYS: 30,
  ALERT_DAYS_BEFORE_EXPIRY: 5,
  ALERT_CLASSES_REMAINING: 3
};

// Mensajes de la aplicación
export const MESSAGES = {
  SUCCESS: {
    RESERVATION_CREATED: '¡Reserva confirmada exitosamente!',
    RESERVATION_CANCELLED: 'Reserva cancelada exitosamente',
    CLASS_CREATED: 'Clase creada exitosamente',
    CLASS_UPDATED: 'Clase actualizada exitosamente',
    CLASS_DELETED: 'Clase eliminada exitosamente',
    SCHEDULE_CREATED: 'Horario creado exitosamente',
    SCHEDULE_UPDATED: 'Horario actualizado exitosamente',
    SCHEDULE_DELETED: 'Horario cancelado exitosamente'
  },
  ERROR: {
    GENERIC: 'Ha ocurrido un error. Por favor intenta de nuevo.',
    NO_ACTIVE_PACKAGE: 'No tienes un paquete activo',
    CLASS_FULL: 'Esta clase está llena',
    ALREADY_RESERVED: 'Ya has reservado esta clase',
    CANNOT_CANCEL: 'No puedes cancelar esta reserva',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción'
  }
};

export default {
  USER_ROLES,
  RESERVATION_STATUS,
  SCHEDULE_STATUS,
  WEEK_DAYS,
  AVAILABLE_HOURS,
  CLASS_COLORS,
  APP_CONFIG,
  MESSAGES
};

