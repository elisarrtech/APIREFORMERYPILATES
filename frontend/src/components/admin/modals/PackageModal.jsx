import { useState, useEffect } from 'react';
import { INITIAL_PACKAGE_STATE } from '../../../utils/constants';

const PackageModal = ({ isOpen, onClose, onSubmit, packageData, isEdit = false }) => {
  const [formData, setFormData] = useState(INITIAL_PACKAGE_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (packageData) {
      setFormData({
        name: packageData.name || '',
        description: packageData.description || '',
        total_classes: packageData.total_classes || '',
        validity_days: packageData.validity_days || 30,
        price: packageData.price || '',
        active: packageData.active ?? true
      });
    } else {
      setFormData(INITIAL_PACKAGE_STATE);
    }
    setErrors({});
  }, [packageData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!formData.total_classes || formData.total_classes < 1) {
      newErrors.total_classes = 'Debe tener al menos 1 clase';
    } else if (formData.total_classes > 100) {
      newErrors.total_classes = 'Máximo 100 clases';
    }

    if (!formData.validity_days || formData.validity_days < 1) {
      newErrors.validity_days = 'La vigencia debe ser al menos 1 día';
    } else if (formData.validity_days > 365) {
      newErrors.validity_days = 'Máximo 365 días';
    }
    
    if (!formData.price || formData.price < 0) {
      newErrors.price = 'El precio debe ser mayor o igual a 0';
    } else if (formData.price > 999999) {
      newErrors.price = 'Precio máximo excedido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error submitting package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_PACKAGE_STATE);
    setErrors({});
    setLoading(false);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative mx-auto border w-full max-w-lg shadow-2xl rounded-2xl bg-white animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">📦</span>
              {isEdit ? 'Editar Paquete' : 'Crear Nuevo Paquete'}
            </h3>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nombre del Paquete <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={loading}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: PAQUETE BÁSICO"
              maxLength={100}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows="3"
              placeholder="Descripción del paquete (opcional)"
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {formData.description?.length || 0}/500
            </p>
          </div>

          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Total Clases */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Total de Clases <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.total_classes}
                onChange={(e) => handleChange('total_classes', e.target.value)}
                disabled={loading}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.total_classes ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="5"
              />
              {errors.total_classes && (
                <p className="mt-2 text-sm text-red-600">{errors.total_classes}</p>
              )}
            </div>

            {/* Vigencia */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Vigencia (días) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={formData.validity_days}
                onChange={(e) => handleChange('validity_days', e.target.value)}
                disabled={loading}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.validity_days ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="30"
              />
              {errors.validity_days && (
                <p className="mt-2 text-sm text-red-600">{errors.validity_days}</p>
              )}
            </div>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Precio ($) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500 font-bold text-lg">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                max="999999"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                disabled={loading}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="150.00"
              />
            </div>
            {errors.price && (
              <p className="mt-2 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Estado Activo */}
          <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
            <input
              type="checkbox"
              id="active-checkbox"
              checked={formData.active}
              onChange={(e) => handleChange('active', e.target.checked)}
              disabled={loading}
              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
            />
            <label htmlFor="active-checkbox" className="ml-3 text-sm font-bold text-gray-900 cursor-pointer select-none">
              ✅ Paquete Activo
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3.5 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? 'Actualizar Paquete' : 'Crear Paquete'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3.5 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageModal;