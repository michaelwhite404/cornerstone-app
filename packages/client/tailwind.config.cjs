const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "480px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        sans: ['"Euclid Circular A"', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        blinking: "blinking 2s infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        blinking: {
          "50%": { backgroundColor: "transparent" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
