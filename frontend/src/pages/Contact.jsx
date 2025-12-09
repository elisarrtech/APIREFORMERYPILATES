import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare, Navigation, User } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';

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
  const [activeContact, setActiveContact] = useState('form');

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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50">
        
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <MessageSquare size={36} className="text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              ¿Cómo podemos ayudarte?
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Estamos aquí para responder todas tus preguntas y guiarte en tu proceso.
            </p>
          </div>
        </section>

        {/* Quick Contact Tabs */}
        <section className="py-12 bg-white border-b border-blue-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveContact('form')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeContact === 'form' ? 'bg-orange-500 text-white shadow-lg' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
              >
                <div className="flex items-center gap-2">
                  <Send size={18} />
                  Enviar Mensaje
                </div>
              </button>
              
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaWhatsapp size={20} />
                WhatsApp
              </a>
              
              <a
                href="tel:+5212345678"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Phone size={18} />
                Llamar Ahora
              </a>
              
              <a
                href="mailto:contacto@ollin.com"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Mail size={18} />
                Correo
              </a>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
              
              {/* Contact Information Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <MapPin className="text-blue-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-800">Visítanos</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">DIRECCIÓN</h3>
                      <p className="text-blue-800 font-medium">
                        Av. Revolución 1234, Col. Centro<br />
                        Ciudad de México, CDMX 06000
                      </p>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm mt-2 transition-colors"
                      >
                        <Navigation size={16} />
                        Ver en Google Maps
                      </a>
                    </div>

                    <div className="pt-4 border-t border-blue-200">
                      <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">HORARIO DE ATENCIÓN</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Lunes - Viernes</span>
                          <span className="text-blue-800 font-semibold">6:00 - 21:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Sábado</span>
                          <span className="text-blue-800 font-semibold">8:00 - 18:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Domingo</span>
                          <span className="text-blue-800 font-semibold">9:00 - 14:00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-8 border border-orange-200 shadow-lg">
                  <h3 className="text-xl font-bold text-blue-800 mb-6">Conéctate con Nosotros</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 bg-blue-50 hover:bg-blue-500 rounded-xl transition-all duration-300"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full border-2 border-blue-500 group-hover:border-white text-blue-500 group-hover:text-white flex items-center justify-center mb-2 transition-all duration-300">
                          <FaFacebookF size={22} />
                        </div>
                        <span className="text-sm font-semibold text-blue-700 group-hover:text-white transition-colors duration-300">Facebook</span>
                      </div>
                    </a>
                    
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 bg-orange-50 hover:bg-orange-500 rounded-xl transition-all duration-300"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full border-2 border-orange-500 group-hover:border-white text-orange-500 group-hover:text-white flex items-center justify-center mb-2 transition-all duration-300">
                          <FaInstagram size={24} />
                        </div>
                        <span className="text-sm font-semibold text-orange-700 group-hover:text-white transition-colors duration-300">Instagram</span>
                      </div>
                    </a>
                    
                    <a
                      href="https://wa.me/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 bg-green-50 hover:bg-green-500 rounded-xl transition-all duration-300"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full border-2 border-green-500 group-hover:border-white text-green-500 group-hover:text-white flex items-center justify-center mb-2 transition-all duration-300">
                          <FaWhatsapp size={24} />
                        </div>
                        <span className="text-sm font-semibold text-green-700 group-hover:text-white transition-colors duration-300">WhatsApp</span>
                      </div>
                    </a>
                    
                    <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 bg-blue-50 hover:bg-blue-500 rounded-xl transition-all duration-300"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full border-2 border-blue-400 group-hover:border-white text-blue-400 group-hover:text-white flex items-center justify-center mb-2 transition-all duration-300">
                          <FaTiktok size={22} />
                        </div>
                        <span className="text-sm font-semibold text-blue-700 group-hover:text-white transition-colors duration-300">TikTok</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-blue-800">
                        Envíanos tu Mensaje
                      </h2>
                      <p className="text-blue-600">Te responderemos en menos de 24 horas</p>
                    </div>
                  </div>

                  {submitSuccess && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl flex items-start gap-4 text-green-700 animate-fade-in">
                      <CheckCircle size={28} className="text-green-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-lg text-green-800">¡Mensaje enviado con éxito!</p>
                        <p className="text-green-700 mt-1">Hemos recibido tu mensaje y te contactaremos pronto.</p>
                        <p className="text-sm text-green-600 mt-2">
                          Normalmente respondemos en menos de 24 horas hábiles.
                        </p>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl text-red-700 animate-shake">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-red-600 font-bold">!</span>
                        </div>
                        <div>
                          <p className="font-bold text-red-800">Error al enviar</p>
                          <p>{submitError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-blue-800">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none"
                          placeholder="Juan Pérez"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-blue-800">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none"
                          placeholder="juan@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-blue-800">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none"
                          placeholder="55 1234 5678"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-blue-800">
                          Asunto *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none"
                        >
                          <option value="">Selecciona un asunto</option>
                          <option value="informacion">Información general</option>
                          <option value="clases">Información sobre clases</option>
                          <option value="paquetes">Paquetes y precios</option>
                          <option value="reservas">Reservas y horarios</option>
                          <option value="problemas">Problemas técnicos</option>
                          <option value="otros">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-blue-800">
                        Mensaje *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 placeholder-blue-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none resize-none"
                        placeholder="Describe tu consulta o mensaje aquí..."
                      ></textarea>
                      <p className="text-xs text-blue-500 mt-1">
                        Por favor, incluye todos los detalles relevantes para poder ayudarte mejor.
                      </p>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl uppercase tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Enviando mensaje...
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            Enviar Mensaje
                            <span className="text-sm font-normal normal-case">(Respuesta en 24h)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Additional Contact Methods */}
                <div className="grid md:grid-cols-2 gap-6 mt-12">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Phone className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-blue-800">Llamada Telefónica</h3>
                        <p className="text-sm text-blue-600">Atención inmediata</p>
                      </div>
                    </div>
                    <a
                      href="tel:+525512345678"
                      className="text-2xl font-bold text-blue-800 hover:text-orange-600 transition-colors"
                    >
                      55 1234 5678
                    </a>
                    <p className="text-sm text-blue-600 mt-2">Disponible en horario de atención</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Mail className="text-green-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-blue-800">Correo Electrónico</h3>
                        <p className="text-sm text-blue-600">Respuesta formal</p>
                      </div>
                    </div>
                    <a
                      href="mailto:contacto@ollin.com"
                      className="text-lg font-bold text-blue-800 hover:text-orange-600 transition-colors break-all"
                    >
                      contacto@ollin.com
                    </a>
                    <p className="text-sm text-blue-600 mt-2">Respondemos en 24 horas hábiles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-blue-800">Ubicación del Estudio</h2>
              </div>
              
              <div className="h-64 md:h-96 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-300">
                <div className="text-center">
                  <MapPin size={48} className="text-blue-600 mx-auto mb-4" />
                  <p className="text-blue-800 font-semibold">Av. Revolución 1234, Col. Centro</p>
                  <p className="text-blue-600">Ciudad de México, CDMX 06000</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Navigation size={16} />
                    Abrir en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
