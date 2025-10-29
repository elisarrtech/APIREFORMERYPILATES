import { useState, useEffect } from 'react';

/**
 * ClassModal - Modal Profesional para Crear/Editar Clases
 * 
 * Features:
 * - Crear nueva clase
 * - Editar clase existente
 * - Validación completa
 * - Mensajes de error claros
 * - UI profesional
 * 
 * @version 2.0.0
 * @author @elisarrtech
 */
const ClassModal = ({ isOpen, onClose, onSubmit, classData, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 50,
    max_capacity: 10,
    category: 'grupal',
    intensity_level: 'media',
    active: true
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset/Load form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEdit && classData) {
        console.log('📝 [ClassModal] Cargando datos para edición:', classData);
        setFormData({
          name: classData.name || '',
          description: classData.description || '',
          duration: classData.duration || 50,
          max_capacity: classData.max_capacity || 10,
          category: classData.category || 'grupal',
          intensity_level: classData.intensity_level || 'media',
          active: classData.active !== undefined ? classData.active : true
        });
      } else {
        setFormData({
          name: '',
          description: '',
          duration: 50,
          max_capacity: 10,
          category: 'grupal',
          intensity_level: 'media',
          active: true
        });
      }
      setErrors({});
    }
  }, [isOpen, isEdit, classData]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.duration || formData.duration < 15 || formData.duration > 120) {
      newErrors.duration = 'La duración debe estar entre 15 y 120 minutos';
    }

    if (!formData.max_capacity || formData.max_capacity < 1 || formData.max_capacity > 50) {
      newErrors.max_capacity = 'La capacidad debe estar entre 1 y 50 personas';
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
      console.error('Error submitting class:', error);
      setErrors({ submit: `Error al ${isEdit ? 'actualizar' : 'crear'} clase. Intenta de nuevo.` });
    } finally {
      setLoading(false);
    }
  };

  // Handle change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-black">
                  {isEdit ? 'Editar Clase' : 'Nueva Clase'}
                </h2>
                <p className="text-blue-100 text-sm font-medium">
                  {isEdit ? 'Modifica la información de la clase' : 'Crea una nueva clase de Pilates'}
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

          {/* Nombre */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nombre de la Clase <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: PLT FIT, PLT BLAST, etc."
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Descripción detallada de la clase..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Duración y Capacidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Duración (minutos) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="15"
                max="120"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.duration ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.duration && (
                <p className="mt-2 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>

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
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.max_capacity ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.max_capacity && (
                <p className="mt-2 text-sm text-red-600">{errors.max_capacity}</p>
              )}
            </div>
          </div>

          {/* Categoría e Intensidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="grupal">👥 Grupal</option>
                <option value="privada">👤 Privada</option>
                <option value="semiprivada">👥 Semiprivada</option>
                <option value="especial">⭐ Especial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nivel de Intensidad <span className="text-red-500">*</span>
              </label>
              <select
                name="intensity_level"
                value={formData.intensity_level}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="baja">🟢 Baja</option>
                <option value="media">🟡 Media</option>
                <option value="alta">🔴 Alta</option>
              </select>
            </div>
          </div>

          {/* Estado Activo */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="active" className="text-sm font-bold text-gray-700 cursor-pointer">
              Clase activa (visible para clientes)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
                  {isEdit ? 'Actualizar Clase' : 'Crear Clase'}
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

export default ClassModal;