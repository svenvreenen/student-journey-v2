/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'roc': {
          50: '#fff1f3',
          100: '#ffd9e1',
          200: '#ffa3b5',
          300: '#ff758f',
          400: '#ff4d6d',
          500: '#e00c32', // Primary ROC Red
          600: '#c00a28',
          700: '#a1081f',
          800: '#820618',
          900: '#630512',
        },
        'roc-gold': {
          DEFAULT: '#ffc700',
          light: '#ffd740',
          dark: '#c79a00',
        }
      },
      animation: {
        'progress': 'progress 1s ease-in-out',
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' }
        }
      }
    },
  },
  plugins: [],
} 
