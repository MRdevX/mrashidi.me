import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "7xl";
  padding?: "sm" | "md" | "lg" | "xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "7xl": "max-w-7xl",
};

const paddingClasses = {
  sm: "px-2",
  md: "px-4",
  lg: "px-6",
  xl: "px-8",
};

export default function PageContainer({
  children,
  className = "",
  maxWidth = "4xl",
  padding = "md",
  ...props
}: PageContainerProps) {
  return (
    <motion.div
      className={cn("min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      <div className={cn("mx-auto", maxWidthClasses[maxWidth], paddingClasses[padding])}>{children}</div>
    </motion.div>
  );
}
