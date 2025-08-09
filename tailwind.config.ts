import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        cyberpunk: ["Orbitron", "sans-serif"],
        terminal: ["JetBrains Mono", "monospace"],
        retro: ["Press Start 2P", "cursive"],
        matrix: ["VT323", "monospace"],
        albert: ["Albert Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
