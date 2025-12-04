import React from "react";
import Logo from "./Logo";

/**
 * Footer simple con logo centrado.
 * Uso la variante 'nombre_blanco' para que contraste con fondo oscuro del footer.
 */
export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Logo variant="nombre_blanco" className="w-24 h-24 object-contain" alt="OL-LIN logo" />
          <p className="text-sm opacity-90">© {new Date().getFullYear()} OL-LIN Estudio Fitness • Todos los derechos reservados</p>
          <p className="text-xs opacity-80">Contacto: contacto@ol-lin.example • Tel: +56 9 0000 0000</p>
        </div>
      </div>
    </footer>
  );
}
