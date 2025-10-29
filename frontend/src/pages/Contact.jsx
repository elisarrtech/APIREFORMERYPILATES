import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // TODO: Conectar con tu API backend
      // const response = await contactService.sendMessage(formData);
      
      // SIMULACIÓN
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setSubmitError('Error al enviar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-sage-50">
        
        {/* Header */}
        <section className="py-20 bg-gradient-to-br from-sage-600 to-sage-700">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Contáctanos
            </h1>
            <p className="text-xl text-sage-100 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Comunícate con nosotros por cualquiera de estos medios.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              
              {/* Información de Contacto */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Información de Contacto
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Estamos aquí para ayudarte. Comunícate con nosotros por cualquiera de estos medios.
                  </p>
                </div>

                {/* Dirección */}
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-sage-600" size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Dirección</h3>
                    <p className="text-gray-600">
                      Av. Revolución 1234, Col. Centro, CDMX
                    </p>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sage-600 hover:text-sage-700 font-medium text-sm mt-2 inline-block"
                    >
                      Ver en el mapa →
                    </a>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="text-sage-600" size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Teléfono</h3>
                    <a
                      href="tel:+5212345678"
                      className="text-gray-600 hover:text-sage-600 transition-colors duration-200"
                    >
                      55 1234 5678
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="text-sage-600" size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Email</h3>
                    <a
                      href="mailto:contacto@reformery.com"
                      className="text-gray-600 hover:text-sage-600 transition-colors duration-200"
                    >
                      contacto@reformery.com
                    </a>
                  </div>
                </div>

                {/* Horario */}
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-sage-600" size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Horario</h3>
                    <p className="text-gray-600">
                      Lunes a Viernes: 6:00 AM - 9:00 PM<br />
                      Sábado: 8:00 AM - 6:00 PM<br />
                      Domingo: 9:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>

                {/* Redes Sociales */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Síguenos</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-sage-100 text-sage-600 hover:bg-sage-600 hover:text-white transition-all duration-200"
                    >
                      <FaFacebookF size={20} />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-sage-100 text-sage-600 hover:bg-sage-600 hover:text-white transition-all duration-200"
                    >
                      <FaInstagram size={22} />
                    </a>
                    <a
                      href="https://wa.me/5212345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-sage-100 text-sage-600 hover:bg-sage-600 hover:text-white transition-all duration-200"
                    >
                      <FaWhatsapp size={24} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Envíanos un Mensaje
                </h2>

                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-fade-in">
                    <CheckCircle size={24} />
                    <div>
                      <p className="font-semibold">¡Mensaje enviado!</p>
                      <p className="text-sm">Te responderemos pronto.</p>
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
                      placeholder="55 1234 5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Asunto *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-200 transition-all duration-200 outline-none resize-none"
                      placeholder="Escribe tu mensaje aquí..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-xl uppercase tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;