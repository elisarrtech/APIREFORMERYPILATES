import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import AuthModal from '../components/auth/AuthModal';
import userPackageService from '../services/userPackageService';
import { Calendar, ArrowRight, Check, Star, Users, Dumbbell } from 'lucide-react';

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
        navigate('/schedule');
      } else {
        alert('⚠️ No tienes paquetes activos.\n\nPara reservar una clase, primero debes comprar un paquete.\n\n📦 Elige tu paquete abajo.');
        
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
    { name: 'PLT FIT', description: 'Nuestros clásicos movimientos de pilates enfocados en diferentes puntos del cuerpo', image: '/images/foto1.png' },
    { name: 'PLT BLAST', description: 'La nueva fusión de Reformer con barra basado en rápidos movimientos de ballet.', image: '/images/foto2.png' },
    { name: 'PLT JUMP', description: 'Si quieres una clase diferente, divertida y activa, encontrarás la fusión perfecta de movimientos clásicos de pilates con ejercicios cardiovasculares', image: '/images/foto3.png' },
    { name: 'PLT HIT', description: 'Nuestros clásicos movimientos de pilates enfocados en diferentes puntos del cuerpo', image: '/images/foto4.png' },
    { name: 'PLT PRIVADA TRAPEZE', description: 'El Reformer/Trapeze es la pieza más versátil de Pilates hoy en día. Consiste de un reformer completo y un cadillac en uno mismo, en donde pueden practicarse todos los diferentes ejercicios.', image: '/images/foto5.png' },
    { name: 'PLT CLASES PRIVADAS Y SEMIPRIVADAS', description: 'Clases personalizadas para ti', image: '/images/foto6.png' },
    { name: 'PLT CLASES PARA EMBARAZADAS', description: 'Clases especializadas para futuras mamás', image: '/images/embarazada.png' },
  ];

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50">
        
        {/* HERO SECTION */}
        <section className="relative min-h-screen">
          <div className="container mx-auto px-6 lg:px-12 h-full">
            <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-12 lg:py-0 gap-12 lg:gap-16">
              
              {/* IMAGEN */}
              <div className="w-full lg:w-[52%] relative">
                <div className="absolute -left-4 top-1/4 w-1 h-32 bg-gradient-to-b from-orange-500 to-blue-700 opacity-30 rounded-full hidden lg:block"></div>
                <div className="absolute -right-4 bottom-1/4 w-1 h-24 bg-gradient-to-b from-blue-700 to-orange-500 opacity-20 rounded-full hidden lg:block"></div>

                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/10 to-blue-700/5 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                  
                  <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border-2 border-orange-200">
                    <div className="aspect-[4/5] lg:aspect-[3/4]">
                      <img
                        src="/images/pilateshome.png"
                        alt="Clase de Pilates en grupo"
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-200">
                        <p className="text-orange-600 font-bold text-sm uppercase tracking-wider flex items-center gap-2" 
                           style={{ 
                             fontFamily: 'Helvetica, Arial, sans-serif',
                             fontWeight: 'bold'
                           }}>
                          <Dumbbell size={16} />
                          OL-LIN Estudio Fitness
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
                    <span className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold mb-3 block" 
                          style={{ 
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 'bold'
                          }}>
                      Bienvenido a
                    </span>
                  </div>
                  {/* Logo OL-LIN con tipografía exacta */}
                  <div className="space-y-2">
                    <h1 
                      className="text-5xl lg:text-7xl leading-tight"
                      style={{ 
                        color: '#1B3D4E',
                        letterSpacing: '-0.03em',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 'bold'
                      }}
                    >
                      OL-LIN
                    </h1>
                    <div 
                      className="italic"
                      style={{
                        fontSize: 'calc(1rem * 7 * 0.34)', // 34% del tamaño de OL-LIN
                        color: '#DC6D27',
                        letterSpacing: '0.02em',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontStyle: 'italic'
                      }}
                    >
                      Estudio Fitness
                    </div>
                  </div>
                </div>

                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed font-light max-w-xl" 
                   style={{ 
                     color: '#1B3D4E',
                     fontFamily: 'Helvetica, Arial, sans-serif'
                   }}>
                  Clases para cualquier nivel de entrenamiento.
                  <span className="block mt-3 font-medium" 
                        style={{ 
                          color: '#1B3D4E',
                          fontFamily: 'Helvetica, Arial, sans-serif',
                          fontWeight: 'bold'
                        }}>
                    Descubre la fuerza que hay en ti.
                  </span>
                </p>

                <div className="grid grid-cols-3 gap-6 py-6 border-y border-orange-200">
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold mb-1" 
                         style={{ 
                           color: '#1B3D4E',
                           fontFamily: 'Helvetica, Arial, sans-serif',
                           fontWeight: 'bold'
                         }}>100%</div>
                    <div className="text-sm uppercase tracking-wide" 
                         style={{ 
                           color: '#1B3D4E',
                           fontFamily: 'Helvetica, Arial, sans-serif',
                           fontWeight: 'bold'
                         }}>Profesional</div>
                  </div>
                  <div className="text-center border-x border-orange-200">
                    <div className="text-3xl lg:text-4xl font-bold mb-1" 
                         style={{ 
                           color: '#1B3D4E',
                           fontFamily: 'Helvetica, Arial, sans-serif',
                           fontWeight: 'bold'
                         }}>20</div>
                    <div className="text-sm uppercase tracking-wide" 
                         style={{ 
                           color: '#1B3D4E',
                           fontFamily: 'Helvetica, Arial, sans-serif',
                           fontWeight: 'bold'
                         }}>Cupo Mensual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold mb-1" 
                         style={{ 
                           color: '#1B3D4E',
                           fontFamily: 'Helvetica, Arial, sans-serif',
                           fontWeight: 'bold'
                         }}>7</div>
                    <div className="text-sm uppercase tracking-wide" 
                         style={{ 
                           color: '#1B3D4E',
                           fontFamily: 'Helvetica, Arial, sans-serif',
                           fontWeight: 'bold'
                         }}>Clases</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleReserveClick}
                    disabled={checkingPackages}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base uppercase tracking-wider transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(to right, #DC6D27, #944E22)',
                      color: 'white',
                      fontSize: '0.95rem',
                      letterSpacing: '0.05em',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 'bold'
                    }}
                  >
                    <Calendar className="mr-2" size={20} />
                    {checkingPackages ? 'Verificando...' : 'RESERVA TU CLASE'}
                  </button>
                  
                  {!isAuthenticated ? (
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="inline-flex items-center justify-center px-8 py-4 border-2 rounded-xl text-base uppercase tracking-wider hover:bg-orange-50 transform hover:scale-[1.02] transition-all duration-300"
                      style={{
                        borderColor: '#DC6D27',
                        color: '#DC6D27',
                        fontSize: '0.95rem',
                        letterSpacing: '0.05em',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 'bold'
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
                      className="inline-flex items-center justify-center px-8 py-4 border-2 rounded-xl text-base uppercase tracking-wider hover:bg-orange-50 transform hover:scale-[1.02] transition-all duration-300"
                      style={{
                        borderColor: '#DC6D27',
                        color: '#DC6D27',
                        fontSize: '0.95rem',
                        letterSpacing: '0.05em',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 'bold'
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
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6" 
                  style={{ 
                    color: '#1B3D4E',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 'bold'
                  }}>
                Somos un espacio de entrenamiento
              </h2>
              <p className="text-lg max-w-4xl mx-auto font-medium" 
                 style={{ 
                   color: '#1B3D4E',
                   fontFamily: 'Helvetica, Arial, sans-serif'
                 }}>
                En el que te ayudaremos a través del movimiento a conectar con tu centro, y lograr que
                el cuerpo y mente trabajen en sinergia para lograr cualquier reto de nuestra vida diaria.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              
              {/* 1. FLOW */}
              <div className="text-center group">
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                  <div className="w-24 h-24 mx-auto">
                    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                      <circle cx="50" cy="50" r="35" stroke="#2A6130" strokeWidth="2.5" opacity="0.8"/>
                      <path d="M30 50 Q40 35, 50 50 T70 50" stroke="#2A6130" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                      <path d="M25 65 Q50 70, 75 65" stroke="#2A6130" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold italic" 
                    style={{ 
                      color: '#1B3D4E',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 'bold',
                      fontStyle: 'italic'
                    }}>flow</h3>
              </div>

              {/* 2. CENTRING */}
              <div className="text-center group">
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                  <div className="w-24 h-24 mx-auto">
                    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                      <circle cx="50" cy="50" r="35" stroke="#2A6130" strokeWidth="2.5" opacity="0.8"/>
                      <line x1="50" y1="20" x2="50" y2="80" stroke="#2A6130" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="20" y1="50" x2="80" y2="50" stroke="#2A6130" strokeWidth="2.5" strokeLinecap="round"/>
                      <circle cx="50" cy="50" r="10" fill="#2A6130" opacity="0.7"/>
                      <circle cx="50" cy="50" r="5" fill="#FFFFFF"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold italic" 
                    style={{ 
                      color: '#1B3D4E',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 'bold',
                      fontStyle: 'italic'
                    }}>centring</h3>
              </div>

              {/* 3. BREATH */}
              <div className="text-center group">
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                  <div className="w-24 h-24 mx-auto">
                    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                      <circle cx="50" cy="50" r="35" stroke="#2A6130" strokeWidth="2.5" opacity="0.8"/>
                      <path d="M50 30 C30 30, 30 70, 50 70 C70 70, 70 30, 50 30" 
                            stroke="#2A6130" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                      <path d="M50 40 C40 40, 40 60, 50 60 C60 60, 60 40, 50 40" 
                            stroke="#2A6130" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      <path d="M50 45 L50 55" stroke="#2A6130" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold italic" 
                    style={{ 
                      color: '#1B3D4E',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 'bold',
                      fontStyle: 'italic'
                    }}>breath</h3>
              </div>

              {/* 4. CONCENTRATION */}
              <div className="text-center group">
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                  <div className="w-24 h-24 mx-auto">
                    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                      <circle cx="50" cy="50" r="35" stroke="#2A6130" strokeWidth="2.5" opacity="0.8"/>
                      <circle cx="35" cy="45" r="4" fill="#2A6130"/>
                      <circle cx="65" cy="45" r="4" fill="#2A6130"/>
                      <path d="M35 60 Q50 70, 65 60" stroke="#2A6130" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                      <path d="M50 30 L50 40" stroke="#2A6130" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold italic" 
                    style={{ 
                      color: '#1B3D4E',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 'bold',
                      fontStyle: 'italic'
                    }}>concentration</h3>
              </div>

              {/* 5. CONTROL */}
              <div className="text-center group">
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                  <div className="w-24 h-24 mx-auto">
                    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                      <circle cx="50" cy="50" r="35" stroke="#2A6130" strokeWidth="2.5" opacity="0.8"/>
                      <rect x="35" y="35" width="30" height="30" rx="5" stroke="#2A6130" strokeWidth="2.5" fill="none"/>
                      <line x1="45" y1="35" x2="45" y2="65" stroke="#2A6130" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="55" y1="35" x2="55" y2="65" stroke="#2A6130" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="35" y1="45" x2="65" y2="45" stroke="#2A6130" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="35" y1="55" x2="65" y2="55" stroke="#2A6130" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold italic" 
                    style={{ 
                      color: '#1B3D4E',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 'bold',
                      fontStyle: 'italic'
                    }}>control</h3>
              </div>

              {/* 6. PRECISION */}
              <div className="text-center group">
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                  <div className="w-24 h-24 mx-auto">
                    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                      <circle cx="50" cy="50" r="35" stroke="#2A6130" strokeWidth="2.5" opacity="0.8"/>
                      <circle cx="50" cy="50" r="15" stroke="#2A6130" strokeWidth="2.5" fill="none"/>
                      <line x1="50" y1="20" x2="50" y2="35" stroke="#2A6130" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="50" y1="65" x2="50" y2="80" stroke="#2A6130" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="20" y1="50" x2="35" y2="50" stroke="#2A6130" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="65" y1="50" x2="80" y2="50" stroke="#2A6130" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="50" cy="50" r="3" fill="#2A6130"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold italic" 
                    style={{ 
                      color: '#1B3D4E',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 'bold',
                      fontStyle: 'italic'
                    }}>precision</h3>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN: Nuestras Clases */}
        <section id="clases-section" className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4" 
                  style={{ 
                    color: '#1B3D4E',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 'bold'
                  }}>
                Nuestras Clases
              </h2>
              <p className="max-w-2xl mx-auto" 
                 style={{ 
                   color: '#1B3D4E',
                   fontFamily: 'Helvetica, Arial, sans-serif'
                 }}>
                Descubre nuestra variedad de clases diseñadas para todos los niveles
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {classesInfo.map((classItem, index) => (
                <div
                  key={index}
                  className="relative h-64 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gray-800">
                    <img
                      src={classItem.image}
                      alt={classItem.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/50 to-blue-900/30"></div>
                  </div>

                  <div className="relative h-full p-6 flex flex-col justify-between text-white">
                    <div>
                      <h3 className="text-2xl font-extrabold mb-3" 
                          style={{ 
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 'bold'
                          }}>{classItem.name}</h3>
                      <p className="text-sm leading-relaxed opacity-90" 
                         style={{ 
                           fontFamily: 'Helvetica, Arial, sans-serif'
                         }}>{classItem.description}</p>
                    </div>
                    <div className="flex items-center font-semibold" 
                         style={{ 
                           color: '#DC6D27',
                           fontFamily: 'Helvetica, Arial, sans-serif',
                           fontWeight: 'bold'
                         }}>
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                      <span className="ml-2">Ver más</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN: Paquetes - CORREGIDO CON LETRA BIEN RELLENA */}
        <section id="paquetes-section" className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" 
                  style={{ 
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 'bold'
                  }}>
                Elige tu Plan de Clases
              </h2>
              <p className="text-blue-100 max-w-2xl mx-auto" 
                 style={{ 
                   fontFamily: 'Helvetica, Arial, sans-serif'
                 }}>
                Encuentra el paquete perfecto para tu ritmo de entrenamiento
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-white/10 backdrop-blur-sm border-2 ${
                    pkg.popular ? 'border-orange-300' : 'border-white/20'
                  } rounded-2xl p-8 text-white hover:bg-white/20 transition-all duration-300 ease-in-out flex flex-col group text-center relative`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="px-4 py-1 rounded-full text-xs uppercase tracking-wide flex items-center gap-1 shadow-lg"
                           style={{ 
                             backgroundColor: '#DC6D27', 
                             color: 'white',
                             fontFamily: 'Helvetica, Arial, sans-serif',
                             fontWeight: 'bold'
                           }}>
                        <Star size={12} fill="currentColor" />
                        Más Popular
                      </div>
                    </div>
                  )}

                  <div className="text-4xl md:text-5xl font-extrabold mb-2 text-white drop-shadow-md group-hover:scale-110 transition-transform whitespace-pre-line"
                       style={{ 
                         fontFamily: 'Helvetica, Arial, sans-serif',
                         fontWeight: 'bold'
                       }}>
                    {pkg.displayTitle}
                  </div>

                  <div className="text-sm uppercase tracking-wider mb-2 font-medium text-white/80"
                       style={{ 
                         fontFamily: 'Helvetica, Arial, sans-serif',
                         fontWeight: 'bold'
                       }}>
                    {pkg.name.startsWith('Clase') ? 'CLASE' : 'PAQUETE'}
                  </div>

                  <div className="text-3xl md:text-4xl font-bold mb-2" 
                       style={{ 
                         color: '#DC6D27',
                         fontFamily: 'Helvetica, Arial, sans-serif',
                         fontWeight: 'bold'
                       }}>
                    {pkg.price}
                  </div>

                  <div className="text-sm opacity-80 mb-4 font-medium" 
                       style={{ 
                         fontFamily: 'Helvetica, Arial, sans-serif'
                       }}>
                    Vigencia: {pkg.validity} días
                  </div>

                  <div className="border-t border-white/20 my-4"></div>

                  <div className="mb-6 space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="text-sm font-medium flex items-center justify-center gap-2"
                        style={{ 
                          fontFamily: 'Helvetica, Arial, sans-serif'
                        }}
                      >
                        <Check size={16} style={{ color: '#DC6D27' }} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleReserveClick}
                    className="w-full py-3 rounded-xl font-bold hover:bg-orange-600 transition-all duration-300 uppercase tracking-wide transform hover:scale-[1.02] shadow-lg"
                    style={{
                      backgroundColor: '#DC6D27',
                      color: 'white',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 'bold'
                    }}
                  >
                    Comprar Paquete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg"
                   style={{
                     background: 'linear-gradient(to right, #DC6D27, #944E22)'
                   }}>
                🏋️
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6" 
                  style={{ 
                    color: '#1B3D4E',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 'bold'
                  }}>
                ¿Listo para Comenzar Tu Transformación?
              </h2>
              <p className="text-xl mb-10 font-medium" 
                 style={{ 
                   color: '#1B3D4E',
                   fontFamily: 'Helvetica, Arial, sans-serif'
                 }}>
                Únete a nuestra comunidad y descubre todo lo que puedes lograr con Reformer Pilates.
              </p>
              <button
                onClick={handleReserveClick}
                disabled={checkingPackages}
                className="inline-flex items-center gap-3 rounded-xl text-lg font-bold transform transition-all uppercase tracking-wide hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50"
                style={{
                  background: 'linear-gradient(to right, #DC6D27, #944E22)',
                  color: 'white',
                  padding: '1rem 3rem',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 'bold'
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
