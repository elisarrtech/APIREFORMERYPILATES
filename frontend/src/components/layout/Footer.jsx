import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Heart
} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

/**
 * Footer Component - REFORMERY PILATES STUDIO
 * @version 1.0.0 - ÉLITE MUNDIAL UX/UI
 * @author @elisarrtech
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">OL-LIN</h3>
              <p className="text-sm text-sage-300 uppercase tracking-wider">Estudio Fitness</p>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transforma tu cuerpo y mente con nuestras clases de Pilates Reformer. 
              Instructores certificados y ambiente profesional.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com/reformery"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-sage-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="https://instagram.com/reformery"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-sage-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://twitter.com/reformery"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-sage-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://linkedin.com/company/reformery"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-sage-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b-2 border-sage-600 pb-2 inline-block">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-sage-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-sage-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all duration-200"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/schedules" 
                  className="text-gray-300 hover:text-sage-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-sage-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all duration-200"></span>
                  Horarios
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-sage-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-sage-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all duration-200"></span>
                  Contacto
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-sage-400 transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-sage-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all duration-200"></span>
                  Mi Cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b-2 border-sage-600 pb-2 inline-block">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-sage-500 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Av. Principal #123<br />
                    Querétaro, QRO 76000<br />
                    México
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-sage-500 flex-shrink-0" size={20} />
                <a 
                  href="tel:+524421092362" 
                  className="text-gray-300 hover:text-sage-400 transition-colors duration-200"
                >
                  +52 442 109 2362
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-sage-500 flex-shrink-0" size={20} />
                <a 
                  href="mailto:hola@reformery.com" 
                  className="text-gray-300 hover:text-sage-400 transition-colors duration-200"
                >
                  hola@reformery.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Schedule */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b-2 border-sage-600 pb-2 inline-block">
              Horario de Atención
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Clock className="text-sage-500 flex-shrink-0" size={18} />
                <div className="text-sm">
                  <p className="text-white font-semibold">Lunes - Viernes</p>
                  <p className="text-gray-400">6:00 AM - 9:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="text-sage-500 flex-shrink-0" size={18} />
                <div className="text-sm">
                  <p className="text-white font-semibold">Sábado</p>
                  <p className="text-gray-400">8:00 AM - 6:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="text-sage-500 flex-shrink-0" size={18} />
                <div className="text-sm">
                  <p className="text-white font-semibold">Domingo</p>
                  <p className="text-gray-400">9:00 AM - 2:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p className="flex items-center justify-center md:justify-start gap-1">
                © {currentYear} <span className="font-bold text-white">Reformery Pilates Studio</span>. 
                Todos los derechos reservados.
              </p>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <span>Desarrollado con</span>
              <Heart className="text-red-500 fill-red-500" size={16} />
              <span>por</span>
              <a 
                href="https://github.com/elisarrtech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sage-400 hover:text-sage-300 font-bold transition-colors duration-200"
              >
                @elisarrtech
              </a>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
              <Link to="/privacy" className="hover:text-sage-400 transition-colors duration-200">
                Política de Privacidad
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-sage-400 transition-colors duration-200">
                Términos y Condiciones
              </Link>
              <span>•</span>
              <Link to="/cookies" className="hover:text-sage-400 transition-colors duration-200">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
