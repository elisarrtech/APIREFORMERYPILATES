module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        // Sage color palette used throughout the UI (derived from teal)
        sage: {
          50: "#f3f6f6",
          100: "#e7eded",
          200: "#c3d2d3",
          300: "#9fb7b9",
          400: "#577c84",
          500: "#1B3D4E", // base teal
          600: "#183743",
          700: "#142e38",
          800: "#10252d",
          900: "#0c1c22",
        },
      },
      boxShadow: {
        'soft-lg': '0 8px 30px rgba(27,61,78,0.08)'
      }
    },
  },
  plugins: [],
}
