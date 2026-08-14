/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      colors: {
        cyber: {
          cyan: '#00d4ff',
          blue: '#4f8ef7',
          green: '#00e676',
          pink: '#ff4f9a',
          gold: '#ffd600',
          purple: '#b57bee',
          orange: '#ff9800',
          bg: '#050814',
        },
      },

      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
      },

      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },

  plugins: [],
}