/**
 * Reformery Design System
 * Paleta de colores y estilos centralizados
 * @version 1.0.0 - ÉLITE MUNDIAL
 * @author @elisarrtech
 */

export const colors = {
  // Sage Green (Color principal Reformery)
  sage: {
    50: '#f6f9f7',
    100: '#e8f4ed',
    200: '#d4e9dc',
    300: '#b0d8bf',
    400: '#85c09a',
    500: '#6B9E78',  // Principal
    600: '#5A8A67',
    700: '#4a7053',
    800: '#3d5a44',
    900: '#334b39',
  },
  
  // Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Status colors
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  
  // Roles colors
  admin: {
    50: '#faf5ff',
    100: '#f3e8ff',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
  },
  
  instructor: {
    50: '#fff7ed',
    100: '#ffedd5',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
  },
  
  client: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
};

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
};

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  transitions,
};