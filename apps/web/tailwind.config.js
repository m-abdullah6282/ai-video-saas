/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // From Figma "Mood Board & Visual Direction" — dark theme, neon-green primary
        "neon-green": "#C6FB49",
        "cyan-blue": "#3FDEFE",
        steel: "#9AA5AD",
        canvas: "#F4F6F8",
        success: "#16A34A",
        error: "#FF3611",
      },
      fontFamily: {
        // Sora = headings/display, Inter = body/data (per Typography Pairing frame)
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
