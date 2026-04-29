/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  // Opcional: Elige un tema bonito de DaisyUI (ej. light, dark, corporate, emerald)
  daisyui: {
    themes: ["corporate"], 
  },
}