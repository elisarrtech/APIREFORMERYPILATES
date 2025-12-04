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
      },
      boxShadow: {
        'soft-lg': '0 8px 30px rgba(27,61,78,0.08)'
      }
    },
  },
  plugins: [],
}
