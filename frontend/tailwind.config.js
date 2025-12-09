/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E1DBE1',
          100: '#D5CCD5',
          500: '#9F8F9F',
          600: '#8B7C8B',
          700: '#776877',
          800: '#635463',
          900: '#4F404F',
        },
        orange: {
          500: '#DC6D27',
          600: '#C45E20',
        },
        blue: {
          500: '#1B3D4E',
          600: '#163442',
        },
        brown: {
          500: '#944E22',
        },
        green: {
          500: '#2A6130',
        },
      },
    },
  },
  plugins: [],
}
