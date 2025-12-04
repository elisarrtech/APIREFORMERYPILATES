module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0D4854",   // imagen principal teal
          dark: "#0B2E34",
          light: "#E9E6EA",
        },
        logo: {
          black: "#000000",     // logo monocromo
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
        // tokens semánticos rápidos
        cta: "#E4691C",
        accent: "#8A4A27"
      },
      // aquí puedes extender tipografías, spacing, etc.
    },
  },
  plugins: [],
}
