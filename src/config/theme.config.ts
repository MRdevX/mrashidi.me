export const THEME_CONFIG = {
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

  typography: {
    fonts: {
      cyberpunk: "Orbitron, sans-serif",
      terminal: "JetBrains Mono, monospace",
      retro: "Press Start 2P, cursive",
      matrix: "VT323, monospace",
      body: "Albert Sans, sans-serif",
    },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },

  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    neon: "0 0 20px rgba(255, 95, 31, 0.3)",
  },
} as const;
