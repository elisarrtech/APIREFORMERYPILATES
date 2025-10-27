
/**
 * Date Utilities - Funciones auxiliares para manejo de fechas
 * Autor: @elisarrtech con Elite AI Architect
 */

import { 
  format, 
  parseISO, 
  startOfWeek, 
  addDays, 
  isToday,
  isSameDay,
  differenceInDays,
  differenceInHours,
  addWeeks,
  subWeeks,
  startOfDay,
  endOfDay
} from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Obtiene el lunes de la semana actual
 */
export const getMonday = (date = new Date()) => {
  return startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
};

/**
 * Obtiene los días de la semana (Lunes a Sábado)
 */
export const getWeekDays = (startDate) => {
  const monday = getMonday(startDate);
  const days = [];
  
  for (let i = 0; i < 6; i++) { // Lunes a Sábado (0-5)
    days.push(addDays(monday, i));
  }
  
  return days;
};

/**
 * Formatea fecha a texto legible
 */
export const formatDate = (date, formatStr = 'PPP') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
};

/**
 * Formatea hora
 */
export const formatTime = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm', { locale: es });
};

/**
 * Formatea fecha y hora
 */
export const formatDateTime = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'PPP HH:mm', { locale: es });
};

/**
 * Formatea fecha corta (ej: "24 Ene")
 */
export const formatShortDate = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'd MMM', { locale: es });
};

/**
 * Obtiene el nombre del día
 */
export const getDayName = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'EEEE', { locale: es });
};

/**
 * Verifica si es hoy
 */
export const checkIsToday = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
};

/**
 * Verifica si dos fechas son el mismo día
 */
export const checkIsSameDay = (date1, date2) => {
  const dateObj1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const dateObj2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(dateObj1, dateObj2);
};

/**
 * Obtiene días hasta una fecha
 */
export const getDaysUntil = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(dateObj, new Date());
};

/**
 * Obtiene horas hasta una fecha
 */
export const getHoursUntil = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return differenceInHours(dateObj, new Date());
};

/**
 * Obtiene semana siguiente
 */
export const getNextWeek = (date) => {
  return addWeeks(date, 1);
};

/**
 * Obtiene semana anterior
 */
export const getPreviousWeek = (date) => {
  return subWeeks(date, 1);
};

/**
 * Formatea rango de fechas (ej: "20-26 Ene 2025")
 */
export const formatDateRange = (startDate, endDate = null) => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = endDate 
    ? (typeof endDate === 'string' ? parseISO(endDate) : endDate)
    : addDays(start, 5); // Default: 6 días (lunes a sábado)
  
  const startDay = format(start, 'd', { locale: es });
  const endDay = format(end, 'd', { locale: es });
  const month = format(end, 'MMMM', { locale: es });
  const year = format(end, 'yyyy', { locale: es });
  
  return `${startDay}-${endDay} ${month} ${year}`;
};

/**
 * Convierte fecha a ISO string para API
 */
export const toISOString = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.toISOString();
};

/**
 * Obtiene inicio del día
 */
export const getStartOfDay = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfDay(dateObj);
};

/**
 * Obtiene fin del día
 */
export const getEndOfDay = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfDay(dateObj);
};

/**
 * Obtiene tiempo relativo (ej: "en 2 horas", "hace 3 días")
 */
export const getRelativeTime = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffInHours = differenceInHours(dateObj, now);
  
  if (diffInHours < 0) {
    // Pasado
    const absDiff = Math.abs(diffInHours);
    if (absDiff < 24) {
      return `hace ${absDiff} hora${absDiff !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(absDiff / 24);
      return `hace ${days} día${days !== 1 ? 's' : ''}`;
    }
  } else {
    // Futuro
    if (diffInHours < 24) {
      return `en ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `en ${days} día${days !== 1 ? 's' : ''}`;
    }
  }
};

export default {
  getMonday,
  getWeekDays,
  formatDate,
  formatTime,
  formatDateTime,
  formatShortDate,
  getDayName,
  checkIsToday,
  checkIsSameDay,
  getDaysUntil,
  getHoursUntil,
  getNextWeek,
  getPreviousWeek,
  formatDateRange,
  toISOString,
  getStartOfDay,
  getEndOfDay,
  getRelativeTime
};

