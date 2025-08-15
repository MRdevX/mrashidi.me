import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./Button";
import { cn } from "@/lib/utils";

interface CyberpunkButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "neon" | "primary" | "secondary" | "ghost" | "default" | "outline" | "destructive" | "link";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  animate?: boolean;
}

const cyberpunkVariants = {
  neon: "font-cyberpunk text-orange-500 border-2 border-orange-500 bg-transparent hover:bg-orange-500 hover:text-black text-shadow-neon transition-all duration-300 shadow-[0_0_20px_rgba(255,95,31,0.2)] hover:shadow-[0_0_40px_rgba(255,95,31,0.4)] px-6 py-3 text-base",
  primary:
    "font-cyberpunk bg-orange-500 hover:bg-orange-600 text-black border-2 border-orange-500 shadow-[0_0_15px_rgba(255,95,31,0.3)] px-6 py-3 text-base",
  secondary: "font-cyberpunk bg-gray-800 hover:bg-gray-700 text-gray-200 border-2 border-gray-600 px-6 py-3 text-base",
  ghost: "font-cyberpunk bg-transparent hover:bg-gray-800 text-gray-300 border-2 border-gray-600 px-6 py-3 text-base",
  default: "font-cyberpunk bg-orange-500 hover:bg-orange-600 text-black border-2 border-orange-500 px-6 py-3 text-base",
  outline:
    "font-cyberpunk border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black px-6 py-3 text-base",
  destructive: "font-cyberpunk bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 px-6 py-3 text-base",
  link: "font-cyberpunk text-orange-500 underline-offset-4 hover:underline px-6 py-3 text-base",
};

export const CyberpunkButton = React.forwardRef<HTMLButtonElement, CyberpunkButtonProps>(
  (
    {
      className,
      variant = "neon",
      loading = false,
      icon,
      iconPosition = "left",
      animate = true,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const renderContent = () => {
      if (loading) {
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {children}
          </>
        );
      }

      if (icon) {
        if (iconPosition === "right") {
          return (
            <>
              {children}
              {icon}
            </>
          );
        }
        return (
          <>
            {icon}
            {children}
          </>
        );
      }

      return children;
    };

    const buttonElement = (
      <Button
        ref={ref}
        className={cn(
          "transition-all duration-300 focus:ring-2 focus:ring-orange-500/50",
          cyberpunkVariants[variant as keyof typeof cyberpunkVariants],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {renderContent()}
      </Button>
    );

    if (animate && !disabled && !loading) {
      return (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
          {buttonElement}
        </motion.div>
      );
    }

    return buttonElement;
  }
);

CyberpunkButton.displayName = "CyberpunkButton";
