/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary : "#000000",
        secondary : "#3C3D37"
      },
      backgroundImage : {
        "large" : "url('/src/assets/images/bg-lg.jpg')",
        "small" : "url('/src/assets/images/bg-5.jpg')"
      }
    },
  },
  plugins: [],
}

