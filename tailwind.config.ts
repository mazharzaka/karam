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
        romantic: {
          bg: "#FDECEF",
          bgLight: "#FFF5F7",
          bgDark: "#FCE4EC",
          roseGold: "#D4AF37",
          roseGoldLight: "#F2D98D",
          roseGoldDark: "#B89335",
          blush: "#F8BBD0",
          blushLight: "#FDE8EF",
          blushDeep: "#E57399",
          charcoal: "#33272A",
          charcoalSoft: "#4A3B3E",
          muted: "#7B6A6E",
          creamy: "#FAFAFA",
          polaroid: "#FFFDF9",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        handwriting: ["var(--font-script)", "cursive"],
      },
      boxShadow: {
        polaroid: "0 10px 25px -5px rgba(51, 39, 42, 0.12), 0 8px 10px -6px rgba(51, 39, 42, 0.08)",
        "polaroid-hover": "0 20px 35px -5px rgba(51, 39, 42, 0.2), 0 10px 15px -5px rgba(51, 39, 42, 0.12)",
        glow: "0 0 25px rgba(212, 175, 55, 0.25)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
