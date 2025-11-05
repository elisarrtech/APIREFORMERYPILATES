import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

/**
 * NotFound Page - Error 404 Página No Encontrada
 * Diseño profesional con búsqueda de rutas
 * @version 2.0.0
 * @author @elisarrtech
 */
const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGoHome = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icono Animado */}
        <div className="mb-8">
          <div className="inline-block animate-pulse">
            <span className="text-9xl">🔍</span>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 tracking-tight">
          404
        </h1>

        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Página No Encontrada
        </h2>

        {/* Descripción */}
        <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
          Oops... Parece que la página que buscas no existe o ha sido movida.
        </p>

        {/* URL Actual */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto">
          <p className="text-sm text-gray-500 mb-2 font-semibold">URL solicitada:</p>
          <code className="text-xs bg-gray-100 px-4 py-2 rounded-lg text-red-600 font-mono break-all block">
            {window.location.pathname}
          </code>
        </div>

        {/* Sugerencias de Navegación */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 max-w-md mx-auto border-2 border-blue-200">
          <p className="font-bold text-gray-900 mb-3">📍 Páginas Disponibles:</p>
          <div className="space-y-2 text-sm">
            {isAuthenticated ? (
              <>
                <Link to="/" className="block text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  → Inicio
                </Link>
                <Link to="/schedules" className="block text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  → Horarios
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                    → Admin Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/" className="block text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  → Inicio
                </Link>
                <Link to="/login" className="block text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  → Iniciar Sesión
                </Link>
                <Link to="/register" className="block text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  → Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
          >
            🏠 Ir al Inicio
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            ← Volver Atrás
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p>
            ¿Crees que esto es un error?{' '}
            <a href="mailto:soporte@reformery.com" className="text-purple-600 font-bold hover:text-purple-800">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
