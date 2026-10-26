"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "cyberpunk";
}

const SIZE_CLASSES = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

const VARIANT_CLASSES = {
  default: "bg-background border border-input hover:bg-accent hover:text-accent-foreground",
  minimal: "hover:bg-accent hover:text-accent-foreground",
  cyberpunk:
    "bg-transparent border border-primary/20 hover:border-primary hover:bg-primary/10 text-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,95,31,0.3)]",
} as const;

const ICON_SIZES = {
  sm: "h-[1rem] w-[1rem]",
  md: "h-[1.2rem] w-[1.2rem]",
  lg: "h-[1.4rem] w-[1.4rem]",
} as const;

function ThemeToggleInner({ className, size = "md", variant = "cyberpunk" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(newTheme);
  };

  const getIcon = () => {
    const iconSize = ICON_SIZES[size];

    if (theme === "system") {
      return <Monitor className={iconSize} />;
    }

    return resolvedTheme === "dark" ? <Moon className={iconSize} /> : <Sun className={iconSize} />;
  };

  const getAriaLabel = () => {
    if (theme === "system") {
      return `System theme (${resolvedTheme}) - Click to switch to ${resolvedTheme === "dark" ? "light" : "dark"}`;
    }
    return `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`;
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          SIZE_CLASSES[size],
          VARIANT_CLASSES[variant],
          className
        )}
        aria-label="Loading theme toggle"
        disabled
      >
        <div className={ICON_SIZES[size]} />
        <span className="sr-only">Loading theme toggle</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className
      )}
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export function ThemeToggle(props: ThemeToggleProps) {
  const [hasThemeProvider, setHasThemeProvider] = useState(false);

  useEffect(() => {
    setHasThemeProvider(true);
  }, []);

  if (!hasThemeProvider) {
    return (
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          SIZE_CLASSES[props.size || "md"],
          VARIANT_CLASSES[props.variant || "cyberpunk"],
          props.className
        )}
        aria-label="Loading theme toggle"
        disabled
      >
        <div className={ICON_SIZES[props.size || "md"]} />
        <span className="sr-only">Loading theme toggle</span>
      </button>
    );
  }

  return <ThemeToggleInner {...props} />;
}
