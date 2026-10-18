import type {
  BackgroundColor,
  BorderColor,
  ButtonVariant,
  InputVariant,
  TextareaVariant,
  TextColor,
} from "@/config/theme.config";
import { getColor, getVariant, PATTERNS, SEMANTIC_COLORS, THEME_CONFIG } from "@/config/theme.config";

export const useThemeConfig = () => {
  return {
    getColor,

    getButtonVariant: (variant: ButtonVariant) => getVariant("button", variant),
    getInputVariant: (variant: InputVariant) => getVariant("input", variant),
    getTextareaVariant: (variant: TextareaVariant) => getVariant("textarea", variant),

    getTextColor: (variant: TextColor) => SEMANTIC_COLORS.text[variant],
    getBackgroundColor: (variant: BackgroundColor) => SEMANTIC_COLORS.background[variant],
    getBorderColor: (variant: BorderColor) => SEMANTIC_COLORS.border[variant],

    getSectionTitle: () => PATTERNS.sectionTitle,
    getCardPattern: () => PATTERNS.card,

    colors: THEME_CONFIG.colors,
    variants: THEME_CONFIG.variants,
  };
};
