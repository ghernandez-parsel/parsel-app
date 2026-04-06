/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: "#f3f3ed",
          primary: "#171717",
          foreground: "#0a0a0a",
          border: "#e5e5de",
          hover: "#eaeae4",
          active: "#e2e2db",
        },
        parsel: {
          orange: "#E8480C",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
