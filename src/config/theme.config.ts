const COLORS = {
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
    DEFAULT: "#64748b",
    500: "#64748b",
  },
  accent: {
    DEFAULT: "#475569",
    500: "#475569",
  },
  terminal: {
    DEFAULT: "var(--terminal-green)",
    500: "var(--terminal-green)",
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
} as const;

export const SEMANTIC_COLORS = {
  text: {
    primary: "text-gray-800 dark:text-gray-200",
    secondary: "text-gray-600 dark:text-gray-400",
    muted: "text-gray-500 dark:text-gray-500",
  },
  background: {
    muted: "bg-gray-100 dark:bg-gray-800",
  },
  border: {
    primary: "border-gray-200 dark:border-white/10",
  },
} as const;

const COMPONENT_VARIANTS = {
  button: {
    neon: "font-albert font-semibold tracking-tight text-orange-500 border border-orange-500/80 bg-transparent hover:bg-orange-500 hover:text-black transition-colors duration-200 px-6 py-3 text-base rounded-md",
    primary:
      "font-albert font-semibold tracking-tight bg-orange-500 hover:bg-orange-600 text-black border border-orange-600/90 px-6 py-3 text-base rounded-md shadow-sm",
    secondary:
      "font-albert font-medium tracking-tight bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600/80 px-6 py-3 text-base rounded-md",
    ghost:
      "font-albert font-medium tracking-tight bg-transparent hover:bg-gray-800/80 text-gray-300 border border-gray-600/60 px-6 py-3 text-base rounded-md",
    default:
      "font-albert font-semibold tracking-tight bg-orange-500 hover:bg-orange-600 text-black border border-orange-600/90 px-6 py-3 text-base rounded-md",
    outline:
      "font-albert font-semibold tracking-tight border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black px-6 py-3 text-base rounded-md",
    destructive:
      "font-albert font-semibold tracking-tight bg-red-600 hover:bg-red-700 text-white border border-red-700/90 px-6 py-3 text-base rounded-md",
    link: "font-albert font-medium text-orange-500 underline-offset-4 hover:underline px-6 py-3 text-base",
  },
  input: {
    default:
      "bg-white/50 dark:bg-gray-900/50 border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/50",
    neon: "bg-white/30 dark:bg-gray-900/40 border border-orange-500/25 text-gray-800 dark:text-orange-400 placeholder-gray-500 dark:placeholder-orange-500/50 focus:border-orange-500 focus:ring-orange-500/40 rounded-md",
    terminal:
      "bg-gray-50 dark:bg-black border-2 border-green-500/30 text-gray-800 dark:text-green-400 placeholder-gray-500 dark:placeholder-green-500/50 focus:border-green-500 focus:ring-green-500/50 font-terminal",
  },
  textarea: {
    default:
      "bg-white/50 dark:bg-gray-900/50 border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/50",
    neon: "bg-white/30 dark:bg-gray-900/40 border border-orange-500/25 text-gray-800 dark:text-orange-400 placeholder-gray-500 dark:placeholder-orange-500/50 focus:border-orange-500 focus:ring-orange-500/40 rounded-md",
    terminal:
      "bg-gray-50 dark:bg-black border-2 border-green-500/30 text-gray-800 dark:text-green-400 placeholder-gray-500 dark:placeholder-green-500/50 focus:border-green-500 focus:ring-green-500/50 font-terminal",
  },
  badge: {
    default: "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30 hover:bg-orange-500/30",
    secondary: "bg-gray-800/60 text-gray-700 dark:text-gray-300 border-gray-600/30 hover:bg-gray-800/80",
    destructive: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30 hover:bg-red-500/30",
    outline: "border-orange-500/50 text-orange-700 dark:text-orange-400 hover:bg-orange-500/20",
    neon: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/40",
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
      "bg-white/95 dark:bg-[hsl(222_14%_9%/0.97)] backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
    header: "border-b border-gray-200 dark:border-white/10 pb-4",
    title: "text-orange-500 font-albert font-semibold text-xl tracking-tight",
    description: "text-gray-600 dark:text-gray-400 font-albert",
    footer: "border-t border-gray-200 dark:border-white/10 pt-4",
  },
} as const;

export const PATTERNS = {
  sectionTitle: "text-3xl font-semibold text-orange-500 font-albert tracking-tight",
  card: "feature-card group",
} as const;

export const THEME_CONFIG = {
  colors: COLORS,
  variants: COMPONENT_VARIANTS,
} as const;

export type ButtonVariant = keyof typeof COMPONENT_VARIANTS.button;
export type InputVariant = keyof typeof COMPONENT_VARIANTS.input;
export type TextareaVariant = keyof typeof COMPONENT_VARIANTS.textarea;
export type BadgeVariant = keyof typeof COMPONENT_VARIANTS.badge;
type ColorKey = keyof typeof COLORS;
export type TextColor = keyof typeof SEMANTIC_COLORS.text;
export type BackgroundColor = keyof typeof SEMANTIC_COLORS.background;
export type BorderColor = keyof typeof SEMANTIC_COLORS.border;

export const getVariant = <T extends keyof typeof COMPONENT_VARIANTS>(
  component: T,
  variant: keyof (typeof COMPONENT_VARIANTS)[T]
): string => {
  return COMPONENT_VARIANTS[component][variant as keyof (typeof COMPONENT_VARIANTS)[T]] as string;
};

export const getColor = (color: ColorKey): string => {
  return COLORS[color].DEFAULT;
};
