module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sage palette for UI consistency
        sage: {
          50: '#f7faf8',
          100: '#e6f0ea',
          200: '#cce0d5',
          300: '#a3c7b3',
          400: '#73a68a',
          500: '#4d8a6a',
          600: '#3b7055',
          700: '#315a47',
          800: '#2a493b',
          900: '#243d32',
        },
        // Paleta provista
        brandLilac: {
          DEFAULT: "#E1DBE1"
        },
        brandOrange: {
          DEFAULT: "#DC6D27"
        },
        brandTeal: {
          DEFAULT: "#1B3D4E"
        },
        brandBrown: {
          DEFAULT: "#944E22"
        },
        brandGreen: {
          DEFAULT: "#2A6130"
        },
        // Tokens semánticos rápidos
        brand: {
          DEFAULT: "#1B3D4E", // color principal (teal oscuro)
          light: "#E1DBE1",
          accent: "#DC6D27"
        },
      },
      boxShadow: {
        'soft-lg': '0 8px 30px rgba(27,61,78,0.08)'
      }
    },
  },
  plugins: [],
}
