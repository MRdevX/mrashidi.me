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

    success: {
      DEFAULT: "#10b981",
      500: "#10b981",
      700: "#047857",
    },
    warning: {
      DEFAULT: "#f59e0b",
      500: "#f59e0b",
      700: "#b45309",
    },
    error: {
      DEFAULT: "#ef4444",
      500: "#ef4444",
      700: "#b91c1c",
    },
    info: {
      DEFAULT: "#3b82f6",
      500: "#3b82f6",
      700: "#1d4ed8",
    },
    purple: {
      DEFAULT: "#8b5cf6",
      500: "#8b5cf6",
      700: "#7c3aed",
    },
    pink: {
      DEFAULT: "#ec4899",
      500: "#ec4899",
      700: "#db2777",
    },
    indigo: {
      DEFAULT: "#6366f1",
      500: "#6366f1",
      700: "#4f46e5",
    },
    teal: {
      DEFAULT: "#14b8a6",
      500: "#14b8a6",
      700: "#0f766e",
    },
    amber: {
      DEFAULT: "#f59e0b",
      500: "#f59e0b",
      700: "#d97706",
    },
    emerald: {
      DEFAULT: "#10b981",
      500: "#10b981",
      700: "#059669",
    },
    slate: {
      DEFAULT: "#64748b",
      500: "#64748b",
      700: "#475569",
    },
  },

  semantic: {
    text: {
      primary: "text-gray-800 dark:text-gray-200",
      secondary: "text-gray-600 dark:text-gray-400",
      muted: "text-gray-500 dark:text-gray-500",
      inverse: "text-white dark:text-black",
    },
    background: {
      primary: "bg-white dark:bg-gray-900",
      secondary: "bg-gray-50 dark:bg-gray-800",
      muted: "bg-gray-100 dark:bg-gray-700",
      glass: "bg-white/50 dark:bg-gray-900/50",
      glassLight: "bg-white/30 dark:bg-gray-800/30",
    },
    border: {
      primary: "border-gray-200 dark:border-gray-700",
      secondary: "border-gray-300 dark:border-gray-600",
      muted: "border-gray-100 dark:border-gray-800",
    },
    interactive: {
      hover: "hover:bg-gray-100 dark:hover:bg-gray-800",
      focus: "focus:ring-2 focus:ring-orange-500/50",
      active: "active:bg-gray-200 dark:active:bg-gray-700",
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
    weights: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
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
    neonStrong: "0 0 40px rgba(255, 95, 31, 0.4)",
  },

  variants: {
    button: {
      neon: "font-cyberpunk text-orange-500 border-2 border-orange-500 bg-transparent hover:bg-orange-500 hover:text-black text-shadow-neon transition-all duration-300 shadow-[0_0_20px_rgba(255,95,31,0.2)] hover:shadow-[0_0_40px_rgba(255,95,31,0.4)] px-6 py-3 text-base",
      primary:
        "font-cyberpunk bg-orange-500 hover:bg-orange-600 text-black border-2 border-orange-500 shadow-[0_0_15px_rgba(255,95,31,0.3)] px-6 py-3 text-base",
      secondary: "font-cyberpunk bg-gray-800 hover:bg-gray-700 text-gray-200 border-2 border-gray-600 px-6 py-3 text-base",
      ghost: "font-cyberpunk bg-transparent hover:bg-gray-800 text-gray-300 border-2 border-gray-600 px-6 py-3 text-base",
      default: "font-cyberpunk bg-orange-500 hover:bg-orange-600 text-black border-2 border-orange-500 px-6 py-3 text-base",
      outline:
        "font-cyberpunk border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black px-6 py-3 text-base",
      destructive: "font-cyberpunk bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 px-6 py-3 text-base",
      link: "font-cyberpunk text-orange-500 underline-offset-4 hover:underline px-6 py-3 text-base",
    },
    input: {
      default:
        "bg-white/50 dark:bg-gray-900/50 border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/50",
      neon: "bg-white/30 dark:bg-gray-900/30 border-2 border-orange-500/30 text-gray-800 dark:text-orange-400 placeholder-gray-500 dark:placeholder-orange-500/50 focus:border-orange-500 focus:ring-orange-500/50 shadow-[0_0_10px_rgba(255,95,31,0.2)] focus:shadow-[0_0_20px_rgba(255,95,31,0.4)]",
      terminal:
        "bg-gray-50 dark:bg-black border-2 border-green-500/30 text-gray-800 dark:text-green-400 placeholder-gray-500 dark:placeholder-green-500/50 focus:border-green-500 focus:ring-green-500/50 font-terminal",
    },
    textarea: {
      default:
        "bg-white/50 dark:bg-gray-900/50 border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/50",
      neon: "bg-white/30 dark:bg-gray-900/30 border-2 border-orange-500/30 text-gray-800 dark:text-orange-400 placeholder-gray-500 dark:placeholder-orange-500/50 focus:border-orange-500 focus:ring-orange-500/50 shadow-[0_0_10px_rgba(255,95,31,0.2)] focus:shadow-[0_0_20px_rgba(255,95,31,0.4)]",
      terminal:
        "bg-gray-50 dark:bg-black border-2 border-green-500/30 text-gray-800 dark:text-green-400 placeholder-gray-500 dark:placeholder-green-500/50 focus:border-green-500 focus:ring-green-500/50 font-terminal",
    },
    badge: {
      default: "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30 hover:bg-orange-500/30",
      secondary: "bg-gray-800/60 text-gray-700 dark:text-gray-300 border-gray-600/30 hover:bg-gray-800/80",
      destructive: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30 hover:bg-red-500/30",
      outline: "border-orange-500/50 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20",
      neon: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(255,95,31,0.3)] hover:shadow-[0_0_15px_rgba(255,95,31,0.5)]",
      tech: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/30",
      status: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30 hover:bg-green-500/30",
    },
    card: {
      glass: "glass-card",
      feature: "feature-card",
      default: "bg-gray-900/50 border border-gray-700 rounded-xl",
    },
    dialog: {
      content:
        "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-orange-500/30 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
      header: "border-b border-orange-500/20 pb-4",
      title: "text-orange-500 font-cyberpunk glow-text text-xl",
      description: "text-gray-600 dark:text-gray-400 font-albert",
      footer: "border-t border-orange-500/20 pt-4",
    },
  },

  animations: {
    glow: "animate-glow",
    glitch: "glitch-text",
    typewriter: "typewriter",
    matrix: "matrix-rain",
  },

  utilities: {
    text: {
      neon: "text-neon-orange",
      cyberpunk: "font-cyberpunk",
      terminal: "font-terminal",
      retro: "font-retro",
      matrix: "font-matrix",
    },
    effects: {
      glass: "glass-effect",
      neon: "text-neon-orange text-shadow-neon",
      glow: "animate-glow",
    },
  },

  patterns: {
    sectionHeader: "flex items-center gap-3 mb-6",
    sectionTitle: "text-3xl font-bold text-orange-500 font-cyberpunk glow-text",
    card: "feature-card group",
    interactive: "transition-all duration-300 hover:scale-105",
    focus: "focus:outline-none focus:ring-2 focus:ring-orange-500/50",
  },

  projectBadges: {
    year: "bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30 hover:bg-slate-500/30",
    status: {
      active: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30",
      archived: "bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30 hover:bg-slate-500/30",
      "in progress": "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/30",
      maintenance: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/30",
    },
    visibility: {
      public: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30",
      private: "bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30 hover:bg-slate-500/30",
    },
    type: {
      personal: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/30",
      client: "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30 hover:bg-orange-500/30",
    },
    openSource: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/30",
    license: {
      "All Rights Reserved": "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30 hover:bg-red-500/30",
      MIT: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30 hover:bg-green-500/30",
      "Apache 2.0": "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/30",
      "GPL-3.0": "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/30",
      "BSD-3-Clause": "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30",
      default: "bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30 hover:bg-slate-500/30",
    },
  },
} as const;

export type ButtonVariant = keyof typeof THEME_CONFIG.variants.button;
export type InputVariant = keyof typeof THEME_CONFIG.variants.input;
export type TextareaVariant = keyof typeof THEME_CONFIG.variants.textarea;
export type BadgeVariant = keyof typeof THEME_CONFIG.variants.badge;
export type CardVariant = keyof typeof THEME_CONFIG.variants.card;

export const getVariant = <T extends keyof typeof THEME_CONFIG.variants>(
  component: T,
  variant: keyof (typeof THEME_CONFIG.variants)[T]
): string => {
  return THEME_CONFIG.variants[component][variant as keyof (typeof THEME_CONFIG.variants)[T]] as string;
};

export const getColor = (color: keyof typeof THEME_CONFIG.colors): string => {
  return THEME_CONFIG.colors[color].DEFAULT;
};

export const getFont = (font: keyof typeof THEME_CONFIG.typography.fonts): string => {
  return THEME_CONFIG.typography.fonts[font];
};

export const getSpacing = (size: keyof typeof THEME_CONFIG.spacing): string => {
  return THEME_CONFIG.spacing[size];
};

export const getBorderRadius = (size: keyof typeof THEME_CONFIG.borderRadius): string => {
  return THEME_CONFIG.borderRadius[size];
};

export const getShadow = (shadow: keyof typeof THEME_CONFIG.shadows): string => {
  return THEME_CONFIG.shadows[shadow];
};

export const getSemanticColor = (category: keyof typeof THEME_CONFIG.semantic, variant: string): string => {
  return THEME_CONFIG.semantic[category][variant as keyof (typeof THEME_CONFIG.semantic)[typeof category]] as string;
};

export const getPattern = (pattern: keyof typeof THEME_CONFIG.patterns): string => {
  return THEME_CONFIG.patterns[pattern];
};

export const getProjectBadge = (type: keyof typeof THEME_CONFIG.projectBadges, value?: string): string => {
  const badgeConfig = THEME_CONFIG.projectBadges[type];

  if (typeof badgeConfig === "string") {
    return badgeConfig;
  }

  if (value && value in badgeConfig) {
    return badgeConfig[value as keyof typeof badgeConfig] as string;
  }

  if (type === "license") {
    const licenseConfig = badgeConfig as typeof THEME_CONFIG.projectBadges.license;
    if ("default" in licenseConfig) {
      return licenseConfig.default;
    }
  }

  const firstKey = Object.keys(badgeConfig)[0] as keyof typeof badgeConfig;
  return badgeConfig[firstKey] as string;
};
