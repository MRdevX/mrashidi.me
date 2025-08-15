import * as React from "react";
import { cn } from "@/lib/utils";

interface CyberpunkBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "neon" | "tech" | "status";
  size?: "default" | "secondary" | "destructive" | "outline";
}

const cyberpunkVariants = {
  default: "bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30",
  secondary: "bg-gray-800/60 text-gray-300 border-gray-600/30 hover:bg-gray-800/80",
  destructive: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30",
  outline: "border-orange-500/50 text-orange-400 hover:bg-orange-500/20",
  neon: "bg-orange-500/10 text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(255,95,31,0.3)] hover:shadow-[0_0_15px_rgba(255,95,31,0.5)]",
  tech: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30",
  status: "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30",
};

export const CyberpunkBadge = React.forwardRef<HTMLDivElement, CyberpunkBadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "font-medium transition-all duration-300",
          cyberpunkVariants[variant as keyof typeof cyberpunkVariants],
          className
        )}
        {...props}
      />
    );
  }
);

CyberpunkBadge.displayName = "CyberpunkBadge";
