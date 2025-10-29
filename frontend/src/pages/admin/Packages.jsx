{packages.map((pkg) => (
  <div
    key={pkg.id}
    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
  >
    {/* Header con título y badge */}
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
          pkg.status === 'active'
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}
      >
        ✓ {pkg.status === 'active' ? 'Activo' : 'Inactivo'}
      </span>
    </div>

    {/* Descripción */}
    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>

    {/* Info Grid */}
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-3 text-sm">
        <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
          <span className="text-lg">📚</span>
        </div>
        <div>
          <span className="text-gray-500">Clases:</span>
          <span className="ml-2 font-bold text-gray-800">{pkg.classes}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-lg">⏱️</span>
        </div>
        <div>
          <span className="text-gray-500">Vigencia:</span>
          <span className="ml-2 font-bold text-gray-800">{pkg.validity} días</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
          <span className="text-lg">💰</span>
        </div>
        <div>
          <span className="text-gray-500">Precio:</span>
          <span className="ml-2 font-bold text-gray-800">${pkg.price}</span>
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      <button
        onClick={() => handleEdit(pkg.id)}
        className="flex-1 px-4 py-2.5 bg-sage-100 hover:bg-sage-200 text-sage-700 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-sage-200"
      >
        <span className="text-base">✏️</span>
        Editar
      </button>
      <button
        onClick={() => handleToggleStatus(pkg.id, pkg.status)}
        className={`flex-1 px-4 py-2.5 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border ${
          pkg.status === 'active'
            ? 'bg-red-100 hover:bg-red-200 text-red-700 border-red-200'
            : 'bg-green-100 hover:bg-green-200 text-green-700 border-green-200'
        }`}
      >
        <span className="text-base">{pkg.status === 'active' ? '🚫' : '✅'}</span>
        {pkg.status === 'active' ? 'Desactivar' : 'Activar'}
      </button>
    </div>
  </div>
))}