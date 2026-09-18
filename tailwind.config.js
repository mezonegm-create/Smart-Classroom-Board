/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        board: {
          bg: '#f8fafc',
          panel: '#1e293b',
          panel2: '#0f172a',
          accent: '#2563eb',
        },
      },
    },
  },
  plugins: [],
}
