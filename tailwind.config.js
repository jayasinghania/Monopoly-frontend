/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        felt: {
          50: '#f0f5f0',
          100: '#d4e5d4',
          200: '#a8cba8',
          300: '#6fa86f',
          400: '#4a8a4a',
          500: '#1a5c2a',
          600: '#164d24',
          700: '#0f3a19',
          800: '#0a2b12',
          900: '#061c0c',
          950: '#031007',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#d4a017',
          600: '#b8860b',
          700: '#8b6914',
          800: '#6b4f10',
          900: '#4a3610',
        },
        brass: {
          DEFAULT: '#c5a55a',
          light: '#d4b96a',
          dark: '#a38a3a',
        },
        ivory: {
          DEFAULT: '#f5f0e8',
          dark: '#e8e0d0',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'deco': '0 4px 30px rgba(197, 165, 90, 0.15)',
        'deco-lg': '0 8px 60px rgba(197, 165, 90, 0.25)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
};
