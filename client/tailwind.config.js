/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkest: '#050B16',
          dark: '#070F1E',
          navy: '#0B1C3D',
          navyLight: '#112957',
          card: '#0D2146',
          cardBorder: '#1A3668',
          accent: '#38BDF8',
          gold: '#F59E0B',
          goldLight: '#FDE68A',
          emerald: '#10B981',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Cairo', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
