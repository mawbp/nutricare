/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leather: {
          900: '#1a0d06',
          800: '#2c180e',
          700: '#3d2314',
          600: '#52301c',
          500: '#693e25',
        },
        parchment: {
          50: '#fdfbf7',
          100: '#fcf9f1',
          200: '#f4ede0',
          300: '#e8dec7',
          400: '#d5c4a1',
        },
        brass: {
          highlight: '#fdf0a6',
          light: '#f5d77f',
          DEFAULT: '#c89e3a',
          dark: '#735418',
          shadow: '#3d2b09',
        },
        ink: {
          DEFAULT: '#2c2724',
          muted: '#6b635b',
          faint: '#9a9187',
        },
        wax: {
          seal: '#901a1e',
          highlight: '#b7282d',
          shadow: '#5e0d10',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Palatino Linotype', 'serif'],
        handwriting: ['Caveat', 'Segoe Script', 'Bradley Hand', 'cursive'],
      },
    },
  },
  plugins: [],
}
