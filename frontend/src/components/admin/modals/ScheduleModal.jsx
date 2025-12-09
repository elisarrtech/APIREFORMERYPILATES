import { useState, useEffect } from 'react';

/**
 * ScheduleModal - Modal Profesional para Crear/Editar Horarios
 * 
 * Features:
 * - Crear nuevo horario
 * - Editar horario existente
 * - Validación completa
 * - Formateo de fechas y horas
 * - Mensajes de error claros
 * - UI profesional
 * 
 * @version 2.0.0
 * @author @elisarrtech
 */
const ScheduleModal = ({ isOpen, onClose, onSubmit, scheduleData, isEdit = false, classes, instructors }) => {
  const [formData, setFormData] = useState({
    class_id: '',
    instructor_id: '',
    date: '',
    start_time: '',
    end_time: '',
    max_capacity: 10,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset/Load form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEdit && scheduleData) {
        // Modo edición: cargar datos existentes
        console.log('📝 [ScheduleModal] Cargando datos para edición:', scheduleData);
        
        setFormData({
          class_id: scheduleData.class_id || '',
          instructor_id: scheduleData.instructor_id || '',
          date: scheduleData.date || '',
          start_time: scheduleData.start_time ? scheduleData.start_time.substring(0, 5) : '',
          end_time: scheduleData.end_time ? scheduleData.end_time.substring(0, 5) : '',
          max_capacity: scheduleData.max_capacity || 10,
          notes: scheduleData.notes || ''
        });
      } else {
        // Modo creación: valores por defecto
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          class_id: '',
          instructor_id: '',
          date: today,
          start_time: '06:00',
          end_time: '07:00',
          max_capacity: 10,
          notes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, isEdit, scheduleData]);

  // Update max_capacity when class changes
  useEffect(() => {
    if (formData.class_id && classes && classes.length > 0) {
      const selectedClass = classes.find(c => c.id === parseInt(formData.class_id));
      if (selectedClass && !isEdit) { // Solo auto-llenar en modo creación
        setFormData(prev => ({
          ...prev,
          max_capacity: selectedClass.max_capacity || 10
        }));
      }
    }
  }, [formData.class_id, classes, isEdit]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.class_id) {
      newErrors.class_id = 'Debes seleccionar una clase';
    }

    if (!formData.instructor_id) {
      newErrors.instructor_id = 'Debes seleccionar un instructor';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'La hora de inicio es requerida';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'La hora de fin es requerida';
    }

    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
      newErrors.end_time = 'La hora de fin debe ser posterior a la hora de inicio';
    }

    if (!formData.max_capacity || formData.max_capacity < 1) {
      newErrors.max_capacity = 'La capacidad debe ser al menos 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting schedule:', error);
      setErrors({ submit: `Error al ${isEdit ? 'actualizar' : 'crear'} horario. Intenta de nuevo.` });
    } finally {
      setLoading(false);
    }
  };

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-black">
                  {isEdit ? 'Editar Horario' : 'Crear Horario'}
                </h2>
                <p className="text-purple-100 text-sm font-medium">
                  {isEdit ? 'Modifica la información del horario' : 'Programa una nueva clase'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Error Global */}
          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-shake">
              <p className="text-red-700 font-bold">{errors.submit}</p>
            </div>
          )}

          {/* Clase */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Clase <span className="text-red-500">*</span>
            </label>
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                errors.class_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona una clase...</option>
              {classes && classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.duration} min (Capacidad: {cls.max_capacity})
                </option>
              ))}
            </select>
            {errors.class_id && (
              <p className="mt-2 text-sm text-red-600">{errors.class_id}</p>
            )}
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Instructor <span className="text-red-500">*</span>
            </label>
            <select
              name="instructor_id"
              value={formData.instructor_id}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                errors.instructor_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona un instructor...</option>
              {instructors && instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.full_name} - {instructor.email}
                </option>
              ))}
            </select>
            {errors.instructor_id && (
              <p className="mt-2 text-sm text-red-600">{errors.instructor_id}</p>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-2 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hora de Inicio */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Hora de Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.start_time ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.start_time && (
                <p className="mt-2 text-sm text-red-600">{errors.start_time}</p>
              )}
            </div>

            {/* Hora de Fin */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Hora de Fin <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.end_time ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.end_time && (
                <p className="mt-2 text-sm text-red-600">{errors.end_time}</p>
              )}
            </div>
          </div>

          {/* Capacidad Máxima */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Capacidad Máxima <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="max_capacity"
              value={formData.max_capacity}
              onChange={handleChange}
              min="1"
              max="50"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                errors.max_capacity ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.max_capacity && (
              <p className="mt-2 text-sm text-red-600">{errors.max_capacity}</p>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              maxLength="500"
              placeholder="Notas adicionales sobre el horario..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.notes.length}/500
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEdit ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? 'Actualizar Horario' : 'Crear Horario'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;