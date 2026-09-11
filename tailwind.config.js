/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff8f47',
        brand: '#5b67c7',
        secondary: '#5b67c7',
      },
    },
  },
  plugins: [],
};
