/**
 * OL-LIN Design System
 * Paleta de colores y estilos centralizados
 * @version 2.0.0 - Nueva Identidad Visual OL-LIN
 * @author @elisarrtech
 */

export const colors = {
  // Nueva paleta principal OL-LIN
  primary: {
    50: '#E1DBE1',
    100: '#D5CCD5',
    200: '#C8BDC8',
    300: '#BBAEBB',
    400: '#AD9FAD',
    500: '#9F8F9F',
    600: '#8B7C8B',
    700: '#776877',
    800: '#635463',
    900: '#4F404F',
  },
  
  orange: {
    50: '#FEF3E6',
    100: '#FDE0C2',
    200: '#FBCA99',
    300: '#F9B470',
    400: '#F7A352',
    500: '#DC6D27',
    600: '#C45E20',
    700: '#AC4F19',
    800: '#944013',
    900: '#7C310D',
  },
  
  blue: {
    50: '#E8EDF0',
    100: '#C6D4DB',
    200: '#A3BBC6',
    300: '#81A2B1',
    400: '#5F899C',
    500: '#1B3D4E',
    600: '#163442',
    700: '#112B36',
    800: '#0C222A',
    900: '#07191E',
  },
  
  brown: {
    50: '#FAF2EB',
    100: '#F2DFD1',
    200: '#EACBB7',
    300: '#E2B79D',
    400: '#DAA383',
    500: '#944E22',
    600: '#83461E',
    700: '#723E1A',
    800: '#613616',
    900: '#502E12',
  },
  
  green: {
    50: '#EBF4EC',
    100: '#CFE4D1',
    200: '#B3D4B6',
    300: '#97C49B',
    400: '#7BB480',
    500: '#2A6130',
    600: '#245529',
    700: '#1E4922',
    800: '#183D1B',
    900: '#123114',
  },
  
  gray: {
    50: '#F9F8F9',
    100: '#F0EEF0',
    200: '#E1DBE1',
    300: '#D0C8D0',
    400: '#BFB5BF',
    500: '#AEA2AE',
    600: '#8B7F8B',
    700: '#685D68',
    800: '#453B45',
    900: '#221922',
  },
  
  // Status colors (ajustados a nueva paleta)
  success: {
    50: '#EBF4EC',
    100: '#CFE4D1',
    500: '#2A6130',
    600: '#245529',
    700: '#1E4922',
  },
  
  error: {
    50: '#FDECEB',
    100: '#F9D0CC',
    500: '#DC6D27',
    600: '#C45E20',
    700: '#AC4F19',
  },
  
  warning: {
    50: '#FFF8EB',
    100: '#FFEBC2',
    500: '#DC6D27',
    600: '#C45E20',
    700: '#AC4F19',
  },
  
  info: {
    50: '#E8EDF0',
    100: '#C6D4DB',
    500: '#1B3D4E',
    600: '#163442',
    700: '#112B36',
  },
  
  // Roles colors
  admin: {
    50: '#E8EDF0',
    100: '#C6D4DB',
    500: '#1B3D4E',
    600: '#163442',
    700: '#112B36',
  },
  
  instructor: {
    50: '#FEF3E6',
    100: '#FDE0C2',
    500: '#DC6D27',
    600: '#C45E20',
    700: '#AC4F19',
  },
  
  client: {
    50: '#EBF4EC',
    100: '#CFE4D1',
    500: '#2A6130',
    600: '#245529',
    700: '#1E4922',
  },
};

export const typography = {
  fontFamilies: {
    helvetica: '"Helvetica Bold", Helvetica, Arial, sans-serif',
    inter: 'Inter, system-ui, -apple-system, sans-serif',
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
};

export const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

export const borderRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
};

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
};
