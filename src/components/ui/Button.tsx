/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "neon" | "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const buttonVariants = {
  neon: "neon-button",
  primary: "bg-orange-500 hover:bg-orange-600 text-white border border-orange-500",
  secondary: "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600",
  ghost: "bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-600",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "neon",
  size = "md",
  loading = false,
  disabled,
  className = "",
  icon,
  iconPosition = "left",
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed",
    buttonVariants[variant],
    buttonSizes[size],
    className
  );

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

  return (
    <motion.button
      className={baseClasses}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      {...(props as any)}
    >
      {renderContent()}
    </motion.button>
  );
}
