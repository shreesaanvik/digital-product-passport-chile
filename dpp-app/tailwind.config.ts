import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fm: {
          blue: "#1799b5",
          green: "#66BB6A",
          "green-soft": "#E8F5E9",
          pink: "#b55194",
          orange: "#f16f0f",
          "orange-soft": "#FFF0E6",
          purple: "#9351b5",
          "btn-bg": "#0081A1",
          "btn-light": "#D5E9EF",
          "btn-text": "#006E8A",
          ink: "#0f0e0e",
          heading: "#333333",
          muted: "#666666",
          surface: "#f8fafc",
          card: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neu: "8px 8px 20px rgba(15, 23, 42, 0.06), -6px -6px 16px rgba(255, 255, 255, 0.9)",
        "neu-inset": "inset 4px 4px 10px rgba(15, 23, 42, 0.05), inset -3px -3px 8px rgba(255, 255, 255, 0.8)",
        glow: "0 0 24px rgba(23, 153, 181, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
