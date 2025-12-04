import React from "react";

/**
 * Logo component
 * - variant: 'icon' | 'withText' | 'image' (default 'image')
 * - image: filename in /public/images (default LogoNombre_Azul.png)
 * - size: css size for text-logo base (px) or 'md'|'lg' etc.
 */
export default function Logo({ variant = "image", image = "LogoNombre_Azul.png", size = 48, className = "", alt = "OL-LIN" }) {
  const src = `/images/${image}`;

  if (variant === "withText") {
    // Ajustar variable CSS del tamaño
    const style = { ["--logo-base-size"]: `${size}px` };
    return (
      <div className={`flex items-center gap-3 ${className}`} style={style}>
        <img src={src} alt={alt} className="header-logo-img" loading="lazy" decoding="async" />
        <div className="logo-text">
          <span className="logo-main">OL-LIN</span>
          <span className="logo-sub">Estudio Fitness</span>
        </div>
      </div>
    );
  }

  // variant image or icon
  return (
    <img src={src} alt={alt} className={`${className} header-logo-img`} loading="lazy" decoding="async" />
  );
}
