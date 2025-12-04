import React from "react";

/**
 * Button component — usa estilos globales branding.css para consistencia
 * Props:
 *  - variant: 'primary' | 'outline' | 'neutral'
 *  - className
 */
export default function Button({ variant = "primary", className = "", children, ...rest }) {
  const base = "inline-flex items-center justify-center font-semibold focus:outline-none";
  const variants = {
    primary: "btn-primary",
    outline: "btn-outline",
    neutral: "btn-neutral",
  };

  const classes = `${base} ${variants[variant] ?? variants.primary} ${className}`.trim();

  // Solo render estándar <button> (si necesitas Link, envíame y lo extiendo)
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
