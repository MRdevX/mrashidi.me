import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import type { InputVariant } from "@/config/theme.config";

interface CyberpunkInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
  variant?: InputVariant;
}

export const CyberpunkInput = React.forwardRef<HTMLInputElement, CyberpunkInputProps>(
  ({ className, icon, error, variant = "default", ...props }, ref) => {
    const { getInputVariant, getTextColor } = useThemeConfig();

    return (
      <div className="relative">
        {icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${getTextColor("muted")} pointer-events-none`}>
            {icon}
          </div>
        )}
        <Input
          ref={ref}
          className={cn(
            "transition-all duration-300 focus:outline-none",
            getInputVariant(variant),
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
            icon && "pl-10",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CyberpunkInput.displayName = "CyberpunkInput";
