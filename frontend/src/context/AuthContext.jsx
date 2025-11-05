import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

/**
 * AuthContext - Sistema de Autenticación Profesional
 * ...
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Ref para evitar ejecutar logout multiple veces si llegan varios eventos
  const hasHandledUnauthorized = useRef(false);

  useEffect(() => {
    checkAuth();

    // Listener global para cuando el interceptor detecta 401
    const handler = (ev) => {
      console.warn('🚨 [AuthContext] auth:unauthorized event received', ev?.detail);
      // Evitar ejecutar logout repetidas veces
      if (hasHandledUnauthorized.current) return;
      hasHandledUnauthorized.current = true;

      // Llamar logout de forma segura (no forzar múltiples navigations)
      logout(true);
    };

    window.addEventListener('auth:unauthorized', handler);

    return () => {
      window.removeEventListener('auth:unauthorized', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==================== VERIFICAR AUTENTICACIÓN ====================
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      console.log('🔐 [AuthContext] Verificando autenticación...', {
        hasToken: !!token,
        hasUser: !!savedUser
      });

      if (token && savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('✅ [AuthContext] Usuario autenticado desde localStorage:', userData);
      } else {
        console.log('ℹ️ [AuthContext] No hay sesión activa');
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error al verificar autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOGIN ====================
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      hasHandledUnauthorized.current = false; // resetar bandera al intentar login
      console.log('🔑 [AuthContext] Intentando login:', email);

      const response = await api.post('/auth/login', {
        email: email.trim(),
        password
      });

      console.log('✅ [AuthContext] Login exitoso:', response.data);

      // Backend puede devolver token en data.token o data.access_token
      const data = response.data.data || response.data || {};
      const token = data.token || data.access_token || response.data.token || response.data.access_token;
      const userData = data.user || response.data.user || null;

      if (!token) {
        throw new Error('Token no recibido desde el servidor');
      }

      // Guardar en localStorage y estado
      localStorage.setItem('token', token);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        // Si el backend no devolvió user, podemos intentar /auth/me en background
        try {
          const meRes = await api.get('/auth/me');
          const meData = meRes.data?.data || meRes.data;
          if (meData) {
            localStorage.setItem('user', JSON.stringify(meData));
            setUser(meData);
          }
        } catch (e) {
          console.warn('⚠️ [AuthContext] No se pudo obtener /auth/me tras login:', e);
        }
      }

      // Redirigir según rol (usar userData si existe, si no espera a /me)
      const role = (userData && userData.role) || (user && user.role) || null;
      const redirectPath =
        role === 'admin' ? '/admin/dashboard' :
        role === 'instructor' ? '/instructor/dashboard' :
        '/schedules';

      console.log('🚀 [AuthContext] Redirigiendo a:', redirectPath);
      navigate(redirectPath, { replace: true });

      return { success: true };
    } catch (error) {
      console.error('❌ [AuthContext] Error en login:', error);
      const message =
        error.response?.data?.message ||
        error.message ||
        'Error al iniciar sesión. Verifica tus credenciales.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOGOUT ====================
  const logout = (silent = false) => {
    console.log('🚪 [AuthContext] Cerrando sesión...');
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    } catch (e) {}
    setUser(null);
    setError(null);

    // Si silent = true, no navegar si ya estamos en /login para evitar loop de navegación
    if (!silent) {
      navigate('/login', { replace: true });
    } else {
      // Solo navigar si no estamos ya en /login
      if (window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    }
    // reset bandera para permitir login posterior
    hasHandledUnauthorized.current = false;
    console.log('✅ [AuthContext] Sesión cerrada');
  };

  // El resto (register, updateUser, etc.) permanece igual...
  const register = async (userData) => { /* ... existing register implementation ... */ };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('✅ [AuthContext] Usuario actualizado:', updatedUser);
  };

  const hasRole = (role) => user?.role === role;
  const isAdmin = () => hasRole('admin');
  const isInstructor = () => hasRole('instructor');
  const isClient = () => hasRole('client');

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isAdmin,
    isInstructor,
    isClient,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};

export default AuthContext;
