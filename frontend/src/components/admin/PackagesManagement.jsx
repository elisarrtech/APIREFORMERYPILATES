import React from 'react';
import { formatCurrency } from '../../utils/helpers';

/**
 * Componente profesional de gestión de paquetes
 * Vista en cards optimizada para UX
 */
const PackagesManagement = ({ packages, onCreatePackage, onEditPackage, onToggleStatus }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Paquetes</h2>
          <p className="text-gray-600 mt-1">Administra los paquetes de clases disponibles</p>
        </div>
        <button
          onClick={onCreatePackage}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Paquete
        </button>
      </div>

      {/* Grid de Paquetes */}
      {packages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 font-medium text-lg">No hay paquetes disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:border-primary-400"
            >
              {/* Header del Card */}
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-gray-900 flex-1">
                  {pkg.name}
                </h4>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  pkg.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {pkg.active ? '✓ Activo' : '✗ Inactivo'}
                </span>
              </div>

              {/* Descripción */}
              <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                {pkg.description || 'Sin descripción'}
              </p>

              {/* Detalles */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">📚 Clases:</span>
                  <span className="font-bold text-gray-900">{pkg.total_classes}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">⏰ Vigencia:</span>
                  <span className="font-bold text-gray-900">{pkg.validity_days} días</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                  <span className="text-sm font-medium text-primary-700">💰 Precio:</span>
                  <span className="font-bold text-primary-900 text-lg">
                    {formatCurrency(pkg.price)}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEditPackage(pkg)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg border border-blue-300 transition-all duration-200"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => onToggleStatus(pkg)}
                  className={`flex-1 ${
                    pkg.active
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg`}
                >
                  {pkg.active ? '🚫 Desactivar' : '✅ Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackagesManagement;