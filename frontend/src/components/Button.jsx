import React from "react";

/**
 * Button component — asegura uso de btn-* globales
 */
export default function Button({ variant = "primary", className = "", children, ...rest }) {
  const base = "inline-flex items-center justify-center font-semibold focus:outline-none";
  const map = {
    primary: "btn-primary",
    outline: "btn-outline",
    neutral: "btn-neutral"
  };
  const classes = `${base} ${map[variant] || map.primary} ${className}`.trim();
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
