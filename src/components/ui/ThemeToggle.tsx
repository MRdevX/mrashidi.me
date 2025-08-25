"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "cyberpunk";
}

export function ThemeToggle({ className, size = "md", variant = "cyberpunk" }: ThemeToggleProps) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const variantClasses = {
    default: "bg-background border border-input hover:bg-accent hover:text-accent-foreground",
    minimal: "hover:bg-accent hover:text-accent-foreground",
    cyberpunk:
      "bg-transparent border border-primary/20 hover:border-primary hover:bg-primary/10 text-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,95,31,0.3)]",
  };

  const getIcon = () => {
    if (theme === "system") {
      return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
    }
    return resolvedTheme === "dark" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />;
  };

  const getAriaLabel = () => {
    if (theme === "system") {
      return `System theme (${resolvedTheme}) - Click to switch to ${resolvedTheme === "dark" ? "light" : "dark"}`;
    }
    return `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`;
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
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
