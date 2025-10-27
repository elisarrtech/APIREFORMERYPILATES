
/**
 * Navbar - Barra de navegación principal
 * Autor: @elisarrtech con Elite AI Architect
 * 
 * Funcionalidades:
 * - Navegación responsive
 * - Menú de usuario
 * - Indicadores de rol
 * - Logout
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaCalendarAlt,
  FaChartBar,
  FaDumbbell,
  FaUsers
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Links según el rol del usuario
  const getNavigationLinks = () => {
    if (!user) return [];

    const links = {
      admin: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: FaChartBar },
        { to: '/admin/classes', label: 'Clases', icon: FaDumbbell },
        { to: '/admin/schedules', label: 'Horarios', icon: FaCalendarAlt },
        { to: '/admin/reservations', label: 'Reservas', icon: FaUsers }
      ],
      instructor: [
        { to: '/instructor/dashboard', label: 'Dashboard', icon: FaChartBar },
        { to: '/instructor/schedule', label: 'Mi Horario', icon: FaCalendarAlt },
        { to: '/instructor/classes', label: 'Mis Clases', icon: FaDumbbell }
      ],
      client: [
        { to: '/client/dashboard', label: 'Inicio', icon: FaChartBar },
        { to: '/client/reservations', label: 'Mis Reservas', icon: FaCalendarAlt }
      ]
    };

    return links[user.role] || [];
  };

  const navigationLinks = getNavigationLinks();

  // Rol badge color
  const getRoleBadgeColor = () => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      instructor: 'bg-blue-100 text-blue-800',
      client: 'bg-green-100 text-green-800'
    };
    return colors[user?.role] || 'bg-gray-100 text-gray-800';
  };

  // Rol label
  const getRoleLabel = () => {
    const labels = {
      admin: 'Administrador',
      instructor: 'Instructor',
      client: 'Cliente'
    };
    return labels[user?.role] || 'Usuario';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <FaDumbbell className="text-white text-xl" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">
                FitnessClub
              </span>
            </Link>
          </div>

          {/* Links de navegación - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition
                    ${isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Usuario - Desktop */}
          <div className="hidden md:flex md:items-center">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.full_name}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                    {getRoleLabel()}
                  </span>
                </div>
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
              </button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setUserMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FaUser />
                      Mi Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FaSignOutAlt />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Botón menú móvil */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Usuario info */}
            <div className="px-3 py-4 border-b">
              <p className="text-sm font-medium text-gray-800">
                {user?.full_name}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                {getRoleLabel()}
              </span>
            </div>

            {/* Navigation links */}
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg
                    ${isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
            >
              <FaSignOutAlt />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
```
