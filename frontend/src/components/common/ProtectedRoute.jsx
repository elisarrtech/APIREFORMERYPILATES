import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

/**
 * ProtectedRoute - Componente de rutas protegidas
 * Maneja autenticación y autorización por roles
 * 
 * @version 2.0.0
 * @author @elisarrtech
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  console.log('🔐 [ProtectedRoute] User:', user?.email, 'Role:', user?.role, 'Allowed:', allowedRoles);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ [ProtectedRoute] No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('⚠️ [ProtectedRoute] User role not allowed, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ [ProtectedRoute] Access granted');
  return children;
};

export default ProtectedRoute;