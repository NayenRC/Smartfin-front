/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        card: "#020617",
        border: "#1e293b",
        primary: "#2563eb",
        primaryGlow: "#3b82f6",
      },
      boxShadow: {
        glow: "0 0 30px rgba(59,130,246,0.25)",
      },
      backdropBlur: {
        glass: "12px",
      },
    },
  },
  plugins: [],
};
