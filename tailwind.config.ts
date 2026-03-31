import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        brand: {
          50: '#f0f7f4',
          100: '#dcede5',
          200: '#bcdacc',
          300: '#8fc0aa',
          400: '#5fa083',
          500: '#3d8465',
          600: '#2d6a51',
          700: '#1a3c34',
          800: '#172f29',
          900: '#142722',
          950: '#0a1612',
        },
        accent: {
          DEFAULT: '#88b04b',
          light: '#a3c46a',
          dark: '#6d8d3a',
        },
        cream: {
          DEFAULT: '#f5f2ed',
          dark: '#ebe6df',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(26, 60, 52, 0.08)',
        'card-hover': '0 8px 40px rgba(26, 60, 52, 0.15)',
        'admin': '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
