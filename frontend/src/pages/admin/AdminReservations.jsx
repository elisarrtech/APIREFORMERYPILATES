import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaCheck, FaClock, FaCalendarCheck, FaWhatsapp } from 'react-icons/fa';
import * as packagesAPI from '../services/packagesAPI';

const Plans = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (pkg) => {
    if (isAuthenticated) {
      navigate('/cart', { state: { package: pkg } });
    } else {
      // opcional: mandar returnTo para redirigir después del login
      navigate('/login', { state: { returnTo: '/cart', package: pkg } });
    }
  };

  // --- Static fallback (tu array original) ---
  const STATIC_PACKAGES = [
    {
      id: 1,
      slug: 'clase-muestra',
      name: 'Clase Muestra',
      classes: 1,
      displayTitle: '1',
      price: '$150',
      price_amount: 150,
      validity: 10,
      features: ['1 Clase Reformery']
    },
    {
      id: 2,
      slug: 'clase-individual',
      name: 'Clase Individual',
      classes: 1,
      displayTitle: '1',
      price: '$200',
      price_amount: 200,
      validity: 10,
      features: ['1 Clase Reformery']
    },
    {
      id: 3,
      slug: 'paquete-5-clases',
      name: 'Paquete 5 Clases',
      classes: 5,
      displayTitle: '5',
      price: '$800',
      price_amount: 800,
      validity: 30,
      features: ['5 Clases Reformery'],
      recommended: true
    },
    {
      id: 5,
      slug: 'paquete-12-clases',
      name: 'Paquete 12 Clases',
      classes: 12,
      displayTitle: '12',
      price: '$1,400',
      validity: 30,
      features: ['12 Clases Reformery']
    },
    {
      id: 6,
      slug: 'paquete-20-clases',
      name: 'Paquete 20 Clases',
      classes: 20,
      displayTitle: '20',
      price: '$1,900',
      validity: 30,
      features: ['20 Clases Reformery']
    },
    {
      id: 7,
      slug: 'clase-duo',
      name: 'Clase Duo',
      classes: 2,
      displayTitle: 'CLASE\nDUO',
      price: '$380',
      validity: 3,
      features: [
        '1 Clase Reformery',
        '1 Clase Top Barre'
      ]
    },
    {
      id: 8,
      slug: 'paquete-5-plus-5',
      name: 'Paquete 5+5',
      classes: 10,
      displayTitle: 'PAQUETE\n5+5',
      price: '$1,400',
      validity: 30,
      features: [
        '5 Clases Reformery',
        '5 Clases Top Barre'
      ]
    },
    {
      id: 9,
      slug: 'paquete-8-plus-8',
      name: 'Paquete 8+8',
      classes: 16,
      displayTitle: 'PAQUETE\n8+8',
      price: '$1,800',
      validity: 30,
      features: [
        '8 Clases Reformery',
        '8 Clases Top Barre'
      ]
    }
  ];

  // --- State: comenzamos con el array estático como fallback inmediato ---
  const [plans, setPlans] = useState(STATIC_PACKAGES);
  const [loading, setLoading] = useState(true);

  // Helper: mapea un paquete remoto al shape que usa tu UI
  const mapRemoteToUI = (p, index) => {
    const id = p.id || p._id || p.slug || `pkg_${index}`;
    const name = p.name || p.title || p.displayName || 'Paquete';
    const slug = p.slug || (typeof name === 'string' ? name.toLowerCase().replace(/\s+/g, '-') : `pkg-${index}`);
    const classes = p.classes || p.count || (p.meta && p.meta.classes) || 1;
    const displayTitle = p.displayTitle || (classes ? String(classes) : '1');
    let price_amount = typeof p.price_amount !== 'undefined' ? p.price_amount : (typeof p.price === 'number' ? p.price : null);
    if (price_amount === null && typeof p.price === 'string') {
      const num = Number(String(p.price).replace(/[^0-9.-]+/g, '')) || null;
      price_amount = num;
    }
    const currency = p.currency || (typeof p.price === 'string' && p.price.trim().startsWith('$') ? 'USD' : 'USD');
    const price = typeof p.price === 'string' ? p.price : (price_amount != null ? `${currency === 'USD' ? '$' : ''}${price_amount}` : '$0');
    const validity = p.validity || p.validity_days || p.validityDays || p.validity || 30;
    const features = p.features || (p.meta && p.meta.features) || (p.description ? [p.description] : []);
    const recommended = p.recommended || (p.meta && p.meta.recommended) || false;

    return {
      id,
      slug,
      name,
      classes,
      displayTitle,
      price,
      price_amount,
      validity,
      features,
      recommended
    };
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const remote = await packagesAPI.getPackages();
        if (Array.isArray(remote) && remote.length > 0) {
          const mapped = remote.map((p, idx) => mapRemoteToUI(p, idx));
          if (mounted) setPlans(mapped);
        } else {
          if (mounted) setPlans(STATIC_PACKAGES);
        }
      } catch (err) {
        console.warn('No se pudieron cargar paquetes desde API, usando datos estáticos:', err);
        if (mounted) setPlans(STATIC_PACKAGES);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-white via-[#F5F3EF] to-white">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8BA88D]/10 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-[#8BA88D] animate-pulse"></div>
              <span className="text-[#6B7B6F] text-sm font-medium tracking-wide uppercase">Planes Flexibles</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Elige tu Plan de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8BA88D] to-[#6B7B6F]">Clases</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
              Todos nuestros paquetes incluyen acceso a todas las clases del estudio.
              <span className="block mt-2 text-[#6B7B6F] font-medium">Elige el plan que mejor se adapte a tu ritmo de vida</span>
            </p>
          </div>

          {/* Paquetes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-20">
            {plans.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white/80 backdrop-blur-sm border-2 rounded-2xl p-8 text-gray-800 transition-all duration-300 ease-in-out flex flex-col group text-center hover:shadow-2xl ${
                  pkg.recommended
                    ? 'border-[#8BA88D] shadow-xl shadow-[#8BA88D]/20 bg-gradient-to-br from-[#8BA88D]/5 to-[#6B7B6F]/5'
                    : 'border-gray-200 hover:border-[#8BA88D]/50'
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-[#8BA88D] to-[#6B7B6F] text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg uppercase tracking-wider">
                      Más Popular
                    </div>
                  </div>
                )}

                <div className="text-5xl md:text-6xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-br from-[#6B7B6F] to-[#8BA88D] whitespace-pre-line leading-tight">
                  {pkg.displayTitle}
                </div>

                <div className="text-xs uppercase tracking-wider mb-4 font-semibold text-[#6B7B6F]/70">
                  {String(pkg.name).startsWith('Clase') ? 'CLASE' : 'PAQUETE'}
                </div>

                <div className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-800 group-hover:text-[#6B7B6F] transition-colors">
                  {pkg.price}
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6 font-medium">
                  <FaClock className="text-[#8BA88D]" />
                  <span>Vigencia: {pkg.validity} días</span>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="mb-8 space-y-3 flex-grow">
                  {Array.isArray(pkg.features) && pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
                      <FaCheck className="text-[#8BA88D] flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectPlan(pkg)}
                  className={`w-full py-4 rounded-xl font-semibold uppercase tracking-wide text-sm transition-all duration-300 transform ${
                    pkg.recommended
                      ? 'bg-gradient-to-r from-[#8BA88D] to-[#6B7B6F] text-white hover:shadow-xl hover:shadow-[#8BA88D]/30 hover:-translate-y-0.5'
                      : 'bg-gray-800 text-white hover:bg-[#6B7B6F] hover:shadow-lg'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <FaCalendarCheck />
                    Seleccionar Plan
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Elementos decorativos de fondo */}
       <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#8BA88D]/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-[#6B7B6F]/5 to-transparent pointer-events-none"></div>
      </section>

      {/* Información Adicional */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header de sección */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                ¿Cómo Funcionan los Paquetes?
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-[#8BA88D] to-[#6B7B6F] mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#F5F3EF] to-white p-8 rounded-2xl border border-gray-200 hover:border-[#8BA88D]/50 transition-all hover:shadow-lg group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📅</div>
                <h3 className="font-bold text-gray-800 mb-3 text-lg">Vigencia</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Los paquetes tienen vigencia desde la fecha de compra según el plan elegido.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#F5F3EF] to-white p-8 rounded-2xl border border-gray-200 hover:border-[#8BA88D]/50 transition-all hover:shadow-lg group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
                <h3 className="font-bold text-gray-800 mb-3 text-lg">Flexibilidad</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Reserva tus clases con hasta 7 días de anticipación a través de nuestra plataforma.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#F5F3EF] to-white p-8 rounded-2xl border border-gray-200 hover:border-[#8BA88D]/50 transition-all hover:shadow-lg group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">❌</div>
                <h3 className="font-bold text-gray-800 mb-3 text-lg">Cancelaciones</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cancela tus reservas hasta 8 horas antes de la clase sin perder tu crédito.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#F5F3EF] to-white p-8 rounded-2xl border border-gray-200 hover:border-[#8BA88D]/50 transition-all hover:shadow-lg group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔄</div>
                <h3 className="font-bold text-gray-800 mb-3 text-lg">Renovación</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Renueva tu paquete antes de que expire y obtén descuentos exclusivos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gradient-to-br from-[#F5F3EF] via-white to-[#F5F3EF]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header de sección */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Preguntas Frecuentes
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-[#8BA88D] to-[#6B7B6F] mx-auto rounded-full"></div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#8BA88D]/50 transition-all hover:shadow-lg">
                <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-start gap-3">
                  <span className="text-[#8BA88D] text-xl">•</span>
                  ¿Puedo cambiar de paquete?
                </h3>
                <p className="text-gray-600 leading-relaxed ml-7">
                  Sí, puedes actualizar tu paquete en cualquier momento. Las clases restantes de tu paquete actual 
                  se acreditarán proporcionalmente al nuevo plan.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#8BA88D]/50 transition-all hover:shadow-lg">
                <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-start gap-3">
                  <span className="text-[#8BA88D] text-xl">•</span>
                  ¿Qué pasa si no uso todas mis clases?
                </h3>
                <p className="text-gray-600 leading-relaxed ml-7">
                  Las clases no utilizadas vencen después del período de vigencia de tu paquete. Te recomendamos 
                  elegir un plan acorde a tu disponibilidad para aprovechar al máximo tu inversión.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#8BA88D]/50 transition-all hover:shadow-lg">
                <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-start gap-3">
                  <span className="text-[#8BA88D] text-xl">•</span>
                  ¿Ofrecen clases de prueba?
                </h3>
                <p className="text-gray-600 leading-relaxed ml-7">
                  ¡Sí! Tenemos la opción de Clase Muestra por $150. Contáctanos para agendar tu primera clase 
                  y conocer nuestro estudio y metodología.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#8BA88D]/50 transition-all hover:shadow-lg">
                <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-start gap-3">
                  <span className="text-[#8BA88D] text-xl">•</span>
                  ¿Puedo compartir mi paquete con otra persona?
                </h3>
                <p className="text-gray-600 leading-relaxed ml-7">
                  Los paquetes son personales e intransferibles. Sin embargo, ofrecemos descuentos especiales 
                  para grupos y familias. Contáctanos para más información.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-[#8BA88D] to-[#6B7B6F] relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              ¿Necesitas ayuda para elegir?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
              Nuestro equipo está listo para asesorarte y ayudarte a encontrar el plan perfecto para ti.
              <span className="block mt-2 text-white/80">¡Comienza tu transformación hoy!</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/524421092362" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Hablar con un asesor por WhatsApp"
                className="group px-8 py-4 bg-white text-[#6B7B6F] rounded-xl font-semibold uppercase tracking-wide text-sm hover:bg-[#F5F3EF] transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center gap-2">
                  <FaWhatsapp className="w-5 h-5" />
                  Hablar con un Asesor
                </span>
              </a>

              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold uppercase tracking-wide text-sm hover:bg-white hover:text-[#6B7B6F] transition-all duration-300 hover:shadow-xl"
              >
                Contáctanos
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Plans;
