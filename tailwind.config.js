/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ryndia: {
          DEFAULT: '#FAF9F6',
          border: '#E8E2D5',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          muted: '#4A4A4A',
          light: '#767676',
        },
        muga: {
          DEFAULT: '#DAA520',
          dark: '#B8860B',
          light: '#F4D06F',
        },
        ceremonial: {
          DEFAULT: '#B22222',
          dark: '#8B0000',
          light: '#CD5C5C',
        },
        paila: {
          DEFAULT: '#E97451',
          dark: '#C85A38',
          light: '#F39C7F',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heritage: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'silk': '0 4px 20px -2px rgba(26, 26, 26, 0.05), 0 2px 6px -1px rgba(218, 165, 32, 0.08)',
        'silk-lg': '0 10px 30px -4px rgba(26, 26, 26, 0.08), 0 4px 12px -2px rgba(218, 165, 32, 0.12)',
        'ceremonial': '0 4px 14px 0 rgba(178, 34, 34, 0.35)',
      },
      backgroundImage: {
        'muga-shimmer': 'linear-gradient(135deg, rgba(218,165,32,0.15) 0%, rgba(233,116,81,0.08) 50%, rgba(178,34,34,0.12) 100%)',
      }
    },
  },
  plugins: [],
}
