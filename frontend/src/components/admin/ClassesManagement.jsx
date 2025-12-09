import { useState } from 'react';

/**
 * ClassesManagement - Gestión Profesional de Clases de Pilates
 * 
 * Features:
 * - Lista de clases con información completa
 * - Crear nueva clase
 * - Editar clase existente
 * - Activar/Desactivar clases
 * - Filtros y búsqueda
 * - UI profesional y responsiva
 * 
 * @version 2.0.0
 * @author @elisarrtech
 */
const ClassesManagement = ({ classes, onCreateClass, onEditClass, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Función para obtener el badge de categoría
  const getCategoryBadge = (category) => {
    const badges = {
      grupal: { color: 'bg-blue-100 text-blue-800', icon: '👥', label: 'Grupal' },
      privada: { color: 'bg-purple-100 text-purple-800', icon: '👤', label: 'Privada' },
      semiprivada: { color: 'bg-indigo-100 text-indigo-800', icon: '👥', label: 'Semiprivada' },
      especial: { color: 'bg-pink-100 text-pink-800', icon: '⭐', label: 'Especial' },
    };

    const badge = badges[category] || badges.grupal;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
        <span className="mr-1">{badge.icon}</span>
        {badge.label}
      </span>
    );
  };

  // Función para obtener el badge de intensidad
  const getIntensityBadge = (intensity) => {
    const badges = {
      baja: { color: 'bg-green-100 text-green-800', label: 'Baja' },
      media: { color: 'bg-yellow-100 text-yellow-800', label: 'Media' },
      alta: { color: 'bg-red-100 text-red-800', label: 'Alta' },
    };

    const badge = badges[intensity] || badges.media;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  // Handle toggle status con confirmación
  const handleToggleStatus = (classItem) => {
    const action = classItem.active ? 'desactivar' : 'activar';
    if (window.confirm(`¿Estás seguro de ${action} la clase "${classItem.name}"?`)) {
      onToggleStatus(classItem);
    }
  };

  // Filtrar classes
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || classItem.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <span className="text-4xl">🏋️</span>
            Gestión de Clases
          </h2>
          <p className="text-gray-600 mt-1 font-medium">
            Administra las clases de Pilates Reformer disponibles
          </p>
        </div>
        <button
          onClick={onCreateClass}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Clase
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre de clase..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las categorías</option>
              <option value="grupal">Grupal</option>
              <option value="privada">Privada</option>
              <option value="semiprivada">Semiprivada</option>
              <option value="especial">Especial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Classes Table */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
          <div className="inline-block p-6 bg-blue-100 rounded-full mb-4">
            <svg className="w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay clases disponibles</h3>
          <p className="text-gray-600 mb-6">Comienza creando tu primera clase de Pilates</p>
          <button
            onClick={onCreateClass}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            Crear Primera Clase
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">CLASE</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">CATEGORÍA</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">DURACIÓN</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">CAPACIDAD</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">INTENSIDAD</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">ESTADO</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClasses.map((classItem, index) => (
                  <tr 
                    key={classItem.id} 
                    className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🏋️</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{classItem.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{classItem.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryBadge(classItem.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{classItem.duration} min</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{classItem.max_capacity} personas</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getIntensityBadge(classItem.intensity_level)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        classItem.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {classItem.active ? '✓ Activo' : '✗ Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => onEditClass(classItem)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-bold transition-all"
                        title="Editar clase"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleStatus(classItem)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg font-bold transition-all ${
                          classItem.active
                            ? 'bg-red-100 hover:bg-red-200 text-red-700'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                        title={classItem.active ? 'Desactivar clase' : 'Activar clase'}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={classItem.active ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"} />
                        </svg>
                        {classItem.active ? 'Desactivar' : 'Activar'}
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
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-black text-blue-600">{classes.length}</p>
            <p className="text-sm font-bold text-gray-600">Total Clases</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-green-600">
              {classes.filter(c => c.active).length}
            </p>
            <p className="text-sm font-bold text-gray-600">Activas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-red-600">
              {classes.filter(c => !c.active).length}
            </p>
            <p className="text-sm font-bold text-gray-600">Inactivas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-purple-600">
              {classes.filter(c => c.category === 'grupal').length}
            </p>
            <p className="text-sm font-bold text-gray-600">Grupales</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesManagement;