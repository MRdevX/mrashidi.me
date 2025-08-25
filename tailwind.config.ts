import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ff5f1f",
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#ff5f1f",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        secondary: {
          DEFAULT: "#00fff5",
          500: "#00fff5",
        },
        accent: {
          DEFAULT: "#bc13fe",
          500: "#bc13fe",
        },
        terminal: {
          DEFAULT: "#00ff00",
          500: "#00ff00",
        },
      },
      fontFamily: {
        cyberpunk: ["Orbitron", "sans-serif"],
        terminal: ["JetBrains Mono", "monospace"],
        retro: ["Press Start 2P", "cursive"],
        matrix: ["VT323", "monospace"],
        albert: ["Albert Sans", "sans-serif"],
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        glitch: "glitch 1s infinite",
        typewriter: "typing 3.5s steps(40, end)",
        "matrix-rain": "matrix-rain 20s linear infinite",
        scanline: "scanline 8s linear infinite",
        "neon-pulse": "neonPulse 4s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": {
            textShadow: "0 0 10px rgba(255, 95, 31, 0.5), 0 0 20px rgba(255, 95, 31, 0.3), 0 0 30px rgba(255, 95, 31, 0.2)",
          },
          "50%": {
            textShadow: "0 0 20px rgba(255, 95, 31, 0.7), 0 0 30px rgba(255, 95, 31, 0.5), 0 0 40px rgba(255, 95, 31, 0.3)",
          },
        },
        glitch: {
          "0%": {
            textShadow: "0.05em 0 0 #ff5f1f, -0.05em -0.025em 0 #00fff5, -0.025em 0.05em 0 #bc13fe",
          },
          "14%": {
            textShadow: "0.05em 0 0 #ff5f1f, -0.05em -0.025em 0 #00fff5, -0.025em 0.05em 0 #bc13fe",
          },
          "15%": {
            textShadow: "-0.05em -0.025em 0 #ff5f1f, 0.025em 0.025em 0 #00fff5, -0.05em -0.05em 0 #bc13fe",
          },
          "49%": {
            textShadow: "-0.05em -0.025em 0 #ff5f1f, 0.025em 0.025em 0 #00fff5, -0.05em -0.05em 0 #bc13fe",
          },
          "50%": {
            textShadow: "0.025em 0.05em 0 #ff5f1f, 0.05em 0 0 #00fff5, 0 -0.05em 0 #bc13fe",
          },
          "99%": {
            textShadow: "0.025em 0.05em 0 #ff5f1f, 0.05em 0 0 #00fff5, 0 -0.05em 0 #bc13fe",
          },
          "100%": {
            textShadow: "-0.025em 0 0 #ff5f1f, -0.025em -0.025em 0 #00fff5, -0.025em -0.05em 0 #bc13fe",
          },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        "matrix-rain": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100%" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "neon-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(255, 95, 31, 0.5), 0 0 40px rgba(255, 95, 31, 0.3), 0 0 60px rgba(255, 95, 31, 0.2)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(255, 95, 31, 0.8), 0 0 60px rgba(255, 95, 31, 0.5), 0 0 90px rgba(255, 95, 31, 0.3)",
          },
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(255, 95, 31, 0.3)",
        "neon-strong": "0 0 40px rgba(255, 95, 31, 0.4)",
      },
      textShadow: {
        neon: "0 0 5px rgba(255, 95, 31, 0.8)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".text-neon-orange": {
          color: "#ff5f1f",
          "text-shadow": "0 0 5px rgba(255, 95, 31, 0.8)",
        },
        ".text-neon-blue": {
          color: "#00fff5",
          "text-shadow": "0 0 5px rgba(0, 255, 245, 0.8)",
        },
        ".text-neon-purple": {
          color: "#bc13fe",
          "text-shadow": "0 0 5px rgba(188, 19, 254, 0.8)",
        },
        ".text-neon-green": {
          color: "#00ff00",
          "text-shadow": "0 0 5px rgba(0, 255, 0, 0.8)",
        },
        ".glass-effect": {
          "backdrop-filter": "blur(10px)",
          "-webkit-backdrop-filter": "blur(10px)",
        },
        ".glass-card": {
          "background-color": "rgb(255 255 255 / 0.1)",
          "backdrop-filter": "blur(16px)",
          border: "1px solid rgb(0 0 0 / 0.1)",
          "border-radius": "0.75rem",
          "box-shadow": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        },
        ".dark .glass-card": {
          "background-color": "rgb(31 41 55 / 0.3)",
          "border-color": "rgb(55 65 81 / 0.3)",
        },
        ".feature-card": {
          position: "relative",
          overflow: "hidden",
          "border-radius": "0.75rem",
          padding: "1.5rem",
          "background-color": "rgb(255 255 255 / 0.1)",
          "backdrop-filter": "blur(16px)",
          border: "1px solid rgb(0 0 0 / 0.1)",
          "box-shadow": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
          transition: "all 0.3s ease",
        },
        ".dark .feature-card": {
          "background-color": "rgb(31 41 55 / 0.3)",
          "border-color": "rgb(55 65 81 / 0.3)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
