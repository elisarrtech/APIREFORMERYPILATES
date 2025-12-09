import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, X, GraduationCap, Users, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { FaFacebookF, FaGoogle, FaApple } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    role: 'client',
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
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    setError('');
    
    // Calcular fortaleza de contraseña
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
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
        admin_code: formData.adminCode ? formData.adminCode.trim() : undefined
      };

      const result = await register(payload);
      
      if (result?.success) {
        navigate('/schedules');
      } else {
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

  const getStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-600';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthText = () => {
    switch(passwordStrength) {
      case 0: return 'Muy débil';
      case 1: return 'Débil';
      case 2: return 'Regular';
      case 3: return 'Buena';
      case 4: return 'Excelente';
      default: return 'Muy débil';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Modal Container */}
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in-up border border-blue-100 z-10">
        
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <User size={28} className="text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight">OL-LIN</h1>
              <p className="text-sm text-orange-600 italic font-medium">Estudio Fitness</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Únete a nuestra comunidad
          </h2>
          <p className="text-sm text-gray-500">
            Crea tu cuenta y comienza tu transformación
          </p>
        </div>

        {/* Social Register */}
        <div className="px-8 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => console.log('Register with Google')}
              className="py-3 bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <FaGoogle className="text-blue-600" size={18} />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={() => console.log('Register with Facebook')}
              className="py-3 bg-white border border-gray-300 hover:border-blue-600 hover:bg-blue-50 text-gray-700 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <FaFacebookF className="text-blue-700" size={18} />
              <span className="text-sm font-medium">Facebook</span>
            </button>
            <button
              onClick={() => console.log('Register with Apple')}
              className="py-3 bg-white border border-gray-300 hover:border-gray-800 hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <FaApple size={20} />
              <span className="text-sm font-medium">Apple</span>
            </button>
          </div>
          
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="mx-4 text-sm text-gray-400 font-medium">O regístrate con email</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl text-red-700 animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Error en el registro</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="px-8 max-h-[70vh] overflow-y-auto custom-scrollbar pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-3">
                Tipo de Cuenta
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'client' }))}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-300 group ${
                    formData.role === 'client'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-blue-200 bg-white text-blue-600 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    formData.role === 'client' ? 'bg-blue-500' : 'bg-blue-100 group-hover:bg-blue-200'
                  }`}>
                    <Users className={`w-5 h-5 ${formData.role === 'client' ? 'text-white' : 'text-blue-500'}`} />
                  </div>
                  <span className="text-sm font-semibold">Alumno</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'instructor' }))}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-300 group ${
                    formData.role === 'instructor'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-orange-200 bg-white text-orange-600 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    formData.role === 'instructor' ? 'bg-orange-500' : 'bg-orange-100 group-hover:bg-orange-200'
                  }`}>
                    <GraduationCap className={`w-5 h-5 ${formData.role === 'instructor' ? 'text-white' : 'text-orange-500'}`} />
                  </div>
                  <span className="text-sm font-semibold">Instructor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-300 group ${
                    formData.role === 'admin'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-green-200 bg-white text-green-600 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    formData.role === 'admin' ? 'bg-green-500' : 'bg-green-100 group-hover:bg-green-200'
                  }`}>
                    <Shield className={`w-5 h-5 ${formData.role === 'admin' ? 'text-white' : 'text-green-500'}`} />
                  </div>
                  <span className="text-sm font-semibold">Administrador</span>
                </button>
              </div>
              <p className="mt-3 text-xs text-blue-600">
                {formData.role === 'admin' 
                  ? 'Para crear una cuenta administrador necesitas el código secreto.'
                  : 'Selecciona el tipo de cuenta que deseas crear.'}
              </p>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-800">
                Nombre Completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none hover:border-blue-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-800">
                Correo Electrónico *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none hover:border-blue-400"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-800">
                Teléfono <span className="text-blue-400 text-sm font-normal">(Opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="55 1234 5678"
                  className="w-full pl-12 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none hover:border-blue-400"
                />
              </div>
            </div>

            {/* Admin Code */}
            {formData.role === 'admin' && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-green-700">
                  Código de Administrador *
                </label>
                <input
                  type="password"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                  placeholder="Introduce el código secreto"
                  required={formData.role === 'admin'}
                  className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-800 placeholder-green-400 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
                />
                <p className="text-xs text-green-600">
                  Solo el personal autorizado tiene acceso a este código
                </p>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-800">
                Contraseña *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none hover:border-blue-400"
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
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-blue-700">Fortaleza:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength <= 1 ? 'text-red-600' :
                      passwordStrength === 2 ? 'text-orange-600' :
                      passwordStrength === 3 ? 'text-green-600' : 'text-green-700'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength * 25}%` }}
                    ></div>
                  </div>
                  <ul className="mt-2 text-xs text-blue-600 space-y-1">
                    <li className="flex items-center gap-1">
                      <CheckCircle size={12} className={formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'} />
                      Mínimo 8 caracteres
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckCircle size={12} className={/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'} />
                      Al menos una mayúscula
                    </li>
                    <li className="flex items-center gap-1">
                      <CheckCircle size={12} className={/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'} />
                      Al menos un número
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-800">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none hover:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-orange-500 transition-colors duration-200"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-5 h-5 mt-1 text-orange-600 bg-blue-50 border-blue-300 rounded focus:ring-orange-500 focus:ring-2 transition-all duration-200 cursor-pointer flex-shrink-0 group-hover:border-orange-500"
                />
                <span className="ml-3 text-sm text-blue-700 group-hover:text-blue-900 transition-colors duration-200">
                  Acepto los{' '}
                  <Link to="/terms" className="text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                    términos y condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link to="/privacy" className="text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                    política de privacidad
                  </Link>
                </span>
              </label>
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
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <User size={14} className="text-white" />
                    </div>
                    CREAR MI CUENTA
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-blue-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-orange-600 hover:text-orange-700 font-bold transition-colors duration-200 hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-blue-50/50 border-t border-blue-200 px-8 py-4">
          <div className="flex items-center justify-center gap-2">
            <Shield size={14} className="text-blue-500" />
            <p className="text-xs text-blue-600 text-center">
              Tus datos están protegidos con encriptación de extremo a extremo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
