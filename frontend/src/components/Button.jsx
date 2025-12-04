import React from "react";
import { Link } from "react-router-dom";

/**
 * Reusable Button component
 *
 * Props:
 * - variant: 'primary' | 'secondary' | 'outline' (default: 'primary')
 * - to: string (si se pasa, renderiza un <Link> en lugar de <button>)
 * - className: string (clases tailwind adicionales)
 * - children
 * - ...rest (onClick, type, aria, etc.)
 *
 * Nota: No requiere dependencias externas.
 */
export default function Button({
  variant = "primary",
  to = undefined,
  className = "",
  children,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-transform transform-gpu focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60";

  const variants = {
    primary:
      "bg-orange text-white hover:bg-orange-soft focus:ring-orange/40 shadow-sm px-4 py-2 rounded-md",
    secondary:
      "bg-brand text-white hover:bg-brand-dark focus:ring-brand/40 shadow-sm px-4 py-2 rounded-md",
    outline:
      "bg-transparent border border-brand text-brand hover:bg-brand hover:text-white focus:ring-brand/30 px-4 py-2 rounded-md",
  };

  const classes = `${base} ${variants[variant] ?? variants.primary} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
