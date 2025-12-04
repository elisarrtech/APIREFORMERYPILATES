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
        admin: {
          50: "#f7f9fb",
          100: "#eef3fa",
          600: "#2b6cb0",
          700: "#244f86"
        },
        instructor: {
          50: "#fffaf5",
          100: "#fff0e6",
          600: "#c4692b",
          700: "#9a4f20"
        },
        client: {
          50: "#f7fbff",
          100: "#eef7ff",
          600: "#1e6a3c",
          700: "#134a2a"
        },
        brand: {
          DEFAULT: "#0D4854",
          dark: "#0B2E34",
          light: "#E9E6EA",
        },
        orange: {
          DEFAULT: "#E4691C",
          soft: "#F2A65A"
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(13,72,84,0.08)'
      }
    },
  },
  plugins: [
    // si usas line-clamp u otras utilidades, agrega plugins aquí
    require('@tailwindcss/line-clamp'),
  ],
}
