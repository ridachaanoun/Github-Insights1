/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        bodycolor: "#0a0e12",
        asidecolor: "#21252b",
        cardscolor: "#3d3f42",
      },
    },
    fontSize: {
      bigfont: "30px",
    },
  },
  plugins: [],
};
