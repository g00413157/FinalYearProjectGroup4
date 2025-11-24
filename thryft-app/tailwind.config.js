/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        thryftGreen: "#437C90",
        thryftPink: "#F7C548",
      },
    },
  },
  plugins: [],
};
