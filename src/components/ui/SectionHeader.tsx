import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useThemeConfig } from "@/hooks/useThemeConfig";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
  delay?: number;
  size?: "sm" | "md" | "lg";
}

export function SectionHeader({ icon: Icon, title, className = "", delay = 0, size = "md" }: SectionHeaderProps) {
  const { getSectionTitle } = useThemeConfig();

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const titleSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl sm:text-4xl",
  };

  const defaultSpacing = "mb-8";

  return (
    <motion.div
      className={`flex items-center gap-3 ${defaultSpacing} ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Icon className={`${sizeClasses[size]} text-orange-500`} />
      <h1 className={`${titleSizes[size]} font-bold ${getSectionTitle()}`}>{title}</h1>
    </motion.div>
  );
}
