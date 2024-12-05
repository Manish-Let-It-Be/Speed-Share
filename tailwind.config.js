/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00a2ff',
          dark: '#0077cc',
        },
        dark: {
          DEFAULT: '#0a0a0a',
          lighter: '#1a1a1a',
        }
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
      },
      keyframes: {
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 162, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 162, 255, 0.8)' },
        }
      },
      animation: {
        pulse: 'pulse 0.3s ease-in-out',
        glow: 'glow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};