/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ff88',
        secondary: '#0088ff',
        accent: '#ff0088',
        dark: '#0a0a0a',
        'dark-lighter': '#1a1a2e',
        'dark-border': '#2a2a3e'
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'sans': ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 136, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}