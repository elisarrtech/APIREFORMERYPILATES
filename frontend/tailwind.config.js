// Extiende tu tailwind.config.js para incluir la paleta 'sage' y las otras antes definidas.
// Esto permite clases como from-sage-50, via-sage-50, to-sage-50.
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f7faf6",
          100: "#edf7ee",
          200: "#d6efe0",
          300: "#bfe6d0",
          400: "#98d9b3",
          500: "#6fc999",
          600: "#4e9b74",
          700: "#357354",
          800: "#234f3a",
          900: "#173826"
        },
        brand: {
          DEFAULT: "#0D4854",
          dark: "#0B2E34",
          light: "#E9E6EA",
        },
        logo: {
          black: "#000000",
          light: "#E9E6EA",
          dark: "#0D4854"
        },
        brown: {
          DEFAULT: "#8A4A27"
        },
        orange: {
          DEFAULT: "#E4691C",
          soft: "#F2A65A"
        },
        greenbrand: {
          DEFAULT: "#1E6A3C"
        },
        neutral: {
          bg: "#F7F6F4"
        },
        cta: "#E4691C",
        accent: "#8A4A27"
      },
      borderRadius: {
        'lg-xl': '0.75rem'
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(13,72,84,0.08)'
      }
    },
  },
  plugins: [],
}
