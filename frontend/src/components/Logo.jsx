import React from "react";

/**
 * Logo component reutilizable
 * Props:
 * - variant: 'full' | 'dark' | 'light' | 'icon' (default 'full')
 * - className: clases para ajustar tamaño/estilo
 * - alt: texto alternativo
 *
 * Nota: coloca las imágenes en public/images/:
 * - logo-full-black.png  (versión completa en negro)  <- imagen 9 sugerida
 * - logo-dark.png       (versión oscura/teal)
 * - logo-light.png      (versión clara)
 * - logo-icon.png       (solo el isotipo si lo quieres)
 */
export default function Logo({ variant = "full", className = "", alt = "OL-LIN Estudio Fitness" }) {
  const map = {
    full: "/images/logo-full-black.png",
    dark: "/images/logo-dark.png",
    light: "/images/logo-light.png",
    icon: "/images/logo-icon.png",
  };

  const src = map[variant] || map.full;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      width={64}
      height={64}
    />
  );
}
```


```jsx name=src/components/Header.jsx url=https://github.com/elisarrtech/APIREFORMERYPILATES/blob/5d360e8f465786b1130d969507f8b3be321f232e/frontend/src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Logo from "./Logo";
import { useAuth } from "@context/AuthContext";

/**
 * Header responsivo actualizado para usar Logo.jsx
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    if (typeof logout === "function") {
      try {
        await logout();
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
  };

  const dashboardPath = (() => {
    const role = user?.role;
    if (role === "admin") return "/admin/dashboard";
    if (role === "client") return "/client/dashboard";
    if (role === "instructor") return "/instructor/dashboard";
    return "/";
  })();

  return (
    <header className="bg-brand text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + title */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              {/* Usa la versión full-black del logo por defecto */}
              <Logo variant="full" className="w-12 h-12 object-contain" />
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
```

````jsx name=src/components/Footer.jsx url=https://github.com/elisarrtech/APIREFORMERYPILATES/blob/5d360e8f465786b1130d969507f8b3be321f232e/frontend/src/components/Footer.jsx
import React from "react";
import Logo from "./Logo";

/**
 * Footer simple con logo centrado
 */
export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Usamos la versión del logo clara para fondo oscuro */}
          <Logo variant="light" className="w-24 h-24 object-contain" alt="OL-LIN logo" />
          <p className="text-sm opacity-90">
            © {new Date().getFullYear()} OL-LIN Estudio Fitness • Todos los derechos reservados
          </p>
          <p className="text-xs opacity-80">Contacto: contacto@ol-lin.example • Tel: +56 9 0000 0000</p>
        </div>
      </div>
    </footer>
  );
}
```

```html name=index.html url=https://github.com/elisarrtech/APIREFORMERYPILATES/blob/5d360e8f465786b1130d969507f8b3be321f232e/frontend/index.html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OL-LIN Estudio Fitness</title>

    <!-- Favicon / PWA icons: coloca la imagen logo-full-black.png en public/images -->
    <link rel="icon" type="image/png" sizes="32x32" href="/images/logo-full-black.png" />
    <link rel="apple-touch-icon" href="/images/logo-full-black.png" />

    <!-- Meta social simples -->
    <meta name="description" content="OL-LIN Estudio Fitness - Reformer Pilates y entrenamiento personalizado." />
    <meta property="og:title" content="OL-LIN Estudio Fitness" />
    <meta property="og:description" content="Clases personalizadas de Reformer Pilates. Reserva online." />
    <meta property="og:image" content="/images/logo-full-black.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Notas importantes y pasos siguientes:
- Coloca la imagen que me diste (imagen 9) en frontend/public/images/logo-full-black.png. Además, si quieres versiones en color o claras, sube:
  - logo-dark.png (teal dark)
  - logo-light.png (versión clara para footer)
  - logo-icon.png (solo isotipo)
- Si prefieres que yo cree el PR con estos cambios y añada el asset en la rama main, lo hago ahora — dime contra qué branch quieres el PR (por defecto main).
- Si quieres que el logo también aparezca en la página Home como hero (más grande) te lo dejo listo y lo integro en src/pages/Home.jsx — dime si te lo añado.
- Si quieres que convierta la versión del logo a SVG optimizado y la inyecte inline (mejor rendimiento y control de colores), puedo hacerlo si me pasas el SVG.

Dime si quieres que haga el PR con estos cambios y suba la imagen por ti; si no, sube el png a public/images y los componentes funcionarán inmediatamente.
