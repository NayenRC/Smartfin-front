/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#020617",
        card: "#0f172a",
        border: "#1e293b",
        primary: "#2563eb",
        glow: "#22d3ee",
      },
      boxShadow: {
        glow: "0 0 20px rgba(34, 211, 238, 0.15)",
      },
    },
  },
  plugins: [],
};
