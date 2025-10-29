import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

/**
 * Unauthorized Page - Error 403 Acceso Prohibido
 * Diseño profesional con redirección inteligente
 * @version 2.0.0
 * @author @elisarrtech
 */
const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGoBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'instructor') {
      navigate('/instructor/dashboard');
    } else if (user?.role === 'client') {
      navigate('/schedules');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icono Animado */}
        <div className="mb-8 animate-bounce">
          <div className="inline-block p-8 bg-red-100 rounded-full">
            <span className="text-9xl">🚫</span>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-black text-red-600 mb-4 tracking-tight">
          403
        </h1>

        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Acceso No Autorizado
        </h2>

        {/* Descripción */}
        <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
          {isAuthenticated 
            ? `Lo sentimos ${user?.full_name}, no tienes permisos para acceder a esta página.`
            : 'Debes iniciar sesión para acceder a esta página.'
          }
        </p>

        {/* Información de Usuario */}
        {isAuthenticated && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">{user?.full_name}</p>
                <p className="text-sm text-gray-600">
                  Rol: <span className="font-semibold">{user?.role}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleGoBack}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
              >
                🏠 Ir a Mi Dashboard
              </button>
              <button
                onClick={() => navigate(-1)}
                className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                ← Volver Atrás
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl inline-block"
              >
                🔐 Iniciar Sesión
              </Link>
              <Link
                to="/"
                className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg inline-block"
              >
                🏠 Ir al Inicio
              </Link>
            </>
          )}
        </div>

        {/* Mensaje de Ayuda */}
        <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl max-w-md mx-auto">
          <p className="text-sm text-blue-800">
            <span className="font-bold">💡 ¿Necesitas ayuda?</span>
            <br />
            Si crees que deberías tener acceso, contacta al administrador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;