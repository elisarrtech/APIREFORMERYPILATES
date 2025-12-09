[file name]: theme.js
[file content begin]
/**
 * Reformery Design System
 * Paleta de colores y estilos centralizados
 * @version 2.0.0 - Nueva Identidad Visual
 * @author @elisarrtech
 */

export const colors = {
  // Nueva paleta principal OL-LIN
  primary: {
    50: '#E1DBE1',    // Gris lavanda (fondo principal)
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
  
  // Colores de acento
  orange: {
    50: '#FEF3E6',
    100: '#FDE0C2',
    200: '#FBCA99',
    300: '#F9B470',
    400: '#F7A352',
    500: '#DC6D27',    // Naranja principal (DC6D27)
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
    500: '#1B3D4E',    // Azul profundo (1B3D4E)
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
    500: '#944E22',    // Terracota (944E22)
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
    500: '#2A6130',    // Verde bosque (2A6130)
    600: '#245529',
    700: '#1E4922',
    800: '#183D1B',
    900: '#123114',
  },
  
  // Grays (actualizados con tonos más cálidos)
  gray: {
    50: '#F9F8F9',
    100: '#F0EEF0',
    200: '#E1DBE1',    // Color principal como gris base
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
    500: '#2A6130',    // Usar verde de la paleta
    600: '#245529',
    700: '#1E4922',
  },
  
  error: {
    50: '#FDECEB',
    100: '#F9D0CC',
    500: '#DC6D27',    // Usar naranja para errores (más suave)
    600: '#C45E20',
    700: '#AC4F19',
  },
  
  warning: {
    50: '#FFF8EB',
    100: '#FFEBC2',
    500: '#DC6D27',    // Compartir con naranja
    600: '#C45E20',
    700: '#AC4F19',
  },
  
  info: {
    50: '#E8EDF0',
    100: '#C6D4DB',
    500: '#1B3D4E',    // Usar azul para info
    600: '#163442',
    700: '#112B36',
  },
  
  // Roles colors (adaptados)
  admin: {
    50: '#E8EDF0',
    100: '#C6D4DB',
    500: '#1B3D4E',    // Azul para admin
    600: '#163442',
    700: '#112B36',
  },
  
  instructor: {
    50: '#FEF3E6',
    100: '#FDE0C2',
    500: '#DC6D27',    // Naranja para instructor
    600: '#C45E20',
    700: '#AC4F19',
  },
  
  client: {
    50: '#EBF4EC',
    100: '#CFE4D1',
    500: '#2A6130',    // Verde para clientes
    600: '#245529',
    700: '#1E4922',
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
[file content end]
