
/**
 * Weekly Calendar - Calendario Semanal de Clases
 * Autor: @elisarrtech con Elite AI Architect
 * Código de Élite Mundial - Production Ready
 * 
 * Funcionalidades:
 * - Vista semanal (Lunes a Sábado)
 * - Navegación entre semanas
 * - Reserva de clases
 * - Cancelación de reservas
 * - Estados visuales (disponible, lleno, reservado)
 * - Responsive design
 */

import React, { useState, useEffect } from 'react';
import { reservationsService } from '@services/api';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaCalendarDay,
  FaPlus,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle
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

const WeeklyCalendar = ({ onReservationChange }) => {
  // Estado
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday());
  const [schedules, setSchedules] = useState([]);
  const [packageStatus, setPackageStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  /**
   * Cargar datos del calendario
   */
  useEffect(() => {
    loadCalendarData();
  }, [currentWeekStart]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      const [schedulesRes, packageRes] = await Promise.all([
        reservationsService.getWeeklySchedule(toISOString(currentWeekStart)),
        reservationsService.getPackageStatus()
      ]);

      setSchedules(schedulesRes.data.data || []);
      setPackageStatus(packageRes.data.data || null);
    } catch (error) {
      console.error('Error cargando calendario:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navegar a semana anterior
   */
  const goToPreviousWeek = () => {
    setCurrentWeekStart(getPreviousWeek(currentWeekStart));
  };

  /**
   * Navegar a semana siguiente
   */
  const goToNextWeek = () => {
    setCurrentWeekStart(getNextWeek(currentWeekStart));
  };

  /**
   * Ir a semana actual
   */
  const goToCurrentWeek = () => {
    setCurrentWeekStart(getMonday());
  };

  /**
   * Manejar reserva
   */
  const handleReserve = async (scheduleId) => {
    try {
      await reservationsService.createReservation(scheduleId);
      await loadCalendarData();
      if (onReservationChange) onReservationChange();
      setSelectedSchedule(null);
    } catch (error) {
      console.error('Error reservando:', error);
      const errors = error.response?.data?.errors || ['Error al reservar'];
      alert(errors.join('\n'));
    }
  };

  /**
   * Manejar cancelación
   */
  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      return;
    }

    try {
      await reservationsService.cancelReservation(reservationId);
      await loadCalendarData();
      if (onReservationChange) onReservationChange();
      setSelectedSchedule(null);
    } catch (error) {
      console.error('Error cancelando:', error);
      const errors = error.response?.data?.errors || ['Error al cancelar'];
      alert(errors.join('\n'));
    }
  };

  /**
   * Obtener horarios para un día y hora específicos
   */
  const getSchedulesForDayAndHour = (dayIndex, hour) => {
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
  };

  const weekDays = getWeekDays(currentWeekStart);
  const canReserve = packageStatus?.has_active_package && packageStatus?.remaining_classes > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando calendario...</p>
        </div>
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
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaChevronLeft />
          </button>

          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800">
              {formatDateRange(currentWeekStart)}
            </h3>
            <button
              onClick={goToCurrentWeek}
              className="text-sm text-primary-600 hover:text-primary-700 mt-1"
            >
              <FaCalendarDay className="inline mr-1" />
              Ir a Semana Actual
            </button>
          </div>

          <button
            onClick={goToNextWeek}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-primary-500 text-white">
              <th className="border p-3 text-left w-20">Hora</th>
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
                      <div className="text-xs mt-1">HOY</div>
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
                    <td key={dayIndex} className="border p-2 align-top">
                      <div className="space-y-2">
                        {daySchedules.map((schedule) => (
                          <ClassCard
                            key={schedule.id}
                            schedule={schedule}
                            canReserve={canReserve}
                            onReserve={handleReserve}
                            onCancel={handleCancelReservation}
                            onClick={() => setSelectedSchedule(schedule)}
                          />
                        ))}
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
        />
      )}
    </div>
  );
};

/**
 * Card de Clase en el Calendario
 */
const ClassCard = ({ schedule, canReserve, onReserve, onCancel, onClick }) => {
  const hasReserved = schedule.user_has_reserved;
  const isFull = schedule.is_full;
  const canBook = canReserve && !hasReserved && !isFull;

  return (
    <div
      onClick={onClick}
      className="p-2 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition"
      style={{ 
        borderColor: schedule.class_color,
        backgroundColor: `${schedule.class_color}15`
      }}
    >
      <div className="text-xs font-bold text-gray-800 truncate">
        {schedule.class_name}
      </div>
      <div className="text-xs text-gray-600 mt-1 truncate">
        👨‍🏫 {schedule.instructor_name}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {formatTime(schedule.start_time)}
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">
          {schedule.available_spots} cupos
        </span>
        
        {hasReserved ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel(schedule.reservation_id);
            }}
            className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1"
          >
            <FaTimes className="text-[10px]" />
            Cancelar
          </button>
        ) : canBook ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReserve(schedule.id);
            }}
            className="text-xs px-2 py-1 rounded bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-1"
          >
            <FaPlus className="text-[10px]" />
            Reservar
          </button>
        ) : (
          <span className="text-xs text-gray-400">
            {isFull ? 'Lleno' : 'No disponible'}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Modal de Detalles de Clase
 */
const ClassDetailModal = ({ schedule, canReserve, onClose, onReserve, onCancel }) => {
  const hasReserved = schedule.user_has_reserved;
  const isFull = schedule.is_full;
  const canBook = canReserve && !hasReserved && !isFull;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {schedule.class_name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {schedule.class_description || 'Clase de Pilates'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Detalles */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Instructor:</span>
            <span>{schedule.instructor_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Horario:</span>
            <span>
              {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Duración:</span>
            <span>{schedule.duration} minutos</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Disponibilidad:</span>
            <span>
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
              className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition flex items-center justify-center gap-2"
            >
              <FaTimes />
              Cancelar Reserva
            </button>
          ) : canBook ? (
            <button
              onClick={() => {
                onReserve(schedule.id);
                onClose();
              }}
              className="flex-1 px-4 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition flex items-center justify-center gap-2"
            >
              <FaCheckCircle />
              Confirmar Reserva
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-4 py-3 rounded-lg bg-gray-300 text-gray-600 font-medium cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaExclamationCircle />
              {isFull ? 'Clase Llena' : 'No Disponible'}
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
```
