import { useState, useEffect } from 'react';

/**
 * AssignPackageModal - Modal para asignar paquetes a usuarios
 * @author @elisarrtech
 */
const AssignPackageModal = ({ isOpen, onClose, onSubmit, users, packages }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    package_id: '',
    price_paid: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ user_id: '', package_id: '', price_paid: '', notes: '' });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_id) newErrors.user_id = 'Selecciona un usuario';
    if (!formData.package_id) newErrors.package_id = 'Selecciona un paquete';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Error al asignar paquete' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  if (!isOpen) return null;

  const selectedPackage = packages?.find(p => p.id === parseInt(formData.package_id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-black">Asignar Paquete</h2>
                <p className="text-purple-100 text-sm font-medium">Asignar paquete a un alumno</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-bold">{errors.submit}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Alumno <span className="text-red-500">*</span>
            </label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.user_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona un alumno...</option>
              {users?.filter(u => u.role === 'client').map(user => (
                <option key={user.id} value={user.id}>
                  {user.full_name} - {user.email}
                </option>
              ))}
            </select>
            {errors.user_id && <p className="mt-2 text-sm text-red-600">{errors.user_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Paquete <span className="text-red-500">*</span>
            </label>
            <select
              name="package_id"
              value={formData.package_id}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.package_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona un paquete...</option>
              {packages?.filter(p => p.active).map(pkg => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - ${pkg.price} - {pkg.total_classes} clases
                </option>
              ))}
            </select>
            {errors.package_id && <p className="mt-2 text-sm text-red-600">{errors.package_id}</p>}
          </div>

          {selectedPackage && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-900 mb-2">Detalles del Paquete</h3>
              <p className="text-sm text-purple-700">Total de clases: {selectedPackage.total_classes}</p>
              <p className="text-sm text-purple-700">Vigencia: {selectedPackage.validity_days} días</p>
              <p className="text-sm text-purple-700">Precio: ${selectedPackage.price}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Precio Pagado</label>
            <input
              type="number"
              name="price_paid"
              value={formData.price_paid}
              onChange={handleChange}
              placeholder={selectedPackage ? `$${selectedPackage.price}` : 'Precio'}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Notas (opcional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Notas adicionales..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

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
                  Asignando...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Asignar Paquete
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignPackageModal;