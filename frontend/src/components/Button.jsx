import React from "react";
import clsx from "clsx";

/**
 * Button component
 * props:
 * - variant: 'primary' | 'secondary' (default 'primary')
 * - className: string
 * - onClick: function
 */
export default function Button({ children, variant = "primary", className = "", ...rest }) {
  const base = "inline-flex items-center justify-center font-semibold transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-orange text-white hover:bg-orange-soft shadow-sm px-4 py-2 rounded-md",
    secondary: "bg-brand text-white hover:bg-brand-dark shadow-sm px-4 py-2 rounded-md",
    outline: "bg-transparent border border-brand text-brand hover:bg-brand hover:text-white px-4 py-2 rounded-md"
  };

  // clsx to combine classes (if clsx not installed, replace with simple join)
  const classes = clsx(base, variants[variant] || variants.primary, className);

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
