import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import AuthModal from '../components/auth/AuthModal';
import userPackageService from '../services/userPackageService';
import { Calendar, ArrowRight, Check, Star, Users, Dumbbell } from 'lucide-react';
import Principles from '../components/Principles';

const COLORS = {
  muted: '#E1DBE1',    // light mauve / neutral
  accent: '#DC6D27',   // orange
  primary: '#1B3D4E',  // deep teal (main)
  warm: '#944E22',     // warm brown
  green: '#2A6130',    // deep green
};

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkingPackages, setCheckingPackages] = useState(false);

  const handleReserveClick = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    try {
      setCheckingPackages(true);
      const hasActivePackages = await userPackageService.hasActivePackages();

      if (hasActivePackages) {
        navigate('/schedules');
      } else {
        alert(
          '⚠️ No tienes paquetes activos.\n\nPara reservar una clase, primero debes comprar un paquete.\n\n📦 Elige tu paquete abajo.'
        );

        const packagesSection = document.getElementById('paquetes-section');
        if (packagesSection) {
          packagesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error('Error verificando paquetes:', error);
      alert('❌ Error al verificar tus paquetes. Intenta de nuevo.');
    } finally {
      setCheckingPackages(false);
    }
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  const packages = [
    { id: 1, name: 'Clase Muestra', classes: 1, displayTitle: '1', price: '$150', validity: 10, features: ['1 Clase Reformery'], popular: false },
    { id: 2, name: 'Clase Individual', classes: 1, displayTitle: '1', price: '$200', validity: 10, features: ['1 Clase Reformery'], popular: false },
    { id: 3, name: 'Paquete 5 Clases', classes: 5, displayTitle: '5', price: '$800', validity: 30, features: ['5 Clases Reformery'], popular: false },
    { id: 4, name: 'Paquete 8 Clases', classes: 8, displayTitle: '8', price: '$1,000', validity: 30, features: ['8 Clases Reformery'], popular: true },
    { id: 5, name: 'Paquete 12 Clases', classes: 12, displayTitle: '12', price: '$1,400', validity: 30, features: ['12 Clases Reformery'], popular: false },
    { id: 6, name: 'Paquete 20 Clases', classes: 20, displayTitle: '20', price: '$1,900', validity: 30, features: ['20 Clases Reformery'], popular: false },
    { id: 7, name: 'Clase Duo', classes: 2, displayTitle: 'CLASE\nDUO', price: '$380', validity: 3, features: ['1 Clase Reformery', '1 Clase Top Barre'], popular: false },
    { id: 8, name: 'Paquete 5+5', classes: 10, displayTitle: 'PAQUETE\n5+5', price: '$1,400', validity: 30, features: ['5 Clases Reformery', '5 Clases Top Barre'], popular: false },
    { id: 9, name: 'Paquete 8+8', classes: 16, displayTitle: 'PAQUETE\n8+8', price: '$1,800', validity: 30, features: ['8 Clases Reformery', '8 Clases Top Barre'], popular: false },
  ];

  const classesInfo = [
    { name: 'PLT FIT', description: 'Nuestros clásicos movimientos de pilates enfocados en diferentes puntos del cuerpo.', image: '/images/foto1.png', slug: 'plt-fit' },
    { name: 'PLT BLAST', description: 'La fusión de Reformer con barra basada en movimientos de ballet y alta intensidad.', image: '/images/foto2.png', slug: 'plt-blast' },
    { name: 'PLT JUMP', description: 'Clase divertida y activa que combina pilates con cardio para elevar tu ritmo.', image: '/images/foto3.png', slug: 'plt-jump' },
    { name: 'PLT HIT', description: 'Sesión de alta intensidad enfocada en fuerza y resistencia con movimientos pilates.', image: '/images/foto4.png', slug: 'plt-hit' },
    { name: 'PLT PRIVADA TRAPEZE', description: 'Reformer/Trapeze: el equipo más versátil para sesiones privadas muy personalizadas.', image: '/images/foto5.png', slug: 'plt-trapeze' },
    { name: 'PLT CLASES PRIVADAS Y SEMIPRIVADAS', description: 'Clases personalizadas y semiprivadas para atención individualizada.', image: '/images/foto6.png', slug: 'plt-privadas' },
    { name: 'PLT CLASES PARA EMBARAZADAS', description: 'Clases especializadas para futuras mamás con adaptaciones seguras.', image: '/images/embarazada.png', slug: 'plt-embarazadas' },
  ];

  return (
    <>
      <Navbar />

      <div
        className="min-h-screen font-sans"
        style={{
          background: `linear-gradient(180deg, ${COLORS.muted} 0%, #ffffff 35%, ${COLORS.primary}0D 100%)`,
        }}
      >
        {/* HERO SECTION */}
        <section className="relative min-h-screen">
          <div className="container mx-auto px-6 lg:px-12 h-full">
            <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-12 lg:py-0 gap-12 lg:gap-16">
              {/* IMAGE */}
              <div className="w-full lg:w-[52%] relative">
                <div className="absolute -left-4 top-1/4 w-1 h-32 rounded-full hidden lg:block" style={{ background: `linear-gradient(to bottom, ${COLORS.primary}, ${COLORS.green})`, opacity: 0.25 }} />
                <div className="absolute -right-4 bottom-1/4 w-1 h-24 rounded-full hidden lg:block" style={{ background: `linear-gradient(to bottom, ${COLORS.primary}, ${COLORS.green})`, opacity: 0.15 }} />

                <div className="relative group">
                  <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.green}05)` }} />
                  <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-2" style={{ borderColor: `${COLORS.muted}66` }}>
                    <div className="aspect-[4/5] lg:aspect-[3/4] relative">
                      <img
                        src="/images/pilateshome.png"
                        alt="Clase de Pilates en grupo"
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 transition-opacity duration-500" aria-hidden style={{ background: 'linear-gradient(180deg, rgba(26,45,62,0.28), rgba(0,0,0,0.08))', opacity: 0.6 }} />
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border" style={{ borderColor: `${COLORS.muted}66` }}>
                        <p className="text-sage-700 font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: COLORS.primary }}>
                          <Dumbbell size={16} />
                          OL-LIN
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TEXT */}
              <div className="w-full lg:w-[48%] space-y-8">
                <div className="space-y-4">
                  <div className="inline-block">
                    <span className="text-sm uppercase tracking-[0.3em] font-semibold mb-3 block" style={{ color: COLORS.primary }}>
                      Bienvenido a
                    </span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-light leading-tight" style={{ color: '#1F2B2E' }}>
                    OL-LIN
                    <span className="block text-3xl lg:text-5xl mt-2 italic font-medium" style={{ color: COLORS.primary }}>
                      Estudio Fitness
                    </span>
                  </h1>
                </div>

                <p className="text-lg lg:text-xl leading-relaxed font-light max-w-xl" style={{ color: '#374151' }}>
                  Clases para cualquier nivel de entrenamiento.
                  <span className="block mt-3 font-medium" style={{ color: COLORS.primary }}>
                    Descubre la fuerza que hay en ti.
                  </span>
                </p>

                <div className="grid grid-cols-3 gap-6 py-6 border-y" style={{ borderColor: `${COLORS.muted}66` }}>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold mb-1" style={{ color: COLORS.primary }}>100%</div>
                    <div className="text-sm uppercase tracking-wide" style={{ color: '#6B7280' }}>Profesional</div>
                  </div>
                  <div className="text-center border-x" style={{ borderColor: `${COLORS.muted}66` }}>
                    <div className="text-3xl lg:text-4xl font-bold mb-1" style={{ color: COLORS.accent }}>20</div>
                    <div className="text-sm uppercase tracking-wide" style={{ color: '#6B7280' }}>Cupo Mensual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold mb-1" style={{ color: COLORS.green }}>7</div>
                    <div className="text-sm uppercase tracking-wide" style={{ color: '#6B7280' }}>Clases</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleReserveClick}
                    disabled={checkingPackages}
                    aria-disabled={checkingPackages}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base uppercase tracking-wider"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: '#FFFFFF',
                      boxShadow: `0 6px 18px ${COLORS.primary}33`,
                    }}
                  >
                    <Calendar className="mr-2" size={20} />
                    {checkingPackages ? 'Verificando...' : 'RESERVA TU CLASE'}
                  </button>

                  {!isAuthenticated ? (
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base uppercase tracking-wider"
                      style={{
                        border: `2px solid ${COLORS.primary}`,
                        background: 'transparent',
                        color: COLORS.primary,
                      }}
                    >
                      INICIAR SESIÓN
                      <ArrowRight className="ml-2" size={20} />
                    </button>
                  ) : (
                    <Link
                      to={
                        user?.role === 'admin'
                          ? '/admin/dashboard'
                          : user?.role === 'instructor'
                          ? '/instructor/dashboard'
                          : '/client/dashboard'
                      }
                      className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base uppercase tracking-wider"
                      style={{
                        border: `2px solid ${COLORS.primary}`,
                        background: 'transparent',
                        color: COLORS.primary,
                      }}
                    >
                      MI PANEL
                      <ArrowRight className="ml-2" size={20} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN: 6 PRINCIPIOS */}
        <section id="quienes-somos-section" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
                Somos un espacio de entrenamiento
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto font-medium">
                En el que te ayudaremos a través del movimiento a conectar con tu centro, y lograr que
                el cuerpo y mente trabajen en sinergia para lograr cualquier reto de nuestra vida diaria.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {/* Reutiliza tu componente Principles para mantener diseño consistente */}
              <Principles />
            </div>
          </div>
        </section>

        {/* =================== SECCIÓN: Clases =================== */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Nuestras Clases</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Descubre nuestra variedad de clases diseñadas para todos los niveles</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {classesInfo.map((classItem, index) => (
                <div
                  key={index}
                  className="group relative rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105"
                  style={{ minHeight: 320, background: '#0f172a' }}
                >
                  <div className="absolute inset-0">
                    <img src={classItem.image} alt={classItem.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0" aria-hidden style={{ background: 'linear-gradient(180deg, rgba(10,20,30,0.45), rgba(10,20,30,0.65))' }} />
                  </div>

                  <div className="relative h-full p-6 flex flex-col justify-between text-white">
                    <div>
                      <h3 className="text-2xl font-extrabold mb-3">{classItem.name}</h3>
                      <p className="text-sm leading-relaxed opacity-95">{classItem.description}</p>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <Link to={`/classes/${classItem.slug || index}`} className="inline-flex items-center gap-2 font-semibold" style={{ color: COLORS.muted }}>
                        <ArrowRight size={18} /> <span>Ver más</span>
                      </Link>
                      <button
                        className="ml-auto inline-flex items-center gap-2 bg-transparent border rounded-md px-3 py-2"
                        style={{ borderColor: `${COLORS.muted}55`, color: COLORS.muted }}
                        onClick={() => {
                          if (!isAuthenticated) setAuthModalOpen(true);
                          else navigate('/schedules');
                        }}
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================== SECCIÓN: Paquetes (oscura) =================== */}
        <section id="paquetes-section" className="py-20" style={{ background: `linear-gradient(180deg, ${COLORS.primary}, ${COLORS.green})` }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Elige tu Plan de Clases</h2>
              <p className="text-sage-100 max-w-2xl mx-auto" style={{ color: '#EAF6F5' }}>Encuentra el paquete perfecto para tu ritmo de entrenamiento</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="transition-all duration-300 ease-in-out flex flex-col group text-center relative rounded-2xl p-6 shadow-2xl"
                  role="region"
                  aria-label={`Paquete ${pkg.name}`}
                  style={{
                    background: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.18))`,
                    color: '#fff',
                    border: `1px solid rgba(255,255,255,0.06)`,
                  }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-white text-sage-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-lg" style={{ color: COLORS.primary }}>
                        <Star size={12} fill="currentColor" /> Más Popular
                      </div>
                    </div>
                  )}

                  <div className="plan-top">
                    <div className="plan-display text-4xl font-extrabold">{pkg.displayTitle}</div>
                    <div className="plan-sub uppercase tracking-wide mt-1" style={{ color: '#F3F4F6' }}>{pkg.classes > 1 ? 'PAQUETE' : 'CLASE'}</div>
                    <div className="plan-price mt-2 text-2xl font-bold">{pkg.price}</div>
                    {pkg.validity && <div className="plan-desc mt-2 text-sm" style={{ color: '#E6E6E6' }}>Vigencia: {pkg.validity} días</div>}
                  </div>

                  <ul className="mb-6 text-left mt-6 flex-1 px-2 space-y-2">
                    {(pkg.features || []).map((f, i) => (
                      <li key={i} className="text-sm flex items-start gap-3" style={{ color: '#F8FAFC' }}>
                        <span className="mt-1 bg-white/10 rounded-full w-6 h-6 flex items-center justify-center text-xs">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <button
                      className="w-full py-3 rounded-md font-bold"
                      onClick={() => {
                        if (!isAuthenticated) {
                          setAuthModalOpen(true);
                        } else {
                          navigate('/schedules');
                        }
                      }}
                      style={{
                        background: COLORS.accent,
                        color: '#fff',
                        boxShadow: `0 8px 24px ${COLORS.accent}44`,
                        border: `1px solid ${COLORS.warm}33`,
                      }}
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg" style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.green})` }}>
                🏋️
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
                ¿Listo para Comenzar Tu Transformación?
              </h2>
              <p className="text-xl text-gray-600 mb-10 font-medium">
                Únete a nuestra comunidad y descubre todo lo que puedes lograr con Reformer Pilates.
              </p>
              <button
                onClick={handleReserveClick}
                disabled={checkingPackages}
                aria-disabled={checkingPackages}
                className="inline-flex items-center gap-3 px-12 py-4 rounded-xl text-lg font-bold uppercase tracking-wide"
                style={{
                  background: COLORS.primary,
                  color: '#fff',
                  boxShadow: `0 10px 30px ${COLORS.primary}33`,
                }}
              >
                <Calendar size={24} />
                {checkingPackages ? 'Verificando...' : 'Reserva tu Primera Clase'}
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuthModal}
        initialMode="login"
      />
    </>
  );
};

export default Home;
