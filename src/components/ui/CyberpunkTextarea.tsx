import * as React from "react";
import type { TextareaVariant } from "@/config/theme.config";
import { getThemeConfig } from "@/config/theme.config";
import { cn } from "@/lib/utils";
import { Textarea } from "./textarea";

interface CyberpunkTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  variant?: TextareaVariant;
}

export const CyberpunkTextarea = React.forwardRef<HTMLTextAreaElement, CyberpunkTextareaProps>(
  ({ className, error, variant = "default", ...props }, ref) => {
    const { getTextareaVariant } = getThemeConfig();

    return (
      <Textarea
        ref={ref}
        className={cn(
          "transition-all duration-300 focus:outline-none resize-none",
          getTextareaVariant(variant),
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
          className
        )}
        {...props}
      />
    );
  }
);

CyberpunkTextarea.displayName = "CyberpunkTextarea";
