/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff8f47',
        brand: '#002a56',
        secondary: '#002a56',
      },
    },
  },
  plugins: [],
};
