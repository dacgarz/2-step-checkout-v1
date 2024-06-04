/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
    },
    extend: {
      colors: {
        "dogtv-orange": "#ff8016",
        "dogtv-orange-dark": "#871c0b",
        "dogtv-blue": "#3d67a8",
      },
      spacing: {
        "screen-xl": "1200px",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
};
