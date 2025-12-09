/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nueva paleta OL-LIN
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
      },
      fontFamily: {
        'helvetica': ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'logo-estudio': '0.34em', // 34% del tamaño padre
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'bounce-slow': 'bounce 2s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
}
