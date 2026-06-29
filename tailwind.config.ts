import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === Crimson Steel palette ===
        ink: {
          DEFAULT: "#0E0F13", // base background
          2: "#14161B",       // panel
          3: "#1B1E26",       // card
        },
        line: "rgba(255,255,255,0.08)",
        bone: "#F4F2ED",      // teks terang utama
        crimson: {
          DEFAULT: "#E63946",
          dark: "#C42836",
          light: "#FF5566",
        },
        amber: {
          DEFAULT: "#E8B04B",
          dark: "#C8902B",
        },
        muted: {
          DEFAULT: "#9AA1AC",
          dark: "#6B7280",
        },
      },
      fontFamily: {
        heading: ["var(--font-archivo)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 18px 40px -12px rgba(0,0,0,0.5)",
        glow: "0 0 40px -8px rgba(230,57,70,0.45)",
      },
      maxWidth: {
        wrap: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "scroll-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,0.61,0.36,1) both",
        "pulse-glow": "pulse-glow 5s ease-in-out infinite",
        "scroll-x": "scroll-x 28s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
