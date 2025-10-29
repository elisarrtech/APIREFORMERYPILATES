import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, X } from 'lucide-react';

/**
 * Login Page - Reformery Pilates Studio
 * @version 2.0.0 - ÉLITE MUNDIAL
 * @author @elisarrtech
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redireccionar según rol
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

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="pt-12 pb-8 px-8 text-center border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">
            REFORMERY
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Pilates Studio
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-4 px-6 text-center font-semibold text-gray-800 border-b-3 border-gray-800 bg-white transition-all duration-300">
            INICIAR SESIÓN
          </button>
          <Link
            to="/register"
            className="flex-1 py-4 px-6 text-center font-semibold text-gray-400 hover:text-gray-600 bg-gray-50 transition-all duration-300"
          >
            REGISTRARSE
          </Link>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Bienvenido a nuestro Panel
            </h2>
            <p className="text-sm text-gray-500">
              Ingresa con tu cuenta
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tucorreo@ejemplo.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-sage-600 bg-gray-100 border-gray-300 rounded focus:ring-sage-500 focus:ring-2 transition-all duration-200 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                  Recordarme
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-sage-600 hover:text-sage-700 font-medium transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-xl uppercase tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'INICIAR SESIÓN'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="text-sage-600 hover:text-sage-700 font-semibold transition-colors duration-200"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;