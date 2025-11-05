
/**
 * ProtectedRoute - Componente para proteger rutas
 * Patrón: Higher-Order Component (HOC)
 * Autor: @elisarrtech con Elite AI Architect
 * 
 * Funcionalidades:
 * - Protección por autenticación
 * - Protección por rol
 * - Redirección automática
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

/**
 * Componente de ruta protegida
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo
 * @param {string[]} props.allowedRoles - Roles permitidos (opcional)
 * @param {string} props.redirectTo - Ruta de redirección (default: '/login')
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = null,
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si se especifican roles, verificar que el usuario tenga uno de ellos
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirigir al dashboard correspondiente según su rol
    const dashboardRoutes = {
      admin: '/admin/dashboard',
      instructor: '/instructor/dashboard',
      client: '/client/dashboard'
    };

    const userDashboard = dashboardRoutes[user?.role] || '/';
    
    return <Navigate to={userDashboard} replace />;
  }

  // Si todo está bien, renderizar el componente hijo
  return children;
};

/**
 * HOC para proteger componentes
 * Uso: export default withAuth(MiComponente, ['admin', 'instructor'])
 */
export const withAuth = (Component, allowedRoles = null) => {
  return (props) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
```
