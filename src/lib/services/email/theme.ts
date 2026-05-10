/**
 * Canonical colors for transactional email HTML (Tailwind/CSS variables are not available at send time).
 * Primary matches `--primary` / `tailwind.config.ts` (#ff5f1f).
 */
export const emailTheme = {
  /** hsl(16, 100%, 56%) */
  primary: "#ff5f1f",
  primaryRgb: "255, 95, 31" as const,
  primaryForeground: "#000000",

  lightBg: "#f8fafc",
  lightCard: "#ffffff",
  lightTextBody: "#334155",
  lightTextTitle: "#1e293b",
  lightTextMuted: "#64748b",
  lightTextSubtle: "#94a3b8",
  lightTextParagraph: "#475569",
  lightBorder: "#e2e8f0",
  lightBorderMuted: "#f1f5f9",

  darkBgPage: "#0f172a",
  darkCard: "#1e293b",
  darkTextBody: "#e2e8f0",
  darkTextMuted: "#cbd5e1",
  darkTextTitle: "#f1f5f9",
  darkTextLabel: "#94a3b8",
  darkBorder: "#334155",
  darkMessageBoxBg: "#334155",
  darkMessageBorder: "#475569",

  radiusMd: "8px",
  radiusLg: "12px",
  fontStack: `"Albert Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  shadowCard: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  shadowCardDark: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
} as const;

/** Single stylesheet for Albert Sans weights used in templates (avoids repeating `<Font>` / universal `*` rules). */
export const emailAlbertSansStylesheetHref =
  "https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700&display=swap";

const {
  primary,
  primaryRgb,
  darkBgPage,
  darkCard,
  darkTextBody,
  darkTextMuted,
  darkTextTitle,
  darkTextLabel,
  darkBorder,
} = emailTheme;

/**
 * Shared dark-mode rules for `prefers-color-scheme` and Outlook `[data-ogsc]` (partial dark invert).
 */
function darkRules(): string {
  return `
    .dark-mode-body {
      background-color: ${darkBgPage} !important;
      color: ${darkTextBody} !important;
    }
    .dark-mode-accent-line {
      background-color: ${primary} !important;
    }
    .dark-mode-container {
      background-color: ${darkCard} !important;
      box-shadow: ${emailTheme.shadowCardDark} !important;
    }
    .dark-mode-header {
      background-color: ${darkCard} !important;
      border-bottom-color: ${darkBorder} !important;
    }
    .dark-mode-content {
      background-color: ${darkCard} !important;
    }
    .dark-mode-footer {
      background-color: ${darkBgPage} !important;
    }
    .dark-mode-title {
      color: ${darkTextTitle} !important;
    }
    .dark-mode-text {
      color: ${darkTextMuted} !important;
    }
    .dark-mode-subtext {
      color: ${darkTextLabel} !important;
    }
    .dark-mode-hr {
      border-top-color: ${darkBorder} !important;
    }
    .dark-mode-brand {
      color: ${primary} !important;
    }
    .dark-mode-button {
      background-color: ${primary} !important;
      color: ${emailTheme.primaryForeground} !important;
      box-shadow:
        0 4px 6px -1px rgba(${primaryRgb}, 0.35),
        0 2px 4px -1px rgba(${primaryRgb}, 0.25) !important;
    }
    .dark-mode-message-box {
      background-color: ${emailTheme.darkMessageBoxBg} !important;
      border-color: ${emailTheme.darkMessageBorder} !important;
    }
    .dark-mode-label {
      color: ${primary} !important;
    }
    .dark-mode-message-text {
      color: ${darkTextBody} !important;
    }
    .dark-mode-info-row {
      border-bottom-color: ${darkBorder} !important;
    }
    .dark-mode-info-label {
      color: ${darkTextLabel} !important;
    }
    .dark-mode-info-value {
      color: ${darkTextTitle} !important;
    }
    .dark-mode-footer-text {
      color: ${darkTextLabel} !important;
    }
    .dark-mode-link {
      color: ${primary} !important;
    }
    .dark-mode-admin-divider {
      border-top-color: ${darkBorder} !important;
    }
`;
}

/** Single `@media (prefers-color-scheme: dark)` block + Outlook `[data-ogsc]` mirror. */
export function emailDarkModeStyles(): string {
  return `
  @media (prefers-color-scheme: dark) {
    ${darkRules()}
  }
  ${darkRulesOutlook()}
`;
}

function darkRulesOutlook(): string {
  return `
  [data-ogsc] .dark-mode-body {
    background-color: ${darkBgPage} !important;
    color: ${darkTextBody} !important;
  }
  [data-ogsc] .dark-mode-accent-line {
    background-color: ${primary} !important;
  }
  [data-ogsc] .dark-mode-container {
    background-color: ${darkCard} !important;
    box-shadow: ${emailTheme.shadowCardDark} !important;
  }
  [data-ogsc] .dark-mode-header {
    background-color: ${darkCard} !important;
    border-bottom-color: ${darkBorder} !important;
  }
  [data-ogsc] .dark-mode-content {
    background-color: ${darkCard} !important;
  }
  [data-ogsc] .dark-mode-footer {
    background-color: ${darkBgPage} !important;
  }
  [data-ogsc] .dark-mode-title {
    color: ${darkTextTitle} !important;
  }
  [data-ogsc] .dark-mode-text {
    color: ${darkTextMuted} !important;
  }
  [data-ogsc] .dark-mode-subtext {
    color: ${darkTextLabel} !important;
  }
  [data-ogsc] .dark-mode-hr {
    border-top-color: ${darkBorder} !important;
  }
  [data-ogsc] .dark-mode-brand {
    color: ${primary} !important;
  }
  [data-ogsc] .dark-mode-button {
    background-color: ${primary} !important;
    color: ${emailTheme.primaryForeground} !important;
    box-shadow:
      0 4px 6px -1px rgba(${primaryRgb}, 0.35),
      0 2px 4px -1px rgba(${primaryRgb}, 0.25) !important;
  }
  [data-ogsc] .dark-mode-message-box {
    background-color: ${emailTheme.darkMessageBoxBg} !important;
    border-color: ${emailTheme.darkMessageBorder} !important;
  }
  [data-ogsc] .dark-mode-label {
    color: ${primary} !important;
  }
  [data-ogsc] .dark-mode-message-text {
    color: ${darkTextBody} !important;
  }
  [data-ogsc] .dark-mode-info-row {
    border-bottom-color: ${darkBorder} !important;
  }
  [data-ogsc] .dark-mode-info-label {
    color: ${darkTextLabel} !important;
  }
  [data-ogsc] .dark-mode-info-value {
    color: ${darkTextTitle} !important;
  }
  [data-ogsc] .dark-mode-footer-text {
    color: ${darkTextLabel} !important;
  }
  [data-ogsc] .dark-mode-link {
    color: ${primary} !important;
  }
  [data-ogsc] .dark-mode-admin-divider {
    border-top-color: ${darkBorder} !important;
  }
`;
}
