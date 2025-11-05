import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, X, GraduationCap, Users, Shield } from 'lucide-react';

/**
 * Register Page - Reformery Pilates Studio
 * @version 2.0.0 - ÉLITE MUNDIAL
 * @author @elisarrtech
 */
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    role: 'client', // Default: cliente
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    adminCode: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
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
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        password: formData.password,
        role: formData.role,
        // send admin_code only if provided (backend will validate it)
        admin_code: formData.adminCode ? formData.adminCode.trim() : undefined
      };

      const result = await register(payload);
      
      if (result?.success) {
        // Registration created a session/token — redirect depending on role or to login
        navigate('/schedules');
      } else {
        // Try to read the error message from different possible shapes
        const msg = result?.error || result?.message || 'Error al crear cuenta';
        setError(msg);
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
      console.error('Register error:', err);
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
          <Link
            to="/login"
            className="flex-1 py-4 px-6 text-center font-semibold text-gray-400 hover:text-gray-600 bg-gray-50 transition-all duration-300"
          >
            INICIAR SESIÓN
          </Link>
          <button className="flex-1 py-4 px-6 text-center font-semibold text-gray-800 border-b-3 border-gray-800 bg-white transition-all duration-300">
            REGISTRARSE
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Crea tu cuenta
            </h2>
            <p className="text-sm text-gray-500">
              Únete a nuestra comunidad de Pilates
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Selection (client / instructor / admin) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Tipo de Cuenta
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'client' }))}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-300 ${
                    formData.role === 'client'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Users className="w-8 h-8 mb-2" />
                  <span className="text-sm font-semibold">Alumno</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'instructor' }))}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-300 ${
                    formData.role === 'instructor'
                      ? 'border-gray-800 bg-gray-50 text-gray-800'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <GraduationCap className="w-8 h-8 mb-2" />
                  <span className="text-sm font-semibold">Instructor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-300 ${
                    formData.role === 'admin'
                      ? 'border-yellow-600 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Shield className="w-8 h-8 mb-2" />
                  <span className="text-sm font-semibold">Administrador</span>
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Para crear una cuenta administrador necesitas el código secreto. Si no lo tienes, el registro creará una cuenta cliente.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
                />
              </div>
            </div>

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
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Teléfono <span className="text-gray-400 text-xs normal-case">(Opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="55 1234 5678"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            {/* Admin code (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Código de administrador (opcional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  placeholder={formData.role === 'admin' ? 'Introduce el código para crear admin' : 'Si no eres admin deja vacío'}
                  className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
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
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-1 text-sage-600 bg-gray-100 border-gray-300 rounded focus:ring-sage-500 focus:ring-2 transition-all duration-200 cursor-pointer flex-shrink-0"
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                  Acepto los{' '}
                  <Link to="/terms" className="text-sage-600 hover:text-sage-700 font-medium">
                    términos y condiciones
                  </Link>
                  {' '}y el{' '}
                  <Link to="/privacy" className="text-sage-600 hover:text-sage-700 font-medium">
                    aviso de privacidad
                  </Link>
                </span>
              </label>
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
                  Creando cuenta...
                </div>
              ) : (
                'CREAR CUENTA'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-sage-600 hover:text-sage-700 font-semibold transition-colors duration-200"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
