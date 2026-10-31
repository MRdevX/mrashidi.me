const BRAND_HEX = "#ff5f1f";

const SEMANTIC_COLORS = {
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
    neon: "font-albert font-semibold tracking-tight text-brand-text border border-primary/80 bg-transparent hover:bg-primary hover:text-black transition-colors duration-200 px-6 py-3 text-base rounded-md",
  },
  input: {
    default:
      "bg-white/50 dark:bg-gray-900/50 border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 focus:border-primary focus:ring-primary/50",
  },
  textarea: {
    default:
      "bg-white/50 dark:bg-gray-900/50 border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 focus:border-primary focus:ring-primary/50",
  },
  badge: {
    neon: "bg-primary/10 text-brand-text border border-primary/40",
  },
  dialog: {
    content:
      "bg-white/95 dark:bg-[hsl(222_14%_9%/0.97)] backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
    header: "border-b border-gray-200 dark:border-white/10 pb-4",
    title: "text-brand-text font-albert font-semibold text-xl tracking-tight",
    footer: "border-t border-gray-200 dark:border-white/10 pt-4",
  },
} as const;

const PATTERNS = {
  sectionTitle: "text-3xl font-semibold text-brand-text font-albert tracking-tight",
  card: "feature-card group",
} as const;

export type ButtonVariant = keyof typeof COMPONENT_VARIANTS.button;
export type InputVariant = keyof typeof COMPONENT_VARIANTS.input;
export type TextareaVariant = keyof typeof COMPONENT_VARIANTS.textarea;
export type BadgeVariant = keyof typeof COMPONENT_VARIANTS.badge;
type TextColor = keyof typeof SEMANTIC_COLORS.text;
type BackgroundColor = keyof typeof SEMANTIC_COLORS.background;
type BorderColor = keyof typeof SEMANTIC_COLORS.border;

export const getVariant = <T extends keyof typeof COMPONENT_VARIANTS>(
  component: T,
  variant: keyof (typeof COMPONENT_VARIANTS)[T]
): string => {
  return COMPONENT_VARIANTS[component][variant as keyof (typeof COMPONENT_VARIANTS)[T]] as string;
};

export const getThemeConfig = () => {
  return {
    brandHex: BRAND_HEX,

    getButtonVariant: (variant: ButtonVariant) => getVariant("button", variant),
    getInputVariant: (variant: InputVariant) => getVariant("input", variant),
    getTextareaVariant: (variant: TextareaVariant) => getVariant("textarea", variant),

    getTextColor: (variant: TextColor) => SEMANTIC_COLORS.text[variant],
    getBackgroundColor: (variant: BackgroundColor) => SEMANTIC_COLORS.background[variant],
    getBorderColor: (variant: BorderColor) => SEMANTIC_COLORS.border[variant],

    getSectionTitle: () => PATTERNS.sectionTitle,
    getCardPattern: () => PATTERNS.card,

    variants: COMPONENT_VARIANTS,
  };
};
