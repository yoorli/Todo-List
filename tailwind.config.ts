import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: 'var(--gray-50)',
        },
        slate: {
          900: 'var(--slate-900)',
          800: 'var(--slate-800)',
          500: 'var(--slate-500)',
          400: 'var(--slate-400)',
          300: 'var(--slate-300)',
          200: 'var(--slate-200)',
          100: 'var(--slate-100)',
        },
        violet: {
          600: 'var(--violet-600)',
          100: 'var(--violet-100)',
        },
        rose: {
          500: 'var(--rose-500)',
        },
        lime: {
          300: 'var(--lime-300)',
        },
        amber: {
          800: 'var(--amber-800)',
        },
      },
      fontFamily: {
        nanum: ['"NanumSquare"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
