
/**
 * Landing Page - Página de Inicio Pública
 * Autor: @elisarrtech con Elite AI Architect
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaCalendarAlt, FaUsers, FaCheckCircle } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-8">
              <FaDumbbell className="text-primary-500 text-5xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              FitnessClub
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Sistema Profesional de Reservas de Clases de Pilates
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-primary-600 text-white rounded-lg font-bold text-lg hover:bg-primary-800 transition border-2 border-white"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FaCalendarAlt />}
            title="Reservas Fáciles"
            description="Sistema de calendario intuitivo para reservar tus clases favoritas"
          />
          <FeatureCard
            icon={<FaUsers />}
            title="Gestión de Paquetes"
            description="Control total de tus clases y seguimiento de paquetes"
          />
          <FeatureCard
            icon={<FaCheckCircle />}
            title="Confirmación Instantánea"
            description="Recibe confirmación inmediata de tus reservas"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 FitnessClub. Desarrollado por <strong>@elisarrtech</strong></p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center p-8 bg-white rounded-lg shadow-lg">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full text-primary-600 text-3xl mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage;
```
