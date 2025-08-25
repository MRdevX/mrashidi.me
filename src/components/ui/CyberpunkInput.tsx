import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface CyberpunkInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
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

export const CyberpunkInput = React.forwardRef<HTMLInputElement, CyberpunkInputProps>(
  ({ className, icon, error, variant = "default", ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <Input
          ref={ref}
          className={cn(
            "transition-all duration-300 focus:outline-none",
            cyberpunkVariants[variant],
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
