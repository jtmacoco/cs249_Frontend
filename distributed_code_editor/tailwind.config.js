/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,js}"];
export const theme = {
  extend: {
    colors: {
      dark_back: "#24292e",
      dark_border: "#2b3137",
      light_border: "#FFFFFF",
      light_back: "#F2F2F7"
    },
    fontFamily: {
      mono: ['Fira Mono']
    },
  },
};
export const plugins = [];