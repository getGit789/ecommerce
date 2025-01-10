/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#EC4899',
        background: {
          DEFAULT: '#0B1437',
          dark: '#0F1A43',
          darker: '#1B2B65',
        },
      },
    },
  },
  plugins: [],
} 