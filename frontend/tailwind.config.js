/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom verdict colors
        'verdict-go': '#10B981',
        'verdict-pivot': '#F59E0B',
        'verdict-nogo': '#EF4444',
        // Custom score gradient
        'score-low': '#EF4444',
        'score-medium': '#F59E0B',
        'score-high': '#10B981',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
}
