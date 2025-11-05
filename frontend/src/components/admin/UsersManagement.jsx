import React, { useState } from 'react';
import { getRoleColor, getStatusColor } from '../../utils/helpers';
import { USER_ROLE_LABELS } from '../../utils/constants';

/**
 * Componente profesional de gestión de usuarios
 * Tabla optimizada con acciones CRUD y bonos/regalos
 */
const UsersManagement = ({
  users,
  onCreateUser,
  onEditUser,
  onToggleStatus,
  onApplyFilters,
  onAddExtraClass,
}) => {
  // --- Filtros avanzados ---
  const [filters, setFilters] = useState({
    role: '',
    email: '',
    name: '',
    active: '',
    created_at: '',
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  // --- Modal para agregar bono ---
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bonusAmount, setBonusAmount] = useState(1);
  const [bonusReason, setBonusReason] = useState('Bono de regalo');
  const [loadingBonus, setLoadingBonus] = useState(false);
  const [errorBonus, setErrorBonus] = useState('');

  const openBonusModal = (user) => {
    setSelectedUser(user);
    setBonusAmount(1);
    setBonusReason('');
    setErrorBonus('');
    setShowBonusModal(true);
  };

  const handleBonusSubmit = async () => {
    if (bonusAmount < 1) {
      setErrorBonus('Debes agregar al menos 1 clase.');
      return;
    }
    setLoadingBonus(true);
    try {
      await onAddExtraClass(selectedUser.active_package_id, bonusAmount, bonusReason);
      setShowBonusModal(false);
    } catch (e) {
      setErrorBonus('Error al agregar clases, intenta de nuevo.');
    } finally {
      setLoadingBonus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600 mt-1">Administra todos los usuarios del sistema</p>
        </div>
        <button
          onClick={onCreateUser}
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Usuario
        </button>
      </div>

      {/* Filtros Avanzados */}
      <div className="mb-4 flex gap-3 flex-wrap">
        <input
          name="name"
          placeholder="Nombre"
          value={filters.name}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <input
          name="email"
          placeholder="Email"
          value={filters.email}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">Todos</option>
          <option value="client">Cliente</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <select
          name="active"
          value={filters.active}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">Estado</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
        <input
          name="created_at"
          type="date"
          value={filters.created_at}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleApplyFilters}
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Filtrar
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-gray-500 font-medium">No hay usuarios registrados</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{user.full_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getRoleColor(user.role)}`}>
                        {USER_ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(user.active)}`}>
                        {user.active ? '✓ Activo' : '✗ Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => onEditUser(user)}
                        className="text-primary-600 hover:text-primary-900 font-semibold transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => onToggleStatus(user)}
                        className={`${
                          user.active 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        } font-semibold transition-colors`}
                      >
                        {user.active ? '🚫 Desactivar' : '✅ Activar'}
                      </button>
                      {user.has_active_package &&
                        <button
                          onClick={() => openBonusModal(user)}
                          className="text-indigo-600 hover:text-indigo-900 font-semibold transition-colors"
                        >
                          🎁 Agregar Clase Extra
                        </button>
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de bono/clase extra */}
      {showBonusModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowBonusModal(false)}
              aria-label="Cerrar modal"
            >&times;</button>
            <h3 className="text-lg font-bold mb-4">Agregar Clases de Regalo</h3>
            <p className="mb-2 text-gray-700">
              Usuario: <span className="font-semibold">{selectedUser?.full_name}</span>
            </p>
            <input
              type="number"
              min={1}
              value={bonusAmount}
              onChange={e => setBonusAmount(parseInt(e.target.value, 10) || 1)}
              className="border px-3 py-2 rounded w-full mb-2"
              placeholder="Cantidad de clases"
              disabled={loadingBonus}
            />
            <input
              type="text"
              value={bonusReason}
              onChange={e => setBonusReason(e.target.value)}
              className="border px-3 py-2 rounded w-full mb-4"
              placeholder="Motivo (ej: bono cumpleaños, promoción, etc.)"
              disabled={loadingBonus}
            />
            {errorBonus && (
              <div className="text-red-500 mb-2 text-sm font-semibold">{errorBonus}</div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleBonusSubmit}
                disabled={loadingBonus}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
              >
                {loadingBonus ? 'Agregando...' : 'Agregar'}
              </button>
              <button
                onClick={() => setShowBonusModal(false)}
                disabled={loadingBonus}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-60"
              >
                Cancelar
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Este ajuste quedará registrado como bono/regalo para el usuario.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;