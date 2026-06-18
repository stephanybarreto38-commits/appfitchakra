/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        chakra: {
          root: '#C44B4B',
          sacral: '#E07A3A',
          solar: '#D9AE3F',
          heart: '#5A9E6F',
          throat: '#4A90C4',
          thirdEye: '#7B68C8',
          crown: '#A87DC8',
        },
        dark: {
          950: '#0D0A18',
          900: '#1E1530',
          800: '#2A2235',
          700: '#2D1F45',
        },
        ivory: '#FBF7F0',
        gold: '#E0AD66',
        muted: '#8B7FA8',
        text: '#F3EFE6',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'Georgia', 'serif'],
        grotesk: ['Space Grotesk', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 3.4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.28s ease-out both',
        'pop': 'pop 0.5s cubic-bezier(.34,1.56,.64,1) both',
        'flame': 'flamePulse 1.8s ease-in-out infinite',
        'elem-float': 'elemFloat 2.5s ease-in-out infinite',
        'music-pulse': 'musicPulse 2s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flamePulse: {
          '0%, 100%': { transform: 'scale(1) rotate(-3deg)' },
          '50%': { transform: 'scale(1.12) rotate(3deg)' },
        },
        elemFloat: {
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '50%': { transform: 'scale(1.1) translateY(-3px)' },
        },
        musicPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
};
