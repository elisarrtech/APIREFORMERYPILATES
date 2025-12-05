import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import AuthModal from '../components/auth/AuthModal';
import userPackageService from '../services/userPackageService';
import { Calendar, ArrowRight, Dumbbell, Star } from 'lucide-react';
import Principles from '../components/Principles';
import ClassesGrid from '../components/ClassesGrid';

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
        alert('⚠️ No tienes paquetes activos.\n\nPara reservar una clase, primero debes comprar un paquete.\n\n📦 Elige tu paquete abajo.');
        const packagesSection = document.getElementById('paquetes-section');
        if (packagesSection) packagesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error verificando paquetes:', error);
      alert('❌ Error al verificar tus paquetes. Intenta de nuevo.');
    } finally {
      setCheckingPackages(false);
    }
  };

  const handleCloseAuthModal = () => setAuthModalOpen(false);

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
    { name: 'PLT FIT', description: 'Nuestros clásicos movimientos de pilates enfocados en diferentes puntos del cuerpo', image: '/images/foto1.png', slug: 'plt-fit' },
    { name: 'PLT BLAST', description: 'La nueva fusión de Reformer con barra basado en rápidos movimientos de ballet.', image: '/images/foto2.png', slug: 'plt-blast' },
    { name: 'PLT JUMP', description: 'Si quieres una clase diferente, divertida y activa, encontrarás la fusión perfecta de movimientos clásicos de pilates con ejercicios cardiovasculares', image: '/images/foto3.png', slug: 'plt-jump' },
    { name: 'PLT HIT', description: 'Nuestros clásicos movimientos de pilates enfocados en diferentes puntos del cuerpo', image: '/images/foto4.png', slug: 'plt-hit' },
    { name: 'PLT PRIVADA TRAPEZE', description: 'El Reformer/Trapeze es la pieza más versátil de Pilates hoy en día. Consiste de un reformer completo y un cadillac en uno mismo, en donde pueden practicarse todos los diferentes ejercicios.', image: '/images/foto5.png', slug: 'plt-privada-trapeze' },
    { name: 'PLT CLASES PRIVADAS Y SEMIPRIVADAS', description: 'Clases personalizadas para ti', image: '/images/foto6.png', slug: 'plt-privadas' },
    { name: 'PLT CLASES PARA EMBARAZADAS', description: 'Clases especializadas para futuras mamás', image: '/images/embarazada.png', slug: 'plt-embarazadas' },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-sage-50 font-sans">

        {/* HERO SECTION */}
        <section className="relative min-h-screen">
          <div className="container mx-auto px-6 lg:px-12 h-full">
            <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-12 lg:py-0 gap-12 lg:gap-16">

              {/* IMAGEN */}
              <div className="w-full lg:w-[52%] relative">
                <div className="absolute -left-4 top-1/4 w-1 h-32 bg-gradient-to-b from-sage-500 to-sage-700 opacity-30 rounded-full hidden lg:block" />
                <div className="absolute -right-4 bottom-1/4 w-1 h-24 bg-gradient-to-b from-sage-700 to-sage-500 opacity-20 rounded-full hidden lg:block" />

                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-br from-sage-500/10 to-sage-700/5 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-2 border-sage-200">
                    <div className="aspect-[4/5] lg:aspect-[3/4]">
                      <img src="/images/pilateshome.png" alt="Clase de Pilates en grupo" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-sage-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden />
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-sage-200">
                        <p className="text-sage-700 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                          <Dumbbell size={16} /> OL-LIN
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* TEXTO */}
              <div className="w-full lg:w-[48%] space-y-8">
                <div className="space-y-4">
                  <div className="inline-block">
                    <span className="text-sm uppercase tracking-[0.3em] text-sage-600 font-semibold mb-3 block">Bienvenido a</span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-light text-gray-800 leading-tight">
                    OL-LIN
                    <span className="block text-3xl lg:text-5xl text-sage-600 mt-2 italic font-medium">Estudio Fitness</span>
                  </h1>
                </div>

                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed font-light max-w-xl">
                  Clases para cualquier nivel de entrenamiento.
                  <span className="block mt-3 text-sage-700 font-medium">Descubre la fuerza que hay en ti.</span>
                </p>

                <div className="grid grid-cols-3 gap-6 py-6 border-y border-sage-200">
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-sage-700 mb-1">100%</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Profesional</div>
                  </div>
                  <div className="text-center border-x border-sage-200">
                    <div className="text-3xl lg:text-4xl font-bold text-sage-700 mb-1">20</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Cupo Mensual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-sage-700 mb-1">7</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Clases</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleReserveClick}
                    disabled={checkingPackages}
                    aria-disabled={checkingPackages}
                    className="btn-primary"
                  >
                    <Calendar className="mr-2" size={20} />
                    {checkingPackages ? 'Verificando...' : 'RESERVA TU CLASE'}
                  </button>

                  {!isAuthenticated ? (
                    <button onClick={() => setAuthModalOpen(true)} className="btn-outline">
                      INICIAR SESIÓN
                      <ArrowRight className="ml-2" size={20} />
                    </button>
                  ) : (
                    <Link to={ user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'instructor' ? '/instructor/dashboard' : '/client/dashboard' } className="btn-outline">
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
      <section id="principles-section" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">Somos un espacio de entrenamiento</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto font-medium">
              En el que te ayudaremos a través del movimiento a conectar con tu centro, y lograr que el cuerpo y mente trabajen en sinergia para lograr cualquier reto de nuestra vida diaria.
            </p>
          </div>

          <Principles />
        </div>
      </section>

      {/* SECCIÓN: Clases */}
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
                className="class-card group cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl relative"
              >
                <div className="absolute inset-0">
                  <img src={classItem.image} alt={classItem.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="image-overlay" aria-hidden />
                </div>

                <div className="card-content relative h-full p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="title text-2xl font-extrabold mb-3">{classItem.name}</h3>
                    <p className="excerpt text-sm leading-relaxed opacity-95">{classItem.description}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <Link to={`/classes/${classItem.slug || index}`} className="link-more inline-flex items-center gap-2 font-semibold text-white">
                      <ArrowRight size={18} /> <span>Ver más</span>
                    </Link>
                    <button className="ml-auto btn-outline hidden md:inline-flex items-center gap-2">Reservar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: Paquetes */}
      <section id="paquetes-section" className="py-20 plan-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Elige tu Plan de Clases</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Encuentra el paquete perfecto para tu ritmo de entrenamiento</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`plan-card-dark transition-all duration-300 ease-in-out flex flex-col group text-center relative`}
                role="region"
                aria-label={`Paquete ${pkg.name}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-white text-sage-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-lg">
                      <Star size={12} fill="currentColor" /> Más Popular
                    </div>
                  </div>
                )}

                <div className="plan-top">
                  <div className="plan-display">{pkg.displayTitle}</div>
                  <div className="plan-sub"> {pkg.classes > 1 ? 'PAQUETE' : 'CLASE'}</div>
                  <div className="plan-price mt-2">{pkg.price}</div>
                  {pkg.validity && <div className="plan-desc mt-2 text-sm">Vigencia: {pkg.validity} días</div>}
                </div>

                <ul className="mb-6 text-left mt-6 flex-1 px-2 space-y-2">
                  {(pkg.features || []).map((f, i) => (
                    <li key={i} className="text-sm text-white flex items-start gap-3">
                      <span className="mt-1 text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center text-xs">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <button
                    className="plan-cta"
                    onClick={() => {
                      if (!isAuthenticated) {
                        setAuthModalOpen(true);
                      } else {
                        navigate('/schedules');
                      }
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
            <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-sage-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg">
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
              className="btn-primary"
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
