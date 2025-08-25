"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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

export function ThemeToggle({ className, size = "md", variant = "cyberpunk" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem("theme");
    if (stored && ["light", "dark", "system"].includes(stored)) {
      setTheme(stored as "light" | "dark" | "system");
    }

    const isDark = document.documentElement.classList.contains("dark");
    setResolvedTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setResolvedTheme(systemTheme);
      document.documentElement.classList.toggle("dark", systemTheme === "dark");
    } else {
      setResolvedTheme(newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
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
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
