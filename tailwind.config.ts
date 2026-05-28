import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        castBg: "#0F172A",
        castCard: "rgba(15, 23, 42, 0.72)",
        castPanel: "rgba(17, 24, 39, 0.82)",
        castGold: "#D4AF37",
        castDeepGold: "#FACC15",
        castText: "#F8FAFC",
        castMuted: "#94A3B8",
        castBlue: "#3B82F6",
        castGreen: "#22C55E",
        castDanger: "#EF4444",
        castWarning: "#F59E0B",
      },
      boxShadow: {
        gold: "0 18px 60px rgba(212, 175, 55, 0.18)",
        blue: "0 18px 60px rgba(59, 130, 246, 0.14)",
        glass: "0 24px 80px rgba(2, 6, 23, 0.35)",
      },
      opacity: {
        12: "0.12",
        14: "0.14",
        16: "0.16",
        18: "0.18",
        22: "0.22",
        24: "0.24",
        28: "0.28",
        32: "0.32",
        34: "0.34",
        35: "0.35",
        45: "0.45",
        55: "0.55",
        65: "0.65",
        68: "0.68",
        72: "0.72",
        78: "0.78",
        82: "0.82",
        86: "0.86",
        88: "0.88",
      },
    },
  },
  plugins: [],
};

export default config;
