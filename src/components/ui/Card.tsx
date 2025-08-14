import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "glass" | "feature" | "default";
  hover?: boolean;
  className?: string;
  padding?: "sm" | "md" | "lg" | "xl";
}

const cardVariants = {
  glass: "glass-card",
  feature: "feature-card",
  default: "bg-gray-900/50 border border-gray-700 rounded-xl",
};

const paddingVariants = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

export default function Card({
  children,
  variant = "default",
  hover = false,
  className = "",
  padding = "lg",
  ...props
}: CardProps) {
  const baseClasses = cn(
    cardVariants[variant],
    paddingVariants[padding],
    "rounded-xl transition-all duration-200",
    hover && "hover:scale-[1.02] hover:shadow-lg",
    className
  );

  return (
    <motion.div className={baseClasses} whileHover={hover ? { scale: 1.02 } : undefined} {...props}>
      {children}
    </motion.div>
  );
}
