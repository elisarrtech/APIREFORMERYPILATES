import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, X, GraduationCap, Users } from 'lucide-react';

/**
 * Auth Modal - Login/Register Modal Component
 * @version 3.0.0 - ÉLITE MUNDIAL MEJORADO
 * @author @elisarrtech
 */
const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: 'client',
    full_name: '',
    phone: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        onClose();
        const role = result.user.role;
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'instructor') {
          navigate('/instructor/dashboard');
        } else {
          navigate('/client/dashboard');
        }
      } else {
        setError(result.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });
      
      if (result.success) {
        setMode('login');
        setError('');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        alert('✅ Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      } else {
        setError(result.message || 'Error al crear cuenta');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="pt-8 pb-6 px-8 text-center border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight mb-1">
            REFORMERY
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Pilates Studio
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 px-6 text-center font-semibold text-sm transition-all duration-300 ${
              mode === 'login'
                ? 'text-gray-800 border-b-2 border-gray-800 bg-white'
                : 'text-gray-400 hover:text-gray-600 bg-gray-50'
            }`}
          >
            INICIAR SESIÓN
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 px-6 text-center font-semibold text-sm transition-all duration-300 ${
              mode === 'register'
                ? 'text-gray-800 border-b-2 border-gray-800 bg-white'
                : 'text-gray-400 hover:text-gray-600 bg-gray-50'
            }`}
          >
            REGISTRARSE
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* LOGIN FORM */}
          {mode === 'login' && (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  Bienvenido a nuestro Panel
                </h2>
                <p className="text-sm text-gray-500">
                  Ingresa con tu cuenta
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tucorreo@ejemplo.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 text-sage-600 bg-gray-100 border-gray-300 rounded focus:ring-sage-500 focus:ring-2 transition-all duration-200 cursor-pointer"
                    />
                    <span className="ml-2 text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                      Recordarme
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-xs text-sage-600 hover:text-sage-700 font-medium transition-colors duration-200"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-lg uppercase tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl text-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Iniciando sesión...
                    </div>
                  ) : (
                    'INICIAR SESIÓN'
                  )}
                </button>
              </form>
            </>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <>
              <div className="mb-4 text-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  Crea tu cuenta
                </h2>
                <p className="text-sm text-gray-500">
                  Únete a nuestra comunidad
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Tipo de Cuenta
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'client' }))}
                      className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all duration-300 ${
                        formData.role === 'client'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Users className="w-6 h-6 mb-1" />
                      <span className="text-xs font-semibold">Alumno</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'instructor' }))}
                      className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all duration-300 ${
                        formData.role === 'instructor'
                          ? 'border-gray-800 bg-gray-50 text-gray-800'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <GraduationCap className="w-6 h-6 mb-1" />
                      <span className="text-xs font-semibold">Instructor</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tucorreo@ejemplo.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Teléfono <span className="text-gray-400 text-xs normal-case">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="55 1234 5678"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repite tu contraseña"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-start cursor-pointer group">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="w-4 h-4 mt-0.5 text-sage-600 bg-gray-100 border-gray-300 rounded focus:ring-sage-500 focus:ring-2 transition-all duration-200 cursor-pointer flex-shrink-0"
                    />
                    <span className="ml-2 text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                      Acepto los{' '}
                      <button type="button" className="text-sage-600 hover:text-sage-700 font-medium">
                        términos y condiciones
                      </button>
                      {' '}y el{' '}
                      <button type="button" className="text-sage-600 hover:text-sage-700 font-medium">
                        aviso de privacidad
                      </button>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-lg uppercase tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl text-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creando cuenta...
                    </div>
                  ) : (
                    'CREAR CUENTA'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;