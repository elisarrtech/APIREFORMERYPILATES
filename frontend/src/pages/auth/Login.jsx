import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, X, LogIn, User, Key, AlertCircle } from 'lucide-react';
import { FaFacebookF, FaGoogle, FaApple } from 'react-icons/fa';

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
  const [hoveredField, setHoveredField] = useState('');

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
        setError(result.message || 'Correo o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, verifica tu internet.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleSocialLogin = (provider) => {
    // TODO: Implementar login con redes sociales
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Modal Container */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in-up border border-blue-100 z-10">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-all duration-300 z-10 flex items-center justify-center hover:rotate-90"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="pt-12 pb-6 px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <User size={28} className="text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight">OL-LIN</h1>
              <p className="text-sm text-orange-600 italic font-medium">Estudio Fitness</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Bienvenido de nuevo
          </h2>
          <p className="text-sm text-gray-500">
            Ingresa para acceder a tu cuenta
          </p>
        </div>

        {/* Social Login */}
        <div className="px-8 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="py-3 bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <FaGoogle className="text-blue-600" size={18} />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              className="py-3 bg-white border border-gray-300 hover:border-blue-600 hover:bg-blue-50 text-gray-700 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <FaFacebookF className="text-blue-700" size={18} />
              <span className="text-sm font-medium">Facebook</span>
            </button>
            <button
              onClick={() => handleSocialLogin('apple')}
              className="py-3 bg-white border border-gray-300 hover:border-gray-800 hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <FaApple size={20} />
              <span className="text-sm font-medium">Apple</span>
            </button>
          </div>
          
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="mx-4 text-sm text-gray-400 font-medium">O ingresa con email</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl text-red-700 animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Error de autenticación</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div 
              className="space-y-2"
              onMouseEnter={() => setHoveredField('email')}
              onMouseLeave={() => setHoveredField('')}
            >
              <label className="block text-sm font-semibold text-blue-800">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${hoveredField === 'email' ? 'scale-110' : ''}`}>
                  <Mail className={`h-5 w-5 ${hoveredField === 'email' ? 'text-orange-500' : 'text-blue-400'}`} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none hover:border-blue-400"
                />
              </div>
            </div>

            {/* Password */}
            <div 
              className="space-y-2"
              onMouseEnter={() => setHoveredField('password')}
              onMouseLeave={() => setHoveredField('')}
            >
              <label className="block text-sm font-semibold text-blue-800">
                Contraseña
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${hoveredField === 'password' ? 'scale-110' : ''}`}>
                  <Lock className={`h-5 w-5 ${hoveredField === 'password' ? 'text-orange-500' : 'text-blue-400'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none hover:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-orange-500 transition-colors duration-200"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-5 h-5 text-orange-600 bg-blue-50 border-blue-300 rounded focus:ring-orange-500 focus:ring-2 transition-all duration-200 cursor-pointer group-hover:border-orange-500"
                />
                <span className="ml-3 text-sm text-blue-700 group-hover:text-blue-900 transition-colors duration-200">
                  Recordar sesión
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl uppercase tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verificando credenciales...
                  </>
                ) : (
                  <>
                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                    INICIAR SESIÓN
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-8 mb-8 text-center">
            <p className="text-sm text-blue-600">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="text-orange-600 hover:text-orange-700 font-bold transition-colors duration-200 hover:underline"
              >
                Crear una cuenta
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50/50 border-t border-blue-200 px-8 py-4">
          <div className="flex items-center justify-center gap-2">
            <Key size={14} className="text-blue-500" />
            <p className="text-xs text-blue-600 text-center">
              Tus credenciales están protegidas con encriptación SSL
            </p>
          </div>
        </div>
      </div>

      {/* Demo Credentials (Solo para desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-900/80 backdrop-blur-sm text-white text-xs p-4 rounded-2xl max-w-xs animate-fade-in z-0">
          <p className="font-semibold mb-1">👨‍💻 Credenciales de prueba:</p>
          <p><span className="text-blue-300">Admin:</span> admin@ollin.com / admin123</p>
          <p><span className="text-orange-300">Instructor:</span> instructor@ollin.com / instructor123</p>
          <p><span className="text-green-300">Cliente:</span> cliente@ollin.com / cliente123</p>
        </div>
      )}
    </div>
  );
};

export default Login;
