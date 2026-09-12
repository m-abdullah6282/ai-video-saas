/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Straight from the mood board brief — deep navy, teal accent, steel silver
        navy: "#1A2B4C",
        teal: "#1F8C8C",
        steel: "#9AA5AD",
        lightbg: "#F4F6F8",
      },
    },
  },
  plugins: [],
};
