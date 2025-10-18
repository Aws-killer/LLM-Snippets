/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,njk,md}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 100px -10px theme('colors.blue.500')",
      },
    },
  },
  plugins: [],
};