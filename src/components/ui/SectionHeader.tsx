import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps extends HTMLMotionProps<"div"> {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  titleSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  glow?: boolean;
}

const titleSizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
  "2xl": "text-4xl",
  "3xl": "text-5xl",
  "4xl": "text-6xl",
};

export default function SectionHeader({
  title,
  subtitle,
  children,
  className = "",
  titleSize = "3xl",
  glow = true,
  ...props
}: SectionHeaderProps) {
  return (
    <motion.div
      className={cn("mb-8", className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      <h2 className={cn("font-bold text-orange-500 font-cyberpunk", titleSizes[titleSize], glow && "glow-text")}>{title}</h2>
      {subtitle && (
        <motion.p
          className="text-gray-400 mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
