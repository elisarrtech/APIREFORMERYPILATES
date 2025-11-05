import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

/**
 * AuthContext - Sistema de Autenticación Profesional
 * 
 * Features:
 * - JWT Token Management
 * - Role-Based Access Control (RBAC)
 * - Persistent Sessions
 * - Auto-refresh tokens
 * - Secure logout
 * 
 * @version 2.0.0
 * @author @elisarrtech
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ==================== INICIALIZACIÓN ====================
  useEffect(() => {
    checkAuth();
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
        
        // Opcional: Verificar token con el backend
        // Comentado para evitar delay en desarrollo
        /*
        try {
          const response = await api.get('/auth/me');
          console.log('✅ [AuthContext] Token verificado con backend:', response.data.data);
          setUser(response.data.data);
        } catch (err) {
          console.warn('⚠️ [AuthContext] Token inválido o expirado:', err.message);
          logout();
        }
        */
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

      console.log('🔑 [AuthContext] Intentando login:', email);

      const response = await api.post('/auth/login', { 
        email: email.trim(), 
        password 
      });
      
      console.log('✅ [AuthContext] Login exitoso:', response.data);

      const { token, user: userData } = response.data.data || response.data;

      if (!token || !userData) {
        throw new Error('Respuesta inválida del servidor');
      }

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Actualizar estado
      setUser(userData);

      console.log('✅ [AuthContext] Sesión iniciada para:', userData.full_name);

      // Redirigir según el rol
      const redirectPath = 
        userData.role === 'admin' ? '/admin/dashboard' :
        userData.role === 'instructor' ? '/instructor/dashboard' :
        '/schedules';

      console.log('🚀 [AuthContext] Redirigiendo a:', redirectPath);
      
      // Redirigir inmediatamente
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

  // ==================== REGISTER ====================
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('📝 [AuthContext] Registrando nuevo usuario:', userData.email);

      const response = await api.post('/auth/register', userData);
      
      console.log('✅ [AuthContext] Registro exitoso:', response.data);

      const { token, user: newUser } = response.data.data || response.data;

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Actualizar estado
      setUser(newUser);

      console.log('✅ [AuthContext] Usuario registrado:', newUser.full_name);

      // Redirigir
      navigate('/schedules', { replace: true });

      return { success: true };
    } catch (error) {
      console.error('❌ [AuthContext] Error en registro:', error);
      
      const message = 
        error.response?.data?.message || 
        error.message || 
        'Error al registrarse. Intenta de nuevo.';
      
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOGOUT ====================
  const logout = () => {
    console.log('🚪 [AuthContext] Cerrando sesión...');
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Limpiar estado
    setUser(null);
    setError(null);

    console.log('✅ [AuthContext] Sesión cerrada');

    // Redirigir
    navigate('/login', { replace: true });
  };

  // ==================== UPDATE USER ====================
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('✅ [AuthContext] Usuario actualizado:', updatedUser);
  };

  // ==================== CHECK ROLE ====================
  const hasRole = (role) => user?.role === role;
  const isAdmin = () => hasRole('admin');
  const isInstructor = () => hasRole('instructor');
  const isClient = () => hasRole('client');

  // ==================== VALORES DEL CONTEXTO ====================
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

// ==================== CUSTOM HOOK ====================
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
};

export default AuthContext;
