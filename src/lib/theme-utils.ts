export const isValidTheme = (theme: string): theme is "light" | "dark" | "system" => {
  return ["light", "dark", "system"].includes(theme);
};

export const getColorWithOpacity = (color: string, opacity: number): string => {
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }

  if (color.startsWith("rgba(")) {
    return color.replace(/[\d.]+\)$/, `${opacity})`);
  }

  return color;
};

export const THEME_STORAGE_KEY = "theme";

export const saveThemeToStorage = (theme: string): void => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  } catch (error) {
    console.warn("Failed to save theme to storage:", error);
  }
};

export const loadThemeFromStorage = (): string | null => {
  try {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(THEME_STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Failed to load theme from storage:", error);
  }
  return null;
};

export const getSystemThemePreference = (): "light" | "dark" => {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};
