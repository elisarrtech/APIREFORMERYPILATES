import React from "react";

/**
 * Logo component (usa los nombres de archivos existentes en public/images/)
 *
 * Variants soportadas (mapeo a nombres reales que muestras en las capturas):
 * - nombre_azul       -> /images/LogoNombre_Azul.png
 * - nombre_blanco     -> /images/LogoNombre_Blanco.png
 * - nombre_cafe       -> /images/LogoNombre_Cafe.png
 * - nombre_naranja    -> /images/LogoNombre_Naranja.png
 * - icon_azul         -> /images/Logo_Azul.png
 * - icon_blanco       -> /images/Logo_Blanco.png
 * - icon_cafe         -> /images/Logo_Cafe.png
 * - icon_naranja      -> /images/Logo_Naranja.png
 * - icon_verde        -> /images/Logo_Verde.png
 * - ollin             -> /images/Logo_Ollin.png
 * - conNombreOllin    -> /images/Logo%20con%20Nombre_Ollin.png  (url-encoded)
 *
 * default: 'nombre_azul'
 */
export default function Logo({ variant = "nombre_azul", className = "", alt = "OL-LIN Estudio Fitness" }) {
  const map = {
    nombre_azul: "/images/LogoNombre_Azul.png",
    nombre_blanco: "/images/LogoNombre_Blanco.png",
    nombre_cafe: "/images/LogoNombre_Cafe.png",
    nombre_naranja: "/images/LogoNombre_Naranja.png",

    icon_azul: "/images/Logo_Azul.png",
    icon_blanco: "/images/Logo_Blanco.png",
    icon_cafe: "/images/Logo_Cafe.png",
    icon_naranja: "/images/Logo_Naranja.png",
    icon_verde: "/images/Logo_Verde.png",

    ollin: "/images/Logo_Ollin.png",
    // Archivo con espacio en el nombre — referenciado url-encoded
    conNombreOllin: "/images/Logo%20con%20Nombre_Ollin.png",
  };

  const src = map[variant] || map.nombre_azul;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
