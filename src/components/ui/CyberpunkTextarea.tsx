import * as React from "react";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import type { TextareaVariant } from "@/config/theme.config";

interface CyberpunkTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  variant?: TextareaVariant;
}

export const CyberpunkTextarea = React.forwardRef<HTMLTextAreaElement, CyberpunkTextareaProps>(
  ({ className, error, variant = "default", ...props }, ref) => {
    const { getTextareaVariant } = useThemeConfig();

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
