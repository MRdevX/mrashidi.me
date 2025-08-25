import * as React from "react";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";

interface CyberpunkTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  variant?: "default" | "neon" | "terminal";
}

const cyberpunkVariants = {
  default:
  "bg-white/50 dark:bg-gray-900/50 border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/50",
  neon: "bg-white/30 dark:bg-gray-900/30 border-2 border-orange-500/30 text-gray-800 dark:text-orange-400 placeholder-gray-500 dark:placeholder-orange-500/50 focus:border-orange-500 focus:ring-orange-500/50 shadow-[0_0_10px_rgba(255,95,31,0.2)] focus:shadow-[0_0_20px_rgba(255,95,31,0.4)]",
  terminal:
    "bg-gray-50 dark:bg-black border-2 border-green-500/30 text-gray-800 dark:text-green-400 placeholder-gray-500 dark:placeholder-green-500/50 focus:border-green-500 focus:ring-green-500/50 font-terminal",
};

export const CyberpunkTextarea = React.forwardRef<HTMLTextAreaElement, CyberpunkTextareaProps>(
  ({ className, error, variant = "default", ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        className={cn(
          "transition-all duration-300 focus:outline-none resize-none",
          cyberpunkVariants[variant],
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
          className
        )}
        {...props}
      />
    );
  }
);

CyberpunkTextarea.displayName = "CyberpunkTextarea";
