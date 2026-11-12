/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f2f9f1',
          100: '#e1f2df',
          200: '#c5e5c2',
          300: '#99d295',
          400: '#67b762',
          500: '#439b3d',
          600: '#327e2d',
          700: '#296326',
          800: '#244f22',
          900: '#1f421e',
          950: '#0c240b',
        },
        earth: {
          50: '#fbf8f5',
          100: '#f5efe8',
          200: '#ebdccf',
          300: '#ddc1aa',
          400: '#cca282',
          500: '#be8763',
          600: '#ad7255',
          700: '#905a46',
          800: '#754a3c',
          900: '#603e33',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
