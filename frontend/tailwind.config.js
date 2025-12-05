module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/**/*.html",
    "./index.html",
    "./**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f3f8f4',
          100: '#e6f1e8',
          200: '#cfe6cf',
          300: '#b7dbb5',
          400: '#8fca8e',
          500: '#6fbf69',
          600: '#57a855',
          700: '#3e7f3b',
          800: '#2c5929',
          900: '#173826'
        },
        admin: {
          50:  '#f7f9ff',
          100: '#eef3ff',
          200: '#d6e3ff',
          300: '#b9d0ff',
          400: '#8fb2ff',
          500: '#668fff',
          600: '#3f6bff',
          700: '#2f4fd6',
          800: '#21378f',
          900: '#142050'
        },
        instructor: {
          50:  '#f6fbfb',
          100: '#eef7f7',
          200: '#d3eeec',
          300: '#b7e5e2',
          400: '#7fd7cc',
          500: '#3fbfaa',
          600: '#28a38f',
          700: '#1c7a67',
          800: '#145444',
          900: '#0b3127'
        },
        client: {
          50:  '#fff8f6',
          100: '#fff0eb',
          200: '#ffd6c8',
          300: '#ffbc9f',
          400: '#ff9066',
          500: '#ff673c',
          600: '#e64b2e',
          700: '#b73521',
          800: '#772113',
          900: '#3b0f07'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        'lg-2': '0 10px 25px rgba(15, 23, 42, 0.06)'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out both'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp')
  ]
};
