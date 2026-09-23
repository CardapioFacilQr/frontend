/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        soft: '0 24px 80px -24px rgba(15, 23, 42, 0.28)',
      },
      colors: {
        ember: {
          50: '#fffaf2',
          100: '#fef3c7',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
        },
      },
    },
  },
  plugins: [],
}
