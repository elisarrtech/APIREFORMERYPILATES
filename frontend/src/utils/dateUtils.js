/**
 * Date Utilities - Funciones para manejo de fechas
 * @author @elisarrtech
 */

/**
 * Obtiene el lunes de la semana actual
 * @returns {Date}
 */
export const getMonday = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/**
 * Obtiene array con los días de la semana
 * @param {Date} monday - Fecha del lunes
 * @returns {Date[]}
 */
export const getWeekDays = (monday) => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
};

/**
 * Formatea fecha corta (DD/MM)
 * @param {Date} date
 * @returns {string}
 */
export const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit'
  });
};

/**
 * Obtiene nombre del día
 * @param {Date} date
 * @returns {string}
 */
export const getDayName = (date) => {
  return new Date(date).toLocaleDateString('es-MX', { weekday: 'long' });
};

/**
 * Formatea hora (HH:MM)
 * @param {string|Date} datetime
 * @returns {string}
 */
export const formatTime = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

/**
 * Convierte Date a ISO string
 * @param {Date} date
 * @returns {string}
 */
export const toISOString = (date) => {
  return new Date(date).toISOString();
};

/**
 * Obtiene semana siguiente
 * @param {Date} date
 * @returns {Date}
 */
export const getNextWeek = (date) => {
  const next = new Date(date);
  next.setDate(next.getDate() + 7);
  return next;
};

/**
 * Obtiene semana anterior
 * @param {Date} date
 * @returns {Date}
 */
export const getPreviousWeek = (date) => {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 7);
  return prev;
};

/**
 * Formatea rango de fechas
 * @param {Date} start
 * @returns {string}
 */
export const formatDateRange = (start) => {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  
  return `${start.toLocaleDateString('es-MX', { 
    day: 'numeric', 
    month: 'long' 
  })} - ${end.toLocaleDateString('es-MX', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  })}`;
};

/**
 * Verifica si es hoy
 * @param {Date} date
 * @returns {boolean}
 */
export const checkIsToday = (date) => {
  const today = new Date();
  const check = new Date(date);
  
  return (
    check.getDate() === today.getDate() &&
    check.getMonth() === today.getMonth() &&
    check.getFullYear() === today.getFullYear()
  );
};