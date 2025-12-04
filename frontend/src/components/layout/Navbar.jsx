import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import Logo from '../Logo';

/**
 * Navbar Component - OL LIN (isotipo a la izquierda + texto al lado)
 * Mantiene toda la lógica original (auth, mobile menu, scroll, etc.)
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setAccountMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleMyAccount = () => {
    const role = user?.role;
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'instructor') navigate('/instructor/dashboard');
    else navigate('/client/dashboard');
    setAccountMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo (isotipo azul sin nombre) + texto a la derecha */}
            <Link to="/" className="flex items-center gap-3">
              {/* Uso el componente Logo y la variante del isotipo azul */}
              <Logo variant="Logo_Azul.png" size="lg" className="flex-shrink-0" alt="OL LIN logo" />
              {/* Texto al lado del isotipo - visible en sm+ */}
              <div className="hidden sm:flex flex-col leading-none">
                <div className="text-lg lg:text-xl font-extrabold text-gray-800 tracking-tight">OL LIN</div>
                <div className="text-xs text-gray-600 italic">Estudio Fitness</div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('quienes-somos-section')}
                className="text-sm font-medium uppercase tracking-wide text-gray-700 hover:text-sage-600 transition-colors duration-200"
              >
                QUIENES SOMOS
              </button>
              <button
                onClick={() => scrollToSection('clases-section')}
                className="text-sm font-medium uppercase tracking-wide text-gray-700 hover:text-sage-600 transition-colors duration-200"
              >
                CLASES
              </button>
              <button
                onClick={() => scrollToSection('paquetes-section')}
                className="text-sm font-medium uppercase tracking-wide text-gray-700 hover:text-sage-600 transition-colors duration-200"
              >
                PLANES
              </button>

              <Link
                to="/schedules"
                className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${
                  isActive('/schedules') ? 'text-sage-700 font-bold' : 'text-gray-700 hover:text-sage-600'
                }`}
              >
                RESERVA CLASE
              </Link>

              <Link
                to="/contact"
                className={`text-sm font-medium uppercase tracking-wide transition-colors duration-200 ${
                  isActive('/contact') ? 'text-sage-700 font-bold' : 'text-gray-700 hover:text-sage-600'
                }`}
              >
                CONTACTO
              </Link>
            </div>

            {/* Right side - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:border-sage-600 hover:text-sage-600 transition-all duration-200"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:border-sage-600 hover:text-sage-600 transition-all duration-200"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-800 rounded-full text-gray-800 font-semibold text-sm uppercase tracking-wide hover:bg-gray-800 hover:text-white transition-all duration-200"
                    aria-haspopup="true"
                    aria-expanded={accountMenuOpen}
                  >
                    <User size={18} />
                    MI CUENTA
                    <ChevronDown size={16} />
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-fade-in" role="menu">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.full_name || 'Usuario'}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleMyAccount}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-sage-50 hover:text-sage-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        <User size={16} />
                        Mi Panel
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-800 rounded-full text-gray-800 font-semibold text-sm uppercase tracking-wide hover:bg-gray-800 hover:text-white transition-all duration-200"
                >
                  <User size={18} />
                  MI CUENTA
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-sage-600 transition-colors duration-200"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 animate-fade-in">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => scrollToSection('quienes-somos-section')}
                  className="text-sm font-medium uppercase tracking-wide py-2 text-gray-700 hover:text-sage-600 transition-colors duration-200 text-left"
                >
                  QUIENES SOMOS
                </button>
                <button
                  onClick={() => scrollToSection('clases-section')}
                  className="text-sm font-medium uppercase tracking-wide py-2 text-gray-700 hover:text-sage-600 transition-colors duration-200 text-left"
                >
                  CLASES
                </button>
                <button
                  onClick={() => scrollToSection('paquetes-section')}
                  className="text-sm font-medium uppercase tracking-wide py-2 text-gray-700 hover:text-sage-600 transition-colors duration-200 text-left"
                >
                  PLANES
                </button>

                <Link
                  to="/schedules"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium uppercase tracking-wide py-2 text-gray-700 hover:text-sage-600 transition-colors duration-200"
                >
                  RESERVA CLASE
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium uppercase tracking-wide py-2 text-gray-700 hover:text-sage-600 transition-colors duration-200"
                >
                  CONTACTO
                </Link>

                <div className="border-t border-gray-200 pt-4 mt-2">
                  {isAuthenticated ? (
                    <>
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800 mb-1">{user?.full_name || 'Usuario'}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleMyAccount();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 py-3 text-sm font-medium text-gray-700 hover:text-sage-600 transition-colors duration-200"
                      >
                        <User size={18} />
                        Mi Panel
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 py-3 text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200"
                      >
                        <LogOut size={18} />
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        handleLogin();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 py-3 text-sm font-medium text-gray-700 hover:text-sage-600 transition-colors duration-200"
                    >
                      <User size={18} />
                      Iniciar Sesión
                    </button>
                  )}

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:border-sage-600 hover:text-sage-600 transition-all duration-200"
                    >
                      <FaFacebookF size={16} />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:border-sage-600 hover:text-sage-600 transition-all duration-200"
                    >
                      <FaInstagram size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
