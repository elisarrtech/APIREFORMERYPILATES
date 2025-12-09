import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, ChevronDown, Calendar, Phone } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

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
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-orange-200 shadow-lg z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo con nueva paleta */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/images/Logo_Azul.png"
                alt="OL-LIN Estudio Fitness"
                className="h-12 sm:h-14 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="hidden sm:flex flex-col leading-none">
                <div className="text-lg lg:text-xl font-extrabold text-blue-800 tracking-tight">OL-LIN</div>
                <div className="text-xs text-orange-600 italic font-medium">Estudio Fitness</div>
              </div>
            </Link>

            {/* Desktop Menu - Actualizado con nueva paleta */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('quienes-somos-section')}
                className="text-sm font-semibold uppercase tracking-wide text-blue-700 hover:text-orange-600 transition-all duration-200 hover:scale-105"
              >
                QUIENES SOMOS
              </button>
              
              <button
                onClick={() => scrollToSection('clases-section')}
                className="text-sm font-semibold uppercase tracking-wide text-blue-700 hover:text-orange-600 transition-all duration-200 hover:scale-105"
              >
                CLASES
              </button>
              
              <button
                onClick={() => scrollToSection('paquetes-section')}
                className="text-sm font-semibold uppercase tracking-wide text-blue-700 hover:text-orange-600 transition-all duration-200 hover:scale-105"
              >
                PLANES
              </button>

              <Link
                to="/schedules"
                className={`text-sm font-semibold uppercase tracking-wide transition-all duration-200 hover:scale-105 ${
                  isActive('/schedules') 
                    ? 'text-orange-600 border-b-2 border-orange-500 pb-1' 
                    : 'text-blue-700 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  RESERVA CLASE
                </div>
              </Link>

              <Link
                to="/contact"
                className={`text-sm font-semibold uppercase tracking-wide transition-all duration-200 hover:scale-105 ${
                  isActive('/contact') 
                    ? 'text-orange-600 border-b-2 border-orange-500 pb-1' 
                    : 'text-blue-700 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  CONTACTO
                </div>
              </Link>
            </div>

            {/* Right side - Desktop - Actualizado */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Redes Sociales con nuevos colores */}
              <div className="flex items-center gap-3 border-r border-gray-200 pr-6">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={16} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={18} />
                </a>
              </div>

              {/* Botón de Cuenta */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-white font-bold text-sm uppercase tracking-wide hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    aria-haspopup="true"
                    aria-expanded={accountMenuOpen}
                  >
                    <User size={18} />
                    MI CUENTA
                    <ChevronDown size={16} className={`transition-transform duration-300 ${accountMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-orange-200 py-3 animate-fade-in z-50" role="menu">
                      <div className="px-4 py-3 border-b border-orange-100 bg-gradient-to-r from-blue-50 to-white">
                        <p className="text-sm font-bold text-blue-800">{user?.full_name || 'Usuario'}</p>
                        <p className="text-xs text-blue-600">{user?.email}</p>
                        <div className="mt-1">
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 uppercase">
                            {user?.role === 'admin' ? 'Administrador' : 
                             user?.role === 'instructor' ? 'Instructor' : 'Cliente'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleMyAccount}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-blue-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 flex items-center gap-3 border-b border-orange-100"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User size={14} className="text-blue-600" />
                        </div>
                        Mi Panel
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <LogOut size={14} className="text-red-600" />
                        </div>
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-white font-bold text-sm uppercase tracking-wide hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <User size={18} />
                  INICIAR SESIÓN
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all duration-300"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Actualizado */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gradient-to-b from-white to-blue-50 border-t border-orange-200 animate-fade-in">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col gap-1">
                
                <button
                  onClick={() => scrollToSection('quienes-somos-section')}
                  className="text-sm font-semibold uppercase tracking-wide py-4 px-4 text-blue-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 text-left flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">Q</span>
                  </div>
                  QUIENES SOMOS
                </button>
                
                <button
                  onClick={() => scrollToSection('clases-section')}
                  className="text-sm font-semibold uppercase tracking-wide py-4 px-4 text-blue-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 text-left flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">C</span>
                  </div>
                  CLASES
                </button>
                
                <button
                  onClick={() => scrollToSection('paquetes-section')}
                  className="text-sm font-semibold uppercase tracking-wide py-4 px-4 text-blue-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 text-left flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">P</span>
                  </div>
                  PLANES
                </button>

                <Link
                  to="/schedules"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold uppercase tracking-wide py-4 px-4 text-blue-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Calendar size={16} className="text-orange-600" />
                  </div>
                  RESERVA CLASE
                </Link>
                
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold uppercase tracking-wide py-4 px-4 text-blue-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Phone size={16} className="text-blue-600" />
                  </div>
                  CONTACTO
                </Link>

                {/* Sección de usuario móvil */}
                <div className="border-t border-orange-200 pt-6 mt-4">
                  {isAuthenticated ? (
                    <>
                      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white rounded-2xl border border-blue-200">
                        <p className="text-sm font-bold text-blue-800 mb-1">{user?.full_name || 'Usuario'}</p>
                        <p className="text-xs text-blue-600 mb-2">{user?.email}</p>
                        <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 uppercase">
                          {user?.role === 'admin' ? 'Administrador' : 
                           user?.role === 'instructor' ? 'Instructor' : 'Cliente'}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          handleMyAccount();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 py-4 px-4 text-sm font-semibold text-blue-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 mb-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User size={18} className="text-blue-600" />
                        </div>
                        Mi Panel
                      </button>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 py-4 px-4 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                      >
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <LogOut size={18} className="text-red-600" />
                        </div>
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        handleLogin();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 py-4 px-4 text-sm font-semibold text-blue-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                      Iniciar Sesión
                    </button>
                  )}

                  {/* Redes sociales móviles */}
                  <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-orange-200">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
                    >
                      <FaFacebookF size={18} />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                    >
                      <FaInstagram size={20} />
                    </a>
                    <a
                      href="https://wa.me/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300"
                    >
                      <FaWhatsapp size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer para el contenido */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
