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
        castBg: "#0A0A0A",
        castCard: "#111111",
        castPanel: "#161616",
        castGold: "#D4AF37",
        castDeepGold: "#B8860B",
        castText: "#F5F5F5",
        castMuted: "#A1A1AA",
      },
      boxShadow: {
        gold: "0 0 28px rgba(212, 175, 55, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
