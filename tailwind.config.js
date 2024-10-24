/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        black: "#1f1f1f",
        gray: {
          100: "#f8f8f8",
          200: "#dfdfdf",
          300: "#c8c8c8",
          400: "#afafaf",
          500: "#989898",
          600: "#7f7f7f",
          700: "#686868",
          800: "#4f4f4f",
          900: "#383838",
        },
        primary: {
          100: "#f8fff8",
          200: "#ccf8dd",
          300: "#99f1bb",
          400: "#66ea9a",
          500: "#33e378",
          600: "#00dc56",
          700: "#00b045",
          800: "#008434",
          900: "#005822",
        },
      },
    },
  },
  plugins: [],
};
