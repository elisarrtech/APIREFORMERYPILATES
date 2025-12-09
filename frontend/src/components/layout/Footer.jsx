import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Heart,
  ChevronRight,
  Shield,
  CheckCircle
} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';

/**
 * Footer Component - OL-LIN ESTUDIO FITNESS
 * @version 2.0.0 - Optimizado para nueva paleta
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-orange-500"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-green-500"></div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Top Section - Brand & CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/images/Logo_Blanco.png"
                alt="OL-LIN Estudio Fitness"
                className="h-16 w-auto object-contain"
              />
              <div>
                <h3 className="text-3xl font-extrabold text-white">OL-LIN</h3>
                <p className="text-orange-400 italic font-medium">Estudio Fitness</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed max-w-md">
              Transforma tu cuerpo y mente con entrenamiento profesional. 
              Clases personalizadas, instructores certificados y ambiente único.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-xs font-semibold text-white">Certificados</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                <Shield size={16} className="text-orange-400" />
                <span className="text-xs font-semibold text-white">Seguridad</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="lg:col-span-2 bg-gradient-to-r from-blue-800/50 to-orange-900/30 rounded-2xl p-8 border border-blue-700">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-2xl font-bold text-white mb-4">
                  ¿Listo para comenzar?
                </h4>
                <p className="text-blue-100 mb-6">
                  Únete a nuestra comunidad y reserva tu primera clase hoy mismo.
                </p>
                <Link
                  to="/schedules"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-bold uppercase tracking-wide hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Reservar Clase
                  <ChevronRight size={18} />
                </Link>
              </div>
              
              {/* Contact Quick */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center">
                    <Phone size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Llámanos</p>
                    <a 
                      href="tel:+524421092362" 
                      className="text-lg font-bold text-white hover:text-orange-400 transition-colors"
                    >
                      +52 442 109 2362
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center">
                    <Mail size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Escríbenos</p>
                    <a 
                      href="mailto:hola@ollin.com" 
                      className="text-lg font-bold text-white hover:text-orange-400 transition-colors"
                    >
                      hola@ollin.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-t border-blue-700">
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 pb-2 border-b-2 border-orange-500 inline-block">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              {['Inicio', 'Clases', 'Planes', 'Horarios', 'Contacto', 'Mi Cuenta'].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item === 'Inicio' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-blue-200 hover:text-orange-400 transition-all duration-200 flex items-center gap-2 group py-2"
                  >
                    <ChevronRight size={14} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nuestras Clases */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 pb-2 border-b-2 border-green-500 inline-block">
              Nuestras Clases
            </h4>
            <ul className="space-y-3">
              {['PLT FIT', 'PLT BLAST', 'PLT JUMP', 'PLT HIT', 'Clases Privadas', 'Embarazadas'].map((clase, index) => (
                <li key={index}>
                  <button className="text-blue-200 hover:text-green-400 transition-all duration-200 flex items-center gap-2 group py-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-150 transition-transform duration-300"></div>
                    {clase}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 pb-2 border-b-2 border-blue-500 inline-block">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Av. Principal #123, Centro<br />
                    Querétaro, QRO 76000<br />
                    México
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Horario & Social */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-6 pb-2 border-b-2 border-orange-500 inline-block">
                Horario
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center justify-between py-2 border-b border-blue-700/50">
                  <span className="text-blue-200">Lun - Vie</span>
                  <span className="text-white font-semibold">6:00 - 21:00</span>
                </li>
                <li className="flex items-center justify-between py-2 border-b border-blue-700/50">
                  <span className="text-blue-200">Sábado</span>
                  <span className="text-white font-semibold">8:00 - 18:00</span>
                </li>
                <li className="flex items-center justify-between py-2">
                  <span className="text-blue-200">Domingo</span>
                  <span className="text-white font-semibold">9:00 - 14:00</span>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Síguenos</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram size={22} />
                </a>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={22} />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border-2 border-blue-300 text-blue-300 hover:bg-blue-300 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110"
                  aria-label="TikTok"
                >
                  <FaTiktok size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-950/80 backdrop-blur-sm border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="text-blue-300 text-sm text-center md:text-left">
              <p className="flex items-center justify-center md:justify-start gap-1">
                © {currentYear} <span className="font-bold text-white">OL-LIN Estudio Fitness</span>. 
                <span className="hidden md:inline"> Todos los derechos reservados.</span>
              </p>
              <p className="text-xs text-blue-400 mt-1">
                Transformando vidas a través del movimiento
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link 
                to="/privacy" 
                className="text-blue-300 hover:text-orange-400 transition-colors duration-200 hover:underline"
              >
                Privacidad
              </Link>
              <span className="text-blue-600">•</span>
              <Link 
                to="/terms" 
                className="text-blue-300 hover:text-orange-400 transition-colors duration-200 hover:underline"
              >
                Términos
              </Link>
              <span className="text-blue-600">•</span>
              <Link 
                to="/cookies" 
                className="text-blue-300 hover:text-orange-400 transition-colors duration-200 hover:underline"
              >
                Cookies
              </Link>
            </div>

            {/* Developer Credit */}
            <div className="flex items-center gap-2 text-blue-300 text-sm">
              <span className="hidden md:inline">Desarrollado con</span>
              <Heart className="text-red-500 fill-red-500 animate-pulse" size={16} />
              <span>por</span>
              <a 
                href="https://github.com/elisarrtech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 font-bold transition-colors duration-200 hover:underline"
              >
                @elisarrtech
              </a>
            </div>
          </div>

          {/* Trust Seals */}
          <div className="mt-6 pt-6 border-t border-blue-800/50">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
                <span className="text-xs text-blue-300">Sitio seguro SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs text-blue-300">Métodos de pago seguros</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-blue-300">Protección de datos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Fixed Button - Already in App.jsx but included for completeness */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all duration-300 z-40 animate-bounce-slow"
        aria-label="Chat en WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
    </footer>
  );
};

export default Footer;
