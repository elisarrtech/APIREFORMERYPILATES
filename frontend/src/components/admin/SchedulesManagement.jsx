import { useState } from 'react';

/**
 * SchedulesManagement - Gestión Profesional de Horarios
 * 
 * Features:
 * - Lista de horarios con información completa
 * - Formateo correcto de fechas y horas
 * - Botones de editar y cancelar funcionales
 * - Estados visuales (Disponible, Cancelado, Completo)
 * - Confirmaciones antes de cancelar
 * - UI profesional y responsiva
 * 
 * @version 2.0.0
 * @author @elisarrtech
 */
const SchedulesManagement = ({ schedules, onCreateSchedule, onEditSchedule, onCancelSchedule }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Función para formatear fecha y hora profesionalmente
  const formatDateTime = (dateStr, timeStr) => {
    try {
      if (!dateStr || !timeStr) return 'Fecha no disponible';
      
      // Parsear fecha
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      // Formatear fecha en español
      const dateFormatted = date.toLocaleDateString('es-MX', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      // Formatear hora
      const timeFormatted = timeStr.substring(0, 5); // "HH:MM"
      
      return `${dateFormatted} ${timeFormatted}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error en fecha';
    }
  };

  // Función para obtener el badge de estado
  const getStatusBadge = (schedule) => {
    if (!schedule.active || schedule.status === 'cancelled') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Cancelado
        </span>
      );
    }
    
    if (schedule.status === 'completed') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Completado
        </span>
      );
    }
    
    if (schedule.current_capacity >= schedule.max_capacity) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Lleno
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Disponible
      </span>
    );
  };

  // Handle cancel con confirmación
  const handleCancel = (schedule) => {
    if (window.confirm(`¿Estás seguro de cancelar el horario de ${schedule.class_name} el ${formatDateTime(schedule.date, schedule.start_time)}?`)) {
      onCancelSchedule(schedule);
    }
  };

  // Filtrar schedules
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      schedule.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && schedule.active && schedule.status === 'scheduled') ||
      (filterStatus === 'cancelled' && (!schedule.active || schedule.status === 'cancelled')) ||
      (filterStatus === 'completed' && schedule.status === 'completed');
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <span className="text-4xl">📅</span>
            Gestión de Horarios
          </h2>
          <p className="text-gray-600 mt-1 font-medium">
            Administra los horarios de clases programadas
          </p>
        </div>
        <button
          onClick={onCreateSchedule}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Horario
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por clase o instructor..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="cancelled">Cancelados</option>
              <option value="completed">Completados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schedules Table */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
          <div className="inline-block p-6 bg-purple-100 rounded-full mb-4">
            <svg className="w-16 h-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay horarios programados</h3>
          <p className="text-gray-600 mb-6">Comienza creando tu primer horario de clase</p>
          <button
            onClick={onCreateSchedule}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            Crear Primer Horario
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-purple-600 to-purple-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">CLASE</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">INSTRUCTOR</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">FECHA/HORA</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">CUPO</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">ESTADO</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.map((schedule, index) => (
                  <tr 
                    key={schedule.id} 
                    className={`hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🏋️</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{schedule.class_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{schedule.instructor_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDateTime(schedule.date, schedule.start_time)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Hasta {schedule.end_time ? schedule.end_time.substring(0, 5) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold text-gray-900">
                          {schedule.current_capacity}/{schedule.max_capacity}
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${(schedule.current_capacity / schedule.max_capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(schedule)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => onEditSchedule && onEditSchedule(schedule)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-bold transition-all"
                        title="Editar horario"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleCancel(schedule)}
                        disabled={!schedule.active || schedule.status === 'cancelled'}
                        className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Cancelar horario"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Statistics Footer */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-black text-purple-600">{schedules.length}</p>
            <p className="text-sm font-bold text-gray-600">Total Horarios</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-green-600">
              {schedules.filter(s => s.active && s.status === 'scheduled').length}
            </p>
            <p className="text-sm font-bold text-gray-600">Activos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-red-600">
              {schedules.filter(s => !s.active || s.status === 'cancelled').length}
            </p>
            <p className="text-sm font-bold text-gray-600">Cancelados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-blue-600">
              {schedules.filter(s => s.status === 'completed').length}
            </p>
            <p className="text-sm font-bold text-gray-600">Completados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulesManagement;