import * as React from "react";
import { cn } from "@/lib/utils";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import type { BadgeVariant } from "@/config/theme.config";

interface CyberpunkBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export const CyberpunkBadge = React.forwardRef<HTMLDivElement, CyberpunkBadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const { getBadgeVariant } = useThemeConfig();

    return (
      <div
        ref={ref}
        className={cn("font-medium transition-all duration-300", getBadgeVariant(variant), className)}
        {...props}
      />
    );
  }
);

CyberpunkBadge.displayName = "CyberpunkBadge";
