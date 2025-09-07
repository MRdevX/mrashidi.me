import type { BadgeVariant, ButtonVariant, CardVariant, InputVariant, TextareaVariant } from "@/config/theme.config";
import {
  getBorderRadius,
  getColor,
  getFont,
  getPattern,
  getProjectBadge,
  getSemanticColor,
  getShadow,
  getSpacing,
  getVariant,
  THEME_CONFIG,
} from "@/config/theme.config";

export const useThemeConfig = () => {
  return {
    getVariant,
    getColor,
    getFont,
    getSpacing,
    getBorderRadius,
    getShadow,
    getSemanticColor,
    getPattern,
    getProjectBadge,

    getButtonVariant: (variant: ButtonVariant) => getVariant("button", variant),
    getInputVariant: (variant: InputVariant) => getVariant("input", variant),
    getTextareaVariant: (variant: TextareaVariant) => getVariant("textarea", variant),
    getBadgeVariant: (variant: BadgeVariant) => getVariant("badge", variant),
    getCardVariant: (variant: CardVariant) => getVariant("card", variant),

    getTextColor: (variant: string) => getSemanticColor("text", variant),
    getBackgroundColor: (variant: string) => getSemanticColor("background", variant),
    getBorderColor: (variant: string) => getSemanticColor("border", variant),
    getInteractiveColor: (variant: string) => getSemanticColor("interactive", variant),

    getSectionHeader: () => getPattern("sectionHeader"),
    getSectionTitle: () => getPattern("sectionTitle"),
    getCardPattern: () => getPattern("card"),
    getInteractivePattern: () => getPattern("interactive"),
    getFocusPattern: () => getPattern("focus"),

    colors: THEME_CONFIG.colors,
    variants: THEME_CONFIG.variants,
  };
};
