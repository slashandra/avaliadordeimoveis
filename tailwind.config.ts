import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF8",
        ink: {
          DEFAULT: "#1A1D1C",
          soft: "#2E332F",
        },
        terra: {
          DEFAULT: "#8A6D4B",
          soft: "#C7A97C",
        },
        field: {
          DEFAULT: "#3F5A44",
          surface: "#8FA893",
        },
        slate: "#5B6B68",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        field: "4px",
        card: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
