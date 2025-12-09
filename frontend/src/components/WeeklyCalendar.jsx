
/**
 * Weekly Calendar - Calendario Semanal de Clases
 * Autor: @elisarrtech con Elite AI Architect
 * Versión: 2.0.1 - Optimizado y mejorado
 * Código de Élite Mundial - Production Ready
 * 
 * Funcionalidades:
 * - Vista semanal (Lunes a Sábado)
 * - Navegación entre semanas con teclado (← →)
 * - Reserva de clases con confirmación
 * - Cancelación de reservas con razón opcional
 * - Estados visuales (disponible, lleno, reservado, pasado)
 * - Responsive design completo
 * - Manejo de errores profesional
 * - Loading states optimizados
 * - Accessibility (ARIA labels, keyboard navigation)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { reservationsService, formatApiError } from '@services/api';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaCalendarDay,
  FaPlus,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaUsers,
  FaInfoCircle
} from 'react-icons/fa';
import { 
  getMonday,
  getWeekDays,
  formatShortDate,
  getDayName,
  formatTime,
  toISOString,
  getNextWeek,
  getPreviousWeek,
  formatDateRange,
  checkIsToday
} from '@utils/dateUtils';
import { WEEK_DAYS, AVAILABLE_HOURS } from '@utils/constants';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const WeeklyCalendar = ({ onReservationChange }) => {
  // ========== ESTADO ==========
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday());
  const [schedules, setSchedules] = useState([]);
  const [packageStatus, setPackageStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========== CARGAR DATOS ==========
  
  /**
   * Cargar datos del calendario
   * Optimizado con useCallback para evitar re-renders innecesarios
   */
  const loadCalendarData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Formatear fecha en YYYY-MM-DD
      const startDateStr = toISOString(currentWeekStart).split('T')[0];
      
      // Llamadas paralelas para optimizar performance
      const [schedulesRes, packageRes] = await Promise.all([
        reservationsService.getWeeklySchedule(startDateStr, 7),
        reservationsService.getPackageStatus()
      ]);

      // Validar respuestas
      if (!schedulesRes?.data?.success) {
        throw new Error('Error al cargar horarios');
      }
      if (!packageRes?.data?.success) {
        throw new Error('Error al cargar estado de paquete');
      }

      setSchedules(schedulesRes.data.data || []);
      setPackageStatus(packageRes.data.data || null);
      
    } catch (error) {
      console.error('❌ Error cargando calendario:', error);
      const formattedError = formatApiError(error);
      setError(formattedError.message);
      
      // Notificación al usuario
      if (formattedError.type === 'network') {
        alert('Error de conexión. Por favor, verifica tu internet.');
      }
    } finally {
      setLoading(false);
    }
  }, [currentWeekStart]);

  // Cargar datos cuando cambia la semana
  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  // ========== NAVEGACIÓN ==========

  /**
   * Navegar a semana anterior
   */
  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekStart(prev => getPreviousWeek(prev));
  }, []);

  /**
   * Navegar a semana siguiente
   */
  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => getNextWeek(prev));
  }, []);

  /**
   * Ir a semana actual
   */
  const goToCurrentWeek = useCallback(() => {
    setCurrentWeekStart(getMonday());
  }, []);

  // ========== KEYBOARD NAVIGATION ==========
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      // No interceptar si está escribiendo en un input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowLeft') {
        goToPreviousWeek();
      } else if (e.key === 'ArrowRight') {
        goToNextWeek();
      } else if (e.key === 'h' || e.key === 'H') {
        goToCurrentWeek();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToPreviousWeek, goToNextWeek, goToCurrentWeek]);

  // ========== ACCIONES DE RESERVA ==========

  /**
   * Manejar reserva de clase
   */
  const handleReserve = useCallback(async (scheduleId) => {
    // Validar que el usuario pueda reservar
    if (!packageStatus?.has_active_package) {
      alert('No tienes un paquete activo. Por favor, adquiere uno para reservar clases.');
      return;
    }

    if (packageStatus?.remaining_classes <= 0) {
      alert('No te quedan clases disponibles en tu paquete. Adquiere uno nuevo.');
      return;
    }

    setActionLoading(true);
    
    try {
      const response = await reservationsService.createReservation(scheduleId);
      
      if (response.data.success) {
        // Recargar datos
        await loadCalendarData();
        
        // Notificar callback padre
        if (onReservationChange) {
          onReservationChange();
        }
        
        // Cerrar modal
        setSelectedSchedule(null);
        
        // Notificación de éxito
        const remainingClasses = response.data.data.remaining_classes;
        alert(`✅ Reserva confirmada exitosamente!\n\nClases restantes: ${remainingClasses}`);
      }
    } catch (error) {
      console.error('❌ Error al reservar:', error);
      const formattedError = formatApiError(error);
      
      // Mostrar mensaje específico del servidor
      const message = formattedError.data?.message || formattedError.message;
      alert(`❌ Error al reservar:\n\n${message}`);
    } finally {
      setActionLoading(false);
    }
  }, [packageStatus, loadCalendarData, onReservationChange]);

  /**
   * Manejar cancelación de reserva
   */
  const handleCancelReservation = useCallback(async (reservationId, reason = null) => {
    // Confirmación del usuario
    const confirmed = window.confirm(
      '¿Estás seguro de cancelar esta reserva?\n\n' +
      'La clase será devuelta a tu paquete.'
    );
    
    if (!confirmed) {
      return;
    }

    setActionLoading(true);

    try {
      const response = await reservationsService.cancelReservation(reservationId, reason);
      
      if (response.data.success) {
        // Recargar datos
        await loadCalendarData();
        
        // Notificar callback padre
        if (onReservationChange) {
          onReservationChange();
        }
        
        // Cerrar modal
        setSelectedSchedule(null);
        
        // Notificación de éxito
        const remainingClasses = response.data.data?.remaining_classes;
        alert(`✅ Reserva cancelada exitosamente!\n\nClases restantes: ${remainingClasses || packageStatus?.remaining_classes + 1}`);
      }
    } catch (error) {
      console.error('❌ Error al cancelar:', error);
      const formattedError = formatApiError(error);
      
      const message = formattedError.data?.message || formattedError.message;
      alert(`❌ Error al cancelar:\n\n${message}`);
    } finally {
      setActionLoading(false);
    }
  }, [loadCalendarData, onReservationChange, packageStatus]);

  // ========== UTILIDADES ==========

  /**
   * Obtener horarios para un día y hora específicos
   * Memoizado para optimizar performance
   */
  const getSchedulesForDayAndHour = useCallback((dayIndex, hour) => {
    const weekDays = getWeekDays(currentWeekStart);
    const targetDate = weekDays[dayIndex];

    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.start_time);
      const scheduleHour = scheduleDate.getHours().toString().padStart(2, '0') + ':00';
      
      return (
        scheduleDate.toDateString() === targetDate.toDateString() &&
        scheduleHour === hour
      );
    });
  }, [schedules, currentWeekStart]);

  // ========== VALORES COMPUTADOS ==========

  const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart]);
  const canReserve = useMemo(
    () => packageStatus?.has_active_package && packageStatus?.remaining_classes > 0,
    [packageStatus]
  );

  // ========== RENDERIZADO ==========

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando calendario...</p>
          <p className="text-sm text-gray-500 mt-2">Obteniendo horarios disponibles</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <FaExclamationCircle className="text-4xl text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-800 mb-2">Error al cargar calendario</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadCalendarData}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Navegación de semana */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousWeek}
            className="p-2 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Semana anterior"
            title="Semana anterior (←)"
          >
            <FaChevronLeft />
          </button>

          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800">
              {formatDateRange(currentWeekStart)}
            </h3>
            <button
              onClick={goToCurrentWeek}
              className="text-sm text-primary-600 hover:text-primary-700 mt-1 focus:outline-none focus:underline"
              title="Ir a semana actual (H)"
            >
              <FaCalendarDay className="inline mr-1" />
              Ir a Semana Actual
            </button>
          </div>

          <button
            onClick={goToNextWeek}
            className="p-2 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Semana siguiente"
            title="Semana siguiente (→)"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Info de paquete */}
        {packageStatus && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg text-center">
            {packageStatus.has_active_package ? (
              <div className="flex items-center justify-center gap-2">
                <FaCheckCircle className="text-primary-600" />
                <span className="text-sm font-medium text-primary-800">
                  Tienes {packageStatus.remaining_classes} clase{packageStatus.remaining_classes !== 1 ? 's' : ''} disponible{packageStatus.remaining_classes !== 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FaExclamationCircle className="text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  No tienes un paquete activo
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-primary-500 text-white">
              <th className="border p-3 text-left w-20">
                <FaClock className="inline mr-1" />
                Hora
              </th>
              {WEEK_DAYS.map((day, idx) => {
                const date = weekDays[idx];
                const isToday = checkIsToday(date);
                
                return (
                  <th 
                    key={idx} 
                    className={`border p-3 text-center ${isToday ? 'bg-primary-600' : ''}`}
                  >
                    <div className="font-bold">{day}</div>
                    <div className="text-sm font-normal opacity-90">
                      {formatShortDate(date)}
                    </div>
                    {isToday && (
                      <div className="text-xs mt-1 bg-white/20 rounded px-2 py-1 inline-block">
                        HOY
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {AVAILABLE_HOURS.map((hour) => (
              <tr key={hour} className="hover:bg-gray-50">
                <td className="border p-3 font-medium text-gray-600 align-top bg-gray-50">
                  {hour}
                </td>
                {WEEK_DAYS.map((_, dayIndex) => {
                  const daySchedules = getSchedulesForDayAndHour(dayIndex, hour);
                  
                  return (
                    <td key={dayIndex} className="border p-2 align-top min-h-[80px]">
                      <div className="space-y-2">
                        {daySchedules.length > 0 ? (
                          daySchedules.map((schedule) => (
                            <ClassCard
                              key={schedule.id}
                              schedule={schedule}
                              canReserve={canReserve}
                              onReserve={handleReserve}
                              onCancel={handleCancelReservation}
                              onClick={() => setSelectedSchedule(schedule)}
                              disabled={actionLoading}
                            />
                          ))
                        ) : (
                          <div className="text-center text-xs text-gray-400 py-2">
                            Sin clases
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {selectedSchedule && (
        <ClassDetailModal
          schedule={selectedSchedule}
          canReserve={canReserve}
          onClose={() => setSelectedSchedule(null)}
          onReserve={handleReserve}
          onCancel={handleCancelReservation}
          loading={actionLoading}
        />
      )}

      {/* Leyenda */}
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FaInfoCircle className="text-primary-500" />
          Leyenda
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-500 rounded"></div>
            <span className="text-gray-600">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Tu reserva</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Lleno</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span className="text-gray-600">No disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE: CLASS CARD
// ==========================================

/**
 * Card de Clase en el Calendario
 */
const ClassCard = React.memo(({ schedule, canReserve, onReserve, onCancel, onClick, disabled }) => {
  const hasReserved = schedule.user_has_reserved;
  const isFull = schedule.is_full;
  const isPast = new Date(schedule.start_time) < new Date();
  const canBook = canReserve && !hasReserved && !isFull && !isPast;

  // Determinar color de borde según estado
  const getBorderColor = () => {
    if (hasReserved) return '#10b981'; // green-500
    if (isFull) return '#ef4444'; // red-500
    if (isPast) return '#9ca3af'; // gray-400
    return schedule.class_color || '#8BA88D';
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        p-2 rounded-lg border-l-4 transition-all
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-md'}
        ${isPast ? 'opacity-60' : ''}
      `}
      style={{ 
        borderColor: getBorderColor(),
        backgroundColor: `${getBorderColor()}15`
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Clase ${schedule.class_name} con ${schedule.instructor_name}`}
    >
      <div className="text-xs font-bold text-gray-800 truncate">
        {schedule.class_name}
      </div>
      <div className="text-xs text-gray-600 mt-1 truncate">
        👨‍🏫 {schedule.instructor_name}
      </div>
      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
        <FaClock className="text-[10px]" />
        {formatTime(schedule.start_time)}
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <FaUsers className="text-[10px]" />
          {schedule.available_spots}
        </span>
        
        {hasReserved ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) onCancel(schedule.reservation_id);
            }}
            disabled={disabled}
            className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Cancelar reserva"
          >
            <FaTimes className="text-[10px]" />
            Cancelar
          </button>
        ) : canBook ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) onReserve(schedule.id);
            }}
            disabled={disabled}
            className="text-xs px-2 py-1 rounded bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Reservar clase"
          >
            <FaPlus className="text-[10px]" />
            Reservar
          </button>
        ) : (
          <span className="text-xs text-gray-400">
            {isPast ? 'Pasada' : isFull ? 'Lleno' : 'No disponible'}
          </span>
        )}
      </div>
    </div>
  );
});

ClassCard.displayName = 'ClassCard';

// ==========================================
// COMPONENTE: CLASS DETAIL MODAL
// ==========================================

/**
 * Modal de Detalles de Clase
 */
const ClassDetailModal = ({ schedule, canReserve, onClose, onReserve, onCancel, loading }) => {
  const hasReserved = schedule.user_has_reserved;
  const isFull = schedule.is_full;
  const isPast = new Date(schedule.start_time) < new Date();
  const canBook = canReserve && !hasReserved && !isFull && !isPast;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 id="modal-title" className="text-xl font-bold text-gray-800">
              {schedule.class_name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {schedule.class_description || 'Clase de Pilates'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Cerrar modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Detalles */}
        <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700 w-28">Instructor:</span>
            <span className="text-gray-900">{schedule.instructor_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700 w-28">Horario:</span>
            <span className="text-gray-900">
              {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700 w-28">Duración:</span>
            <span className="text-gray-900">{schedule.duration} minutos</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700 w-28">Disponibilidad:</span>
            <span className={`font-semibold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
              {schedule.available_spots} de {schedule.max_capacity} cupos
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          {hasReserved ? (
            <button
              onClick={() => {
                onCancel(schedule.reservation_id);
                onClose();
              }}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Cancelando...
                </>
              ) : (
                <>
                  <FaTimes />
                  Cancelar Reserva
                </>
              )}
            </button>
          ) : canBook ? (
            <button
              onClick={() => {
                onReserve(schedule.id);
                onClose();
              }}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Reservando...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Confirmar Reserva
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-4 py-3 rounded-lg bg-gray-300 text-gray-600 font-medium cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaExclamationCircle />
              {isPast ? 'Clase Pasada' : isFull ? 'Clase Llena' : 'No Disponible'}
            </button>
          )}
          
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;