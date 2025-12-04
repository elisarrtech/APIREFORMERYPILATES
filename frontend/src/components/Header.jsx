import React from "react";
import Button from "./Button";

/**
 * Header component
 * - usa las clases de Tailwind definidas en tailwind.config.js
 * - importa la versión del logo desde /images/ (ajusta la ruta si hace falta)
 */
export default function Header() {
  return (
    <header className="bg-brand text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            {/* Logo - ajusta src según tu carpeta public/images */}
            <a href="/" className="flex items-center gap-3">
              <img src="/images/logo-dark.png" alt="OL-LIN Logo" className="header-logo" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold leading-none">OL-LIN</h1>
                <p className="text-sm italic opacity-90">Estudio Fitness</p>
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#servicios" className="text-white hover:underline">Servicios</a>
            <a href="#clases" className="text-white hover:underline">Clases</a>
            <a href="#horarios" className="text-white hover:underline">Horarios</a>
            <a href="#contacto" className="text-white hover:underline">Contacto</a>
            <Button variant="outline" className="ml-2">Iniciar sesión</Button>
            <Button variant="primary" className="ml-2">Reservar clase</Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="primary" className="px-3 py-2">Reservar</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
