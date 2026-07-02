/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff761c',
        brand: '#3c4070',
        secondary: '#3c4070',
      },
    },
  },
  plugins: [],
};
