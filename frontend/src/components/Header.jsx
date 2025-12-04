import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "@context/AuthContext";

/**
 * Header responsivo
 * - Usa Tailwind + tokens de colores definidos en tailwind.config.css
 * - Muestra navegación principal, CTA y estado de usuario (Login / Dashboard / Logout)
 *
 * Asegúrate de tener los logos en public/images:
 * - /images/logo-dark.png  (versión para fondo claro)
 * - /images/logo-light.png (versión para fondo oscuro) -- opcional
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    if (typeof logout === "function") {
      try {
        await logout();
      } catch (err) {
        // opcional: manejar error o mostrar toast
        console.error("Logout error:", err);
      }
    }
  };

  const dashboardPath = (() => {
    const role = user?.role;
    if (role === "admin") return "/admin/dashboard";
    if (role === "client") return "/client/dashboard";
    if (role === "instructor") return "/instructor/dashboard";
    return "/"; // fallback
  })();

  return (
    <header className="bg-brand text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + title */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/logo-dark.png"
                alt="OL-LIN"
                className="w-12 h-12 object-contain"
              />
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-lg font-bold">OL-LIN</span>
                <small className="italic text-sm opacity-90">Estudio Fitness</small>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/#servicios" className="text-white hover:underline">
              Servicios
            </Link>
            <Link to="/schedules" className="text-white hover:underline">
              Clases
            </Link>
            <Link to="/contact" className="text-white hover:underline">
              Contacto
            </Link>

            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-white hover:underline">
                  Iniciar sesión
                </Link>
                <Button variant="primary" to="/register" className="ml-2">
                  Registrarse
                </Button>
              </>
            )}

            {isAuthenticated && (
              <>
                <Link to={dashboardPath} className="text-white hover:underline">
                  Panel
                </Link>

                {/* User menu simple: muestra nombre y logout */}
                <div className="flex items-center gap-2">
                  <div className="text-sm mr-2">
                    <span className="block font-medium">{user?.name ?? "Usuario"}</span>
                    <span className="block text-xs opacity-90">{user?.role}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="ml-1"
                    onClick={handleLogout}
                    aria-label="Cerrar sesión"
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </>
            )}

            {/* CTA reserva */}
            <Button variant="primary" to="/schedules" className="ml-3">
              Reservar clase
            </Button>
          </nav>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-2">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-brand-dark/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menú"
              aria-expanded={open}
            >
              {/* simple hamburger */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Mobile quick CTA */}
            <Button variant="primary" to="/schedules">
              Reservar
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden bg-brand/95 border-t border-brand-dark/40">
          <div className="px-4 py-4 space-y-3">
            <Link to="/#servicios" className="block text-white" onClick={() => setOpen(false)}>
              Servicios
            </Link>
            <Link to="/schedules" className="block text-white" onClick={() => setOpen(false)}>
              Clases
            </Link>
            <Link to="/contact" className="block text-white" onClick={() => setOpen(false)}>
              Contacto
            </Link>

            {!isAuthenticated && (
              <>
                <Link to="/login" className="block text-white" onClick={() => setOpen(false)}>
                  Iniciar sesión
                </Link>
                <Link to="/register" className="block mt-1" onClick={() => setOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <Link to={dashboardPath} className="block text-white" onClick={() => setOpen(false)}>
                  Ir al Panel
                </Link>
                <div className="pt-2">
                  <Button variant="outline" className="w-full mb-2" onClick={() => { handleLogout(); setOpen(false); }}>
                    Cerrar sesión
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
