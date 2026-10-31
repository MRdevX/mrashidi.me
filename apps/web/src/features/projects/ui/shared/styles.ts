const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export const styles = {
  focusRing,
  panel: "rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#12151b]",
  field:
    "rounded-lg border border-gray-300 bg-white text-gray-900 dark:border-white/15 dark:bg-[#0b0d11] dark:text-gray-100",
  fieldFocus: "focus:border-primary focus:ring-2 focus:ring-primary/25 focus:outline-none",
  label: "font-terminal text-xs uppercase tracking-[0.08em] text-gray-600 dark:text-gray-400",
  textPrimary: "text-gray-900 dark:text-gray-100",
  textSecondary: "text-gray-600 dark:text-gray-400",
  accentText: "text-brand-text ",
  divider: "border-gray-200 dark:border-white/10",
  chip: "inline-flex items-center gap-2 border font-albert transition-colors",
  chipOff:
    "border-gray-300 bg-white text-gray-800 hover:border-gray-400 dark:border-white/15 dark:bg-[#0b0d11] dark:text-gray-200 dark:hover:border-white/30",
  chipOn: "border-primary/90 bg-orange-50 text-orange-950 dark:border-primary dark:bg-primary/15 dark:text-orange-100",
  chipDisabled: "cursor-not-allowed border-gray-200 bg-transparent text-gray-500 dark:border-white/5",
  primaryButton: `flex h-11 items-center justify-center gap-2 rounded-lg bg-orange-700 px-4 font-albert text-sm font-semibold text-white hover:bg-orange-800 dark:bg-primary dark:text-black dark:hover:bg-primary ${focusRing}`,
  secondaryButton: `flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 font-albert text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-white/20 dark:text-gray-100 dark:hover:bg-white/5 ${focusRing}`,
  iconButton: `flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-100 ${focusRing}`,
} as const;
