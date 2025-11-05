import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '524421092362';
  const message = encodeURIComponent('¡Hola! Me gustaría obtener más información sobre las clases de Pilates en Reformery.');
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-3 transform transition-all duration-300 ${
          showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl whitespace-nowrap relative">
          <p className="text-sm font-semibold">¿Necesitas ayuda?</p>
          <p className="text-xs text-gray-300">¡Escríbenos por WhatsApp!</p>
          <div className="absolute -bottom-1 right-4 w-3 h-3 bg-gray-900 transform rotate-45"></div>
        </div>
      </div>

      {/* Main Button */}
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95"
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp size={32} className="drop-shadow-lg" />
      </a>

      {/* Pulse Animation */}
      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 pointer-events-none"></div>
    </div>
  );
};

export default WhatsAppButton;
